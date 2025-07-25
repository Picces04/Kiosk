'use client';

import React, { useState } from 'react';
import { CreditCard, User, Phone, Calendar, Scan } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { mockAPI } from '../services/mockAPI';
import NumericKeyboard from './ui/NumericKeyboard';
import CCCDScanner from './ui/CCCDScanner';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ui/use-toast';

const PatientInfo: React.FC = () => {
    const { setCurrentStep, patient, setPatient } = useAppContext();
    const [cccd, setCccd] = useState('');
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [patientForm, setPatientForm] = useState({
        name: '',
        dob: '',
        gender: '',
        ward: '',
        province: '',
        phone: '',
        ethnicity: '',
        job: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [patientExists, setPatientExists] = useState(false);
    const [showPhoneKeyboard, setShowPhoneKeyboard] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleScanSuccess = async (scannedCCCD: string) => {
        setCccd(scannedCCCD);
        setShowScanner(false);

        // CCCD check
        const insuranceData = await mockAPI.checkInsurance(scannedCCCD);
        if (!insuranceData) {
            toast({
                title: 'Không tìm thấy thông tin bảo hiểm',
                description: 'Vui lòng chuyển sang khám dịch vụ.',
            });
            router.push('/');
        }

        const existingPatient = await mockAPI.getPatientByCCCD(scannedCCCD);
        if (existingPatient) {
            setPatient(existingPatient);
            setPatientExists(true);
        } else {
            setShowForm(true);
        }
    };

    const handleCCCDSubmit = async () => {
        if (cccd.length !== 12) {
            alert('CCCD phải có 12 số');
            return;
        }

        const insuranceData = await mockAPI.checkInsurance(cccd);
        if (!insuranceData) {
            toast({
                title: 'Không tìm thấy thông tin bảo hiểm',
                description: 'Vui lòng chuyển sang khám dịch vụ.',
            });
            router.push('/');
        }

        const existingPatient = await mockAPI.getPatientByCCCD(cccd);
        if (existingPatient) {
            setPatient(existingPatient);
            setPatientExists(true);
        } else {
            setShowForm(true);
        }
    };

    const handleFormSubmit = () => {
        if (
            !patientForm.name ||
            !patientForm.dob ||
            !patientForm.gender ||
            !patientForm.phone
        ) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        const newPatient = {
            cccd,
            ...patientForm,
        };

        setPatient(newPatient);
        setPatientExists(true);
    };

    const handleNext = () => {
        setCurrentStep(2);
    };

    if (patientExists && patient) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Thông Tin Bệnh Nhân
                        </h2>
                        <p className="text-gray-600">
                            Xác nhận thông tin của bạn
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số CCCD
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.cccd}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày sinh
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.dob}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giới tính
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.gender}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.phone}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phường/Xã
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.ward}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tỉnh/Thành phố
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.province}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nghề nghiệp
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {patient.job}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleNext}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-12 rounded-xl transition-colors duration-200 text-lg"
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Nhập Thông Tin Bệnh Nhân
                        </h2>
                        <p className="text-gray-600">
                            Vui lòng cung cấp thông tin chi tiết
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    value={patientForm.name}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày sinh *
                                </label>
                                <input
                                    type="date"
                                    value={patientForm.dob}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            dob: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới tính *
                                </label>
                                <select
                                    value={patientForm.gender}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            gender: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={patientForm.phone}
                                        readOnly
                                        onClick={() =>
                                            setShowPhoneKeyboard(true)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg cursor-pointer"
                                        placeholder="Nhấn để nhập số điện thoại"
                                    />
                                    <Phone
                                        className="absolute right-3 top-3 text-gray-400"
                                        size={20}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phường/Xã
                                </label>
                                <select
                                    value={patientForm.ward}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            ward: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                >
                                    <option value="">Chọn phường/xã</option>
                                    <option value="Phường 1">Phường 1</option>
                                    <option value="Phường 2">Phường 2</option>
                                    <option value="Xã A">Xã A</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    value={patientForm.province}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            province: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                >
                                    <option value="">
                                        Chọn tỉnh/thành phố
                                    </option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="TP. Hồ Chí Minh">
                                        TP. Hồ Chí Minh
                                    </option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dân tộc
                                </label>
                                <select
                                    value={patientForm.ethnicity}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            ethnicity: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                >
                                    <option value="">Chọn dân tộc</option>
                                    <option value="Kinh">Kinh</option>
                                    <option value="Tày">Tày</option>
                                    <option value="Thái">Thái</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nghề nghiệp
                                </label>
                                <select
                                    value={patientForm.job}
                                    onChange={e =>
                                        setPatientForm({
                                            ...patientForm,
                                            job: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                >
                                    <option value="">Chọn nghề nghiệp</option>
                                    <option value="Nhân viên văn phòng">
                                        Nhân viên văn phòng
                                    </option>
                                    <option value="Công nhân">Công nhân</option>
                                    <option value="Học sinh/Sinh viên">
                                        Học sinh/Sinh viên
                                    </option>
                                    <option value="Nghỉ hưu">Nghỉ hưu</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleFormSubmit}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-12 rounded-xl transition-colors duration-200 text-lg"
                        >
                            Xác nhận thông tin
                        </button>
                    </div>
                </div>

                {showPhoneKeyboard && (
                    <NumericKeyboard
                        value={patientForm.phone}
                        onChange={value =>
                            setPatientForm({ ...patientForm, phone: value })
                        }
                        onClose={() => setShowPhoneKeyboard(false)}
                        maxLength={10}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Nhập Số CCCD
                    </h2>
                    <p className="text-gray-600">
                        Vui lòng nhập số căn cước công dân (12 số)
                    </p>
                </div>

                <div className="max-w-md mx-auto mb-8">
                    <div
                        className="relative cursor-pointer "
                        onClick={() => setShowKeyboard(true)}
                    >
                        <input
                            type="text"
                            value={cccd}
                            readOnly
                            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-semibold text-center cursor-pointer "
                            placeholder="Nhấn để nhập CCCD"
                        />
                        <CreditCard
                            className="absolute right-4 top-4 text-gray-400"
                            size={24}
                        />
                    </div>

                    {/* Scan CCCD Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => setShowScanner(true)}
                            className="flex items-center justify-center text-lg w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 cursor-pointer"
                        >
                            <Scan className="mr-3" size={24} />
                            Quét thẻ CCCD
                        </button>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleCCCDSubmit}
                        disabled={cccd.length !== 12}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-4 px-12 rounded-xl transition-colors duration-200 text-lg cursor-pointer"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>

            {showKeyboard && (
                <NumericKeyboard
                    value={cccd}
                    onChange={setCccd}
                    onClose={() => setShowKeyboard(false)}
                    maxLength={12}
                />
            )}

            {showScanner && (
                <CCCDScanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default PatientInfo;
