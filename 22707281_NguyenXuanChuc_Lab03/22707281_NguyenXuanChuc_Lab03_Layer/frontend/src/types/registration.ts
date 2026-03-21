export type RegistrationStatus = "REGISTERED" | "CHECKED_IN" | "CANCELLED";

export interface Registration {
    id: number;
    eventId: number;
    eventTitle: string;
    studentCode: string;
    fullName: string;
    email: string;
    status: RegistrationStatus;
    registeredAt: string;
}

export interface RegistrationPayload {
    eventId: number;
    studentCode: string;
    fullName: string;
    email: string;
}
