package com.example.study.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "room_members")
@IdClass(RoomMemberId.class)
@Getter
@Setter
public class RoomMember {

    @Id
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
