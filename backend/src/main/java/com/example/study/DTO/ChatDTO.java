package com.example.study.DTO;

public class ChatDTO {
    private Long senderId;        // User id
    private Long roomId;          // Room id
    private String message;

    public ChatDTO() {}

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
