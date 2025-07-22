package com.example.study.controller;

import com.example.study.entity.Chat;
import com.example.study.repository.ChatRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatRepository chatRepository;

    public ChatController(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @GetMapping("/history/{roomId}")
    public List<Map<String, String>> getRecentChats(@PathVariable Long roomId) {
        List<Chat> chats = chatRepository.findTop30ByRoomOrderByTimestampDesc(roomId);

        // 유저네임과 메시지만 보내기
        return chats.stream()
                .map(chat -> Map.of(
                        "senderUsername", chat.getUser().getUsername(),
                        "message", chat.getMessage()
                ))
                .toList();
    }
}
