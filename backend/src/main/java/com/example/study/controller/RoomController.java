package com.example.study.controller;

import com.example.study.entity.Room;
import com.example.study.entity.RoomMember;
import com.example.study.entity.User;
import com.example.study.repository.ChatRoomRepository;
import com.example.study.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final ChatRoomRepository roomRepository;
    private final UserRepository userRepository;

    public RoomController(ChatRoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getRoomsByUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다");
        }

        List<RoomMember> rooms = roomRepository.findByUser(user);

        List<Room> roomList = rooms.stream()
                .map(RoomMember::getRoom)
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(roomList);
    }
}