export type AttendanceStatus = 'PENDING' | 'PRESENT' | 'ABSENT';

export interface Registration {
    id: number;
    campaignId: number;
    studentCode: string;
    studentName: string;
    registeredAt: string;
    attendanceStatus: AttendanceStatus;
}

export interface AttendanceRecord {
    id: number;
    registrationId: number;
    attendanceDate: string;
    present: boolean;
}

export interface CreateRegistrationPayload {
    campaignId: number;
    studentCode: string;
    studentName: string;
}

export interface MarkAttendancePayload {
    attendanceDate: string;
    present: boolean;
}
