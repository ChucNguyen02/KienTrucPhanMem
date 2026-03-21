package iuh.fit.backend.plugins.registration.controller;

import iuh.fit.backend.plugins.registration.dto.AttendanceRecordResponse;
import iuh.fit.backend.plugins.registration.dto.CreateRegistrationRequest;
import iuh.fit.backend.plugins.registration.dto.MarkAttendanceRequest;
import iuh.fit.backend.plugins.registration.dto.RegistrationResponse;
import iuh.fit.backend.plugins.registration.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse register(@Valid @RequestBody CreateRegistrationRequest request) {
        return registrationService.register(request);
    }

    @GetMapping
    public List<RegistrationResponse> findByCampaign(@RequestParam Long campaignId) {
        return registrationService.findByCampaign(campaignId);
    }

    @PatchMapping("/{registrationId}/attendance")
    public AttendanceRecordResponse markAttendance(
            @PathVariable Long registrationId,
            @Valid @RequestBody MarkAttendanceRequest request
    ) {
        return registrationService.markAttendance(registrationId, request);
    }

    @GetMapping("/{registrationId}/attendance")
    public List<AttendanceRecordResponse> findAttendance(@PathVariable Long registrationId) {
        return registrationService.findAttendanceByRegistration(registrationId);
    }
}

