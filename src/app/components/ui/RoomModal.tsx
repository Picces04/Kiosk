import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Clock, CheckCircle } from 'lucide-react';
import { mockAPI } from '@/app/services/mockAPI';
import type { Service, Room } from '@/app/context/AppContext';

interface RoomModalProps {
    service: Service;
    onRoomSelect: (room: Room) => void;
    onClose: () => void;
}

const RoomModal = ({ service, onRoomSelect, onClose }: RoomModalProps) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            const data = await mockAPI.getRooms(service.id);
            setRooms(data); // giả định mockAPI.getRooms() trả về Room[]
            setLoading(false);
        };

        fetchRooms();
    }, [service.id]);

    // phần còn lại giữ nguyên

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Chọn Phòng Khám
                        </h3>
                        <p className="text-gray-600">Dịch vụ: {service.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">
                            Đang tải danh sách phòng...
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                className={`rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                                    room.available
                                        ? 'border-green-200 bg-green-50 hover:border-green-300 hover:shadow-md'
                                        : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                }`}
                                onClick={() =>
                                    room.available && onRoomSelect(room)
                                }
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div
                                            className={`rounded-lg p-3 ${
                                                room.available
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400'
                                            }`}
                                        >
                                            <MapPin
                                                className="text-white"
                                                size={20}
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="font-semibold text-gray-900">
                                                {room.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Phòng {room.id}
                                            </p>
                                        </div>
                                    </div>
                                    {room.available && (
                                        <CheckCircle
                                            className="text-green-500"
                                            size={20}
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <User size={16} className="mr-2" />
                                        <span className="text-sm">
                                            Bác sĩ: {room.doctor}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock size={16} className="mr-2" />
                                        <span className="text-sm">
                                            {room.available
                                                ? 'Đang hoạt động'
                                                : 'Tạm ngưng'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <button
                                        disabled={!room.available}
                                        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer ${
                                            room.available
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {room.available
                                            ? 'Chọn phòng này'
                                            : 'Không khả dụng'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && rooms.length === 0 && (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                            <MapPin size={48} className="mx-auto" />
                        </div>
                        <p className="text-gray-600">
                            Không có phòng khám nào khả dụng
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomModal;
