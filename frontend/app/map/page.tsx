"use client";

import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react"
import api from "../api";

const center = {
    // 지도의 중심좌표
    lat: 37.728375893,
    lng: 127.063047727,
}

type Marker = {
    id: number;
    user_id: string;
    title: string;
    latitude: number;
    longitude: number;
};

export default function MapPage() {
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

        fetchMarkers();
    }, []);
    // 우클릭 이벤트
    const [position, setPosition] = useState<{
        lat: number
        lng: number
    }>()
    // 마커 클릭 이벤트
    const [openMarkerId, setOpenMarkerId] = useState(-1);
    // 디비에서 가져온 마커들
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [title, setTitle] = useState("");

    const fetchMarkers = async () => {
        try {
            api.get("/api/markers").then((res) => {
                const loaded = res.data.map((m: Marker) => ({ ...m, isOpen: false }));
                setMarkers(loaded);
            });
        } catch (err) {
            console.error("마커 불러오기 실패", err);
        }
    };

    // 마커 등록
    const handleSubmit = async () => {
        try {
            await api.post("/api/markers", {
                user_id: user?.id,
                title: title,
                latitude: position?.lat ?? center.lat,
                longitude: position?.lng ?? center.lng,
            });
            setTitle(""); // 입력 초기화
            setOpenMarkerId(-1)
            fetchMarkers();
        } catch (error) {
            alert("등록 실패");
            console.error(error);
        }
    };

    // 마커 삭제
    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/api/markers/${id}`);
            fetchMarkers();
        } catch (error) {
            alert("삭제 실패");
            console.error(error);
        }
    };
    return (
        <div className="w-full h-screen">
            <Map // 지도를 표시할 컨테이너
                center={center}
                className="w-full h-full"
                level={4}

                // 지도 누르면 마커 이벤트 지우기
                onClick={() => setOpenMarkerId(-1)}
                // 우클릭 한 곳에 마커를 찍기 위한 좌표
                onRightClick={(_, mouseEvent) => {
                    const latlng = mouseEvent.latLng
                    setPosition({
                        lat: latlng.getLat(),
                        lng: latlng.getLng(),
                    })
                    setOpenMarkerId(0)
                    setTitle("")
                }}
            >
                <>
                    {openMarkerId === 0 && user !== null && (
                        <CustomOverlayMap position={position ?? center}
                            clickable={true}
                        >
                            <div className="w-3 h-3 bg-red-500 rounded-full transform -translate-x-[-620%] -translate-y-[-300%]" />
                            <div className="flex flex-col items-center justify-center relative min-w-[160px] bg-white rounded-lg shadow p-2 text-black whitespace-nowrap transform -translate-x-[-50%] -translate-y-[-50%]">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="장소명 입력"
                                    className="w-full mb-1 border-1"
                                />
                                <button onClick={handleSubmit} className="w-full border-1">
                                    등록
                                </button></div>
                        </CustomOverlayMap>)}</>


                {markers.map((marker, index) => (
                    <div key={marker.id}>
                        <MapMarker position={{  // 마커
                            lat: marker.latitude,
                            lng: marker.longitude,
                        }}
                            clickable={true}
                            onClick={() => setOpenMarkerId(marker.id)}
                        />
                        {openMarkerId === marker.id && (
                            <CustomOverlayMap position={{
                                lat: marker.latitude,
                                lng: marker.longitude,
                            }}
                                clickable={true}
                            >
                                <div className="relative min-w-[160px] bg-white rounded-lg shadow p-2 text-black whitespace-nowrap transform -translate-y-[160%]">
                                    <img
                                        alt="close"
                                        width="14"
                                        height="13"
                                        src="https://t1.daumcdn.net/localimg/localimages/07/mapjsapi/2x/bt_close.gif"
                                        className="absolute right-[5px] top-[5px] cursor-pointer"
                                        onClick={() => handleDelete(marker.id)}
                                    />
                                    <div className="p-[5px] text-black">{marker.title}</div>
                                </div>
                            </CustomOverlayMap>
                        )}
                    </div>
                ))}
            </Map>
            <p>
                <em>지도를 클릭해주세요!</em>
            </p>
            <div id="clickLatlng">
                {position &&
                    `클릭한 위치의 위도는 ${position.lat} 이고, 경도는 ${position.lng} 입니다`}
            </div>
        </div>
    );
}
