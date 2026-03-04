import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    title: string;
    description: string;
}
export interface Doctor {
    patientsCount: bigint;
    name: string;
    experience: bigint;
    specialty: string;
    rating: number;
}
export interface ContactMessage {
    name: string;
    email: string;
    message: string;
}
export interface Appointment {
    reasonForVisit: string;
    preferredDoctor: string;
    name: string;
    appointmentDate: string;
    email: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAppointment(appointment: Appointment): Promise<void>;
    addContactMessage(message: ContactMessage): Promise<void>;
    addDoctor(doctor: Doctor): Promise<void>;
    addService(service: Service): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteDoctor(id: bigint): Promise<void>;
    deleteService(id: bigint): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllContactMessages(): Promise<Array<ContactMessage>>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDoctor(id: bigint, doctor: Doctor): Promise<void>;
    updateService(id: bigint, service: Service): Promise<void>;
}
