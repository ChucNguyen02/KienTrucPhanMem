import { apiClient, unwrap } from "./apiClient";
import type { Event, EventPayload } from "../types";

export const eventService = {
    getAll: async () => unwrap<Event[]>((await apiClient.get("/api/events"))),
    create: async (payload: EventPayload) => unwrap<Event>((await apiClient.post("/api/events", payload))),
    update: async (id: number, payload: EventPayload) => unwrap<Event>((await apiClient.put(`/api/events/${id}`, payload))),
    remove: async (id: number) => {
        await apiClient.delete(`/api/events/${id}`);
    },
};
