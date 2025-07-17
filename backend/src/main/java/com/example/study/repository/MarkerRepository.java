package com.example.study.repository;

import com.example.study.entity.Marker;
import com.example.study.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarkerRepository extends JpaRepository<Marker, Long> {
    List<Marker> findByUser(User user);

}
