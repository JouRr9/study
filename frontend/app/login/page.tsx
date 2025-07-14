"use client";

import { useState } from "react";
import api from "../api";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await api.post("/api/auth/login", { username, password });
            alert("로그인 성공");
            window.location.href = "/";
        } catch (error: any) {
            const msg = error.response?.data || "로그인 실패";
            alert(msg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-sm bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="아이디"
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="비밀번호"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    로그인
                </button>
            </div>
        </div>
    );
}
