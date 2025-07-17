package com.example.study.controller;

import com.example.study.entity.Marker;
import com.example.study.entity.User;
import com.example.study.repository.MarkerRepository;
import com.example.study.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.List;

@RestController
@RequestMapping("/api/markers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MarkerController {

    private final MarkerRepository markerRepository;
    private final UserRepository userRepository;

    public MarkerController(MarkerRepository markerRepository, UserRepository userRepository) {
        this.markerRepository = markerRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getMarkersByUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("id");
        if (userId == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        // UserRepository에서 ID로 User 객체를 조회
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다");
        }
        List<Marker> markers = markerRepository.findByUser(user);
        return ResponseEntity.ok(markers);
    }

    @PostMapping
    public Marker createMarker(@RequestBody Marker marker) {
        return markerRepository.save(marker);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarker(@PathVariable Long id) {
        markerRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}