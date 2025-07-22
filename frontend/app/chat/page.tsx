"use client";

import { useEffect, useState } from "react";
import api from "../api";
import ChatRoomWindow from "./chatRoomWindow";

type ChatRoom = {
  id: number;
  name: string;
};

export default function chat() {
  // 로그인 확인
  type UserInfo = {
    id: number;
    username: string;
  };
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    api.get("/api/auth/me")
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
    fetchRooms();
  }, []);


  const [openRoomId, setOpenRoomId] = useState<number | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const fetchRooms = async () => {
    try {
      api.get("/api/rooms").then((res) => {
        const loaded = res.data.map((r: ChatRoom) => ({ ...r, isOpen: false }));
        setChatRooms(loaded);
      });
    } catch (err) {
      console.error("채팅방 불러오기 실패", err);
    }
  };


  return (
    <main className="flex flex-col items-center min-h-screen p-5 bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">채팅</h1>
      <p className="text-lg text-gray-700 mb-6">채팅방을 선택해주세요.</p>

      <div className="flex">
        {chatRooms.map((room) => (
          <div key={room.id} className="relative">
            <button
              className="mr-2 ml-2 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() =>
                setOpenRoomId(prevId => prevId === room.id ? null : room.id)
              }
            >
              {room.name}
            </button>
            {openRoomId === room.id ? (
              <ChatRoomWindow
                userId={user?.id ?? 0}
                username={user?.username ?? ""}
                roomId={room.id}
                roomName={room.name}
              />
            ) : (<></>)}

          </div>))}
      </div>

    </main>
  );
}
