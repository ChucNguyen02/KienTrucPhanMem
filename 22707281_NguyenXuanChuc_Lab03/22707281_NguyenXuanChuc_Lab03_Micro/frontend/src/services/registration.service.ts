import { apiClient } from './api/client';
import type {
    AttendanceRecord,
    CreateRegistrationPayload,
    MarkAttendancePayload,
    Registration,
} from '../types/registration';

export const registrationService = {
    async register(payload: CreateRegistrationPayload): Promise<Registration> {
        const response = await apiClient.post<Registration>('/registrations', payload);
        return response.data;
    },

    async getRegistrationsByCampaign(campaignId: number): Promise<Registration[]> {
        const response = await apiClient.get<Registration[]>('/registrations', { params: { campaignId } });
        return response.data;
    },

    async markAttendance(registrationId: number, payload: MarkAttendancePayload): Promise<AttendanceRecord> {
        const response = await apiClient.patch<AttendanceRecord>(`/registrations/${registrationId}/attendance`, payload);
        return response.data;
    },

    async getAttendanceByRegistration(registrationId: number): Promise<AttendanceRecord[]> {
        const response = await apiClient.get<AttendanceRecord[]>(`/registrations/${registrationId}/attendance`);
        return response.data;
    },
};
