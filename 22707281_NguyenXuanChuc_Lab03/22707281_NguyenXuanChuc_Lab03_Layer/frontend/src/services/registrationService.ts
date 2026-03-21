import { apiClient, unwrap } from "./apiClient";
import type { Registration, RegistrationPayload } from "../types";

export const registrationService = {
    register: async (payload: RegistrationPayload) =>
        unwrap<Registration>((await apiClient.post("/api/registrations", payload))),
    getByEvent: async (eventId: number) =>
        unwrap<Registration[]>((await apiClient.get(`/api/registrations/event/${eventId}`))),
    checkIn: async (id: number) =>
        unwrap<Registration>((await apiClient.patch(`/api/registrations/${id}/check-in`))),
    cancel: async (id: number) =>
        unwrap<Registration>((await apiClient.patch(`/api/registrations/${id}/cancel`))),
};
