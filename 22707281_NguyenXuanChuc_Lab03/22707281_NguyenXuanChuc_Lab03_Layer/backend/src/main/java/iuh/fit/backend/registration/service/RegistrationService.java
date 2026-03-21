package iuh.fit.backend.registration.service;

import iuh.fit.backend.registration.dto.RegistrationRequest;
import iuh.fit.backend.registration.dto.RegistrationResponse;

import java.util.List;

public interface RegistrationService {
    RegistrationResponse register(RegistrationRequest request);

    List<RegistrationResponse> findByEvent(Long eventId);

    RegistrationResponse checkIn(Long registrationId);

    RegistrationResponse cancel(Long registrationId);
}

