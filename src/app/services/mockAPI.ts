import type {
    Patient,
    Service,
    Room,
    Appointment,
} from '../context/AppContext';

export const mockAPI = {
    async checkInsurance(
        cccd: string
    ): Promise<{ hasInsurance: boolean } | null> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const validCCCDs = ['123456789012', '987654321098', '111222333444'];
        return validCCCDs.includes(cccd) ? { hasInsurance: true } : null;
    },

    async getPatientByCCCD(cccd: string): Promise<Patient | null> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const existingPatients: { [key: string]: Patient } = {
            '123456789012': {
                cccd: '123456789012',
                name: 'Nguyễn Văn An',
                dob: '1985-03-15',
                gender: 'Nam',
                ward: 'Phường 1',
                province: 'Hà Nội',
                phone: '0901234567',
                ethnicity: 'Kinh',
                job: 'Nhân viên văn phòng',
            },
            '987654321098': {
                cccd: '987654321098',
                name: 'Trần Thị Bình',
                dob: '1990-08-22',
                gender: 'Nữ',
                ward: 'Phường 2',
                province: 'TP. Hồ Chí Minh',
                phone: '0912345678',
                ethnicity: 'Kinh',
                job: 'Công nhân',
            },
        };

        return existingPatients[cccd] || null;
    },

    async getServices(): Promise<Service[]> {
        await new Promise(resolve => setTimeout(resolve, 1200));

        return [
            {
                id: 'general',
                name: 'Khám Tổng Quát',
                price: 150000,
                department: 'Khoa Khám Bệnh',
            },
            {
                id: 'cardiology',
                name: 'Khám Tim Mạch',
                price: 200000,
                department: 'Khoa Tim Mạch',
            },
            {
                id: 'dermatology',
                name: 'Khám Da Liễu',
                price: 180000,
                department: 'Khoa Da Liễu',
            },
            {
                id: 'orthopedics',
                name: 'Khám Xương Khớp',
                price: 220000,
                department: 'Khoa Xương Khớp',
            },
            {
                id: 'gastroenterology',
                name: 'Khám Tiêu Hóa',
                price: 190000,
                department: 'Khoa Tiêu Hóa',
            },
            {
                id: 'neurology',
                name: 'Khám Thần Kinh',
                price: 250000,
                department: 'Khoa Thần Kinh',
            },
        ];
    },

    async getRooms(serviceId: string): Promise<Room[]> {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Nếu muốn lọc theo serviceId, có thể xử lý ở đây (hiện tại trả toàn bộ)
        console.log('Lấy phòng cho dịch vụ:', serviceId);

        return [
            {
                id: 'P101',
                name: 'Phòng 101',
                doctor: 'BS. Nguyễn Văn Khoa',
                available: true,
            },
            {
                id: 'P102',
                name: 'Phòng 102',
                doctor: 'BS. Trần Thị Lan',
                available: true,
            },
            {
                id: 'P103',
                name: 'Phòng 103',
                doctor: 'BS. Lê Văn Minh',
                available: false,
            },
            {
                id: 'P104',
                name: 'Phòng 104',
                doctor: 'BS. Phạm Thị Hoa',
                available: true,
            },
        ];
    },

    async createAppointment({
        service,
        room,
    }: {
        service: Service;
        room: Room;
    }): Promise<Appointment> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            room: room.name,
            doctor: room.doctor,
            queueNumber: Math.floor(Math.random() * 50) + 1,
            qrCode: 'QR_CODE_DATA',
            time: new Date().toLocaleString('vi-VN'),
            // Tùy chọn bao gồm tên dịch vụ trong cuộc hẹn để trình diễn
            serviceName: service.name,
        } as Appointment & { serviceName: string };
    },
};
