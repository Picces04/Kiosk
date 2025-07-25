'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Camera,
    CreditCard,
    X,
    RotateCcw,
    CheckCircle,
    AlertCircle,
    Scan,
} from 'lucide-react';

interface CCCDScannerProps {
    onScanSuccess: (cccd: string) => void;
    onClose: () => void;
}

const CCCDScanner = ({ onScanSuccess, onClose }: CCCDScannerProps) => {
    const [scanningMode, setScanningMode] = useState<
        'camera' | 'reader' | null
    >(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    const startCameraScanning = async () => {
        setScanningMode('camera');
        setIsScanning(true);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 1280 },
                    facingMode: 'environment',
                },
            });

            setCameraStream(stream);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            setTimeout(simulateScanResult, 3000);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError(
                'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.'
            );
            setIsScanning(false);
        }
    };

    const startReaderScanning = () => {
        setScanningMode('reader');
        setIsScanning(true);
        setError(null);
        setTimeout(simulateScanResult, 2000);
    };

    const simulateScanResult = () => {
        const mockCCCDs = ['123456789012', '987654321098', '111222333444'];
        const randomCCCD =
            mockCCCDs[Math.floor(Math.random() * mockCCCDs.length)];

        if (Math.random() > 0.2) {
            setScanResult(randomCCCD);
            setIsScanning(false);
            setTimeout(() => onScanSuccess(randomCCCD), 2000);
        } else {
            setError(
                'Không thể đọc thẻ CCCD. Vui lòng thử lại hoặc nhập thủ công.'
            );
            setIsScanning(false);
        }
    };

    const retryScanning = () => {
        setScanResult(null);
        setError(null);
        if (scanningMode === 'camera') {
            startCameraScanning();
        } else {
            startReaderScanning();
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    const confirmScanResult = () => {
        if (scanResult) {
            onScanSuccess(scanResult);
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            Quét Thẻ CCCD
                        </h3>
                        <p className="text-gray-600">
                            Chọn phương thức quét thẻ căn cước công dân
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {!scanningMode && !scanResult && !error && (
                        <div className="text-center">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <button
                                    onClick={startCameraScanning}
                                    className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-2xl p-8 transition-all duration-300 group"
                                >
                                    <div className="text-center">
                                        <div className="bg-blue-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Camera
                                                className="text-white"
                                                size={48}
                                            />
                                        </div>
                                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                            Quét bằng Camera
                                        </h4>
                                        <p className="text-gray-600">
                                            Sử dụng camera để quét thông tin
                                            trên thẻ CCCD
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={startReaderScanning}
                                    className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-2xl p-8 transition-all duration-300 group"
                                >
                                    <div className="text-center">
                                        <div className="bg-green-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <CreditCard
                                                className="text-white"
                                                size={48}
                                            />
                                        </div>
                                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                            Đọc thẻ từ
                                        </h4>
                                        <p className="text-gray-600">
                                            Đặt thẻ CCCD lên đầu đọc thẻ từ
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <p className="text-gray-500 mb-4">
                                Hoặc bạn có thể nhập số CCCD thủ công
                            </p>
                            <button
                                onClick={handleClose}
                                className="text-blue-500 hover:text-blue-600 font-semibold"
                            >
                                Nhập thủ công
                            </button>
                        </div>
                    )}

                    {scanningMode === 'camera' && (
                        <div className="text-center">
                            <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-6">
                                <video
                                    ref={videoRef}
                                    className="w-full h-80 object-cover"
                                    autoPlay
                                    muted
                                    playsInline
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="border-4 border-blue-500 rounded-2xl w-80 h-48 relative">
                                        {isScanning && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="bg-[rgba(59,130,246,0.2)] rounded-lg p-4">
                                                    <Scan
                                                        className="text-blue-500 animate-pulse"
                                                        size={32}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <p className="text-blue-800 font-medium">
                                    Đặt thẻ CCCD trong khung hình và giữ thẳng
                                </p>
                                <p className="text-blue-600 text-sm mt-1">
                                    Đảm bảo thẻ được chiếu sáng đầy đủ và không
                                    bị mờ
                                </p>
                            </div>
                        </div>
                    )}

                    {scanningMode === 'reader' && (
                        <div className="text-center">
                            <div className="bg-gray-100 rounded-2xl p-12 mb-6 relative">
                                <CreditCard
                                    size={120}
                                    className="text-gray-400 mx-auto mb-4"
                                />
                                {isScanning && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 mb-6">
                                <p className="text-green-800 font-medium">
                                    Đặt thẻ CCCD lên đầu đọc thẻ từ
                                </p>
                                <p className="text-green-600 text-sm mt-1">
                                    Giữ thẻ ổn định cho đến khi có tín hiệu hoàn
                                    thành
                                </p>
                            </div>
                        </div>
                    )}

                    {isScanning && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-lg font-semibold text-gray-900 mb-2">
                                Đang quét thẻ CCCD...
                            </p>
                            <p className="text-gray-600">
                                Vui lòng giữ thẻ ổn định
                            </p>
                        </div>
                    )}

                    {scanResult && (
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                                <CheckCircle
                                    className="text-green-500"
                                    size={48}
                                />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                Quét thành công!
                            </h4>
                            <p className="text-gray-600 mb-4">
                                Số CCCD đã được đọc:
                            </p>
                            <div className="bg-gray-100 rounded-xl p-4 mb-6">
                                <p className="text-2xl font-mono font-bold text-gray-900">
                                    {scanResult}
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={confirmScanResult}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={retryScanning}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                                >
                                    Quét lại
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center">
                            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                                <AlertCircle
                                    className="text-red-500"
                                    size={48}
                                />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                Quét không thành công
                            </h4>
                            <p className="text-red-600 mb-6">{error}</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={retryScanning}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 flex items-center"
                                >
                                    <RotateCcw className="mr-2" size={20} />
                                    Thử lại
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
                                >
                                    Nhập thủ công
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CCCDScanner;
