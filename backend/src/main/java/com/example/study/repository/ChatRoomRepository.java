package com.example.study.repository;

import com.example.study.entity.RoomMember;
import com.example.study.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<RoomMember, Long> {
    List<RoomMember> findByUser(User user);
}
