import { useEffect, useRef, useState } from "react";
import api from "../api";

type Message = {
    sender: string;
    message: string;
};

type ChatRoomWindowProps = {
    userId: number;
    username: string;
    roomId: number;
    roomName: string;
};

export default function ChatRoomWindow({
    userId,
    username,
    roomId,
    roomName,
}: ChatRoomWindowProps) {
    const [chats, setChats] = useState<{ senderUsername: string, message: string }[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const ws = useRef<WebSocket | null>(null);

    const setChatHistory = async () => {
        try {
            api.get(`/api/chat/history/${roomId}`).then((res) => {
                setChats(res.data);
            });
        } catch (err) {
            console.error("마커 불러오기 실패", err);
        }
    };

    useEffect(() => {
        setChatHistory()
        ws.current = new WebSocket(`ws://localhost:8080/ws/chat/${roomId}`);

        ws.current.onmessage = (event: MessageEvent) => {
            // 서버에서 받은 데이터는 문자열 (JSON)
            const data = JSON.parse(event.data);

            // data는 { senderUsername: string, message: string } 형태
            const senderUsername = data.senderUsername;
            const message = data.message;

            console.log(`${senderUsername}: ${message}`);

            // 필요하면 상태 업데이트 (예: React state에 새 메시지 추가)
            setChats(prev => [...prev, { senderUsername, message }]);
        };

        ws.current.onopen = () => {
        };

        ws.current.onclose = () => {
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const sendMessage = () => {
        const messagePayload = {
            senderId: userId,  // 로그인한 사용자 ID
            senderUsername: username,
            roomId: roomId,
            message: inputMessage,
        };

        ws.current?.send(JSON.stringify(messagePayload));

        setInputMessage("");
    };

    return (
        <div className="absolute mt-2 left-2 w-[300px] h-[400px] bg-white rounded shadow border flex flex-col">
            <div className="font-bold px-4 py-2 border-b">{roomName}</div>

            <div
                className="flex-1 overflow-y-auto p-2"
            >
                {chats.map((chat, idx) => (
                    <div key={idx} className="mb-1">
                        {chat.senderUsername === username ?
                            (<div className="flex justify-end">{chat.message}</div>)
                            :
                            (<div className="flex justify-start">{chat.senderUsername} : {chat.message}</div>)}
                    </div>
                ))}
            </div>

            <div className="p-2 border-t flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="border p-2 flex-1 mr-2"
                    placeholder="메시지 입력"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2">
                    전송
                </button>
            </div>
        </div>
    );
}
