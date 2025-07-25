'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, ReactNode } from 'react';

interface Patient {
    cccd: string;
    name: string;
    dob: string;
    gender: string;
    ward: string;
    province: string;
    phone: string;
    ethnicity: string;
    job: string;
}

interface Service {
    id: string;
    name: string;
    price: number;
    department: string;
}

interface Room {
    id: string;
    name: string;
    doctor: string;
    available: boolean;
}

interface Appointment {
    room: string;
    doctor: string;
    queueNumber: number;
    qrCode?: string;
    time: string;
}

interface AppContextType {
    currentStep: number;
    setCurrentStep: (step: number) => void;
    patient: Patient | null;
    setPatient: (patient: Patient | null) => void;
    selectedService: Service | null;
    setSelectedService: (service: Service | null) => void;
    selectedRoom: Room | null;
    setSelectedRoom: (room: Room | null) => void;
    appointment: Appointment | null;
    setAppointment: (appointment: Appointment | null) => void;
    resetApp: () => void;
}

export type { Patient, Service, Room, Appointment };

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(
        null
    );
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    const resetApp = () => {
        router.push('/');
        setCurrentStep(1);
        setPatient(null);
        setSelectedService(null);
        setSelectedRoom(null);
        setAppointment(null);
    };

    return (
        <AppContext.Provider
            value={{
                currentStep,
                setCurrentStep,
                patient,
                setPatient,
                selectedService,
                setSelectedService,
                selectedRoom,
                setSelectedRoom,
                appointment,
                setAppointment,
                resetApp,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
