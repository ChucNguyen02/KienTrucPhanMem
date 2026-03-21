package iuh.fit.backend.registration.service.impl;

import iuh.fit.backend.common.ResourceNotFoundException;
import iuh.fit.backend.registration.dto.RegistrationRequest;
import iuh.fit.backend.registration.dto.RegistrationResponse;
import iuh.fit.backend.registration.entity.Event;
import iuh.fit.backend.registration.entity.Registration;
import iuh.fit.backend.registration.entity.RegistrationStatus;
import iuh.fit.backend.registration.repository.EventRepository;
import iuh.fit.backend.registration.repository.RegistrationRepository;
import iuh.fit.backend.registration.service.RegistrationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public RegistrationServiceImpl(RegistrationRepository registrationRepository, EventRepository eventRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public RegistrationResponse register(RegistrationRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        Registration registration = new Registration();
        registration.setEvent(event);
        registration.setStudentCode(request.getStudentCode());
        registration.setFullName(request.getFullName());
        registration.setEmail(request.getEmail());
        registration.setStatus(RegistrationStatus.REGISTERED);
        registration.setRegisteredAt(LocalDateTime.now());

        return toResponse(registrationRepository.save(registration));
    }

    @Override
    public List<RegistrationResponse> findByEvent(Long eventId) {
        return registrationRepository.findByEventIdOrderByRegisteredAtDesc(eventId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public RegistrationResponse checkIn(Long registrationId) {
        Registration registration = getRegistration(registrationId);
        registration.setStatus(RegistrationStatus.CHECKED_IN);
        return toResponse(registrationRepository.save(registration));
    }

    @Override
    public RegistrationResponse cancel(Long registrationId) {
        Registration registration = getRegistration(registrationId);
        registration.setStatus(RegistrationStatus.CANCELLED);
        return toResponse(registrationRepository.save(registration));
    }

    private Registration getRegistration(Long registrationId) {
        return registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with id: " + registrationId));
    }

    private RegistrationResponse toResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getId(),
                registration.getEvent().getTitle(),
                registration.getStudentCode(),
                registration.getFullName(),
                registration.getEmail(),
                registration.getStatus(),
                registration.getRegisteredAt()
        );
    }
}

