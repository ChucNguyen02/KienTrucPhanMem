package iuh.fit.backend.registration.service;

import iuh.fit.backend.registration.dto.EventRequest;
import iuh.fit.backend.registration.dto.EventResponse;

import java.util.List;

public interface EventService {
    List<EventResponse> findAll();

    EventResponse findById(Long id);

    EventResponse create(EventRequest request);

    EventResponse update(Long id, EventRequest request);

    void delete(Long id);
}

