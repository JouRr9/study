"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "./api";



export default function Home() {
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
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      window.location.href = "/";
    } catch (error: any) {
      alert("로그아웃 실패");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">홈페이지</h1>

      {user === null ? (null) : (<p className="text-lg text-gray-700 mb-6">{user.username}님 반갑습니다.</p>)}
      <p className="text-lg text-gray-700 mb-6">이동할 페이지를 선택하세요</p>
      <div className="flex">
        {user !== null ?
          (<div>
            <button
              onClick={handleLogout}
              className="mr-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              로그아웃
            </button>
          </div>)
          :
          (<div>
            <Link href="/login">
              <button className="mr-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                로그인
              </button>
            </Link>
          </div>)}
        <Link href="/map">
          <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            지도
          </button>
        </Link>
      </div>

    </main>
  );
}
