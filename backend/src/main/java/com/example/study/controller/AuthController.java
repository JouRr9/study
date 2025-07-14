// src/main/java/com/example/study/controller/AuthController.java

package com.example.study.controller;

import com.example.study.entity.User;
import com.example.study.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if (user.getPassword().equals(password)) {
                        session.setAttribute("user", user); // ✅ 세션에 사용자 저장
                        return ResponseEntity.ok("로그인 성공");
                    } else {
                        return ResponseEntity.status(401).body("비밀번호 불일치");
                    }
                })
                .orElse(ResponseEntity.status(401).body("존재하지 않는 사용자"));
    }
    // 로그인 상태 확인 API
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user.getUsername()); // 필요한 사용자 정보만 반환
        } else {
            return ResponseEntity.status(401).body("로그인 필요");
        }
    }

    // 로그아웃 API
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃 성공");
    }
}
