package com.example.study;

import com.example.study.repository.ChatRepository;
import com.example.study.repository.RoomRepository;
import com.example.study.repository.UserRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public WebSocketConfig(ChatRepository chatRepository, UserRepository userRepository, RoomRepository roomRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatWebSocketHandler(chatRepository, userRepository, roomRepository), "/ws/chat/*")
                .setAllowedOrigins("*");
    }
}