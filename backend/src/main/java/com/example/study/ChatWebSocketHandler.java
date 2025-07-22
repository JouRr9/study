package com.example.study;


import com.example.study.entity.Chat;
import com.example.study.entity.User;
import com.example.study.entity.Room;
import com.example.study.repository.ChatRepository;
import com.example.study.repository.UserRepository;
import com.example.study.repository.RoomRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public ChatWebSocketHandler(ChatRepository chatRepository, UserRepository userRepository, RoomRepository roomRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }


    private static final Set<WebSocketSession> sessions =
            Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ObjectMapper mapper = new ObjectMapper();

        // json받고 map으로 변환
        Map<String, Object> data = mapper.readValue(payload, new TypeReference<Map<String, Object>>() {});

        Long roomId = Long.valueOf(data.get("roomId").toString());
        Long senderId = Long.valueOf(data.get("senderId").toString());
        String messageText = (String) data.get("message");

        Room room = roomRepository.findById(roomId).orElseThrow();
        User user = userRepository.findById(senderId).orElseThrow();

        Chat chat = new Chat();
        chat.setRoom(room);
        chat.setUser(user);
        chat.setMessage(messageText);

        chatRepository.save(chat);

        String broadcastPayload = mapper.writeValueAsString(
                Map.of(
                        "senderUsername", chat.getUser().getUsername(),
                        "message", chat.getMessage()
                )
        );

        for (WebSocketSession ws : sessions) {
            if (ws.isOpen()) {
                ws.sendMessage(new TextMessage(broadcastPayload));
            }
        }
    }
}