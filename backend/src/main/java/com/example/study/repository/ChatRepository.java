package com.example.study.repository;

import com.example.study.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT c FROM Chat c WHERE c.room.id = :roomId ORDER BY c.timestamp DESC")
    List<Chat> findTop30ByRoomOrderByTimestampDesc(@Param("roomId") Long roomId);
}
