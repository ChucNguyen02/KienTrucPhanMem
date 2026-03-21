package iuh.fit.backend.registration.controller;

import iuh.fit.backend.common.ApiResponse;
import iuh.fit.backend.registration.dto.RegistrationRequest;
import iuh.fit.backend.registration.dto.RegistrationResponse;
import iuh.fit.backend.registration.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(@Valid @RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Registration successful", registrationService.register(request)));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> findByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(new ApiResponse<>("Registration list", registrationService.findByEvent(eventId)));
    }

    @PatchMapping("/{id}/check-in")
    public ResponseEntity<ApiResponse<RegistrationResponse>> checkIn(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Check-in successful", registrationService.checkIn(id)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<RegistrationResponse>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Registration cancelled", registrationService.cancel(id)));
    }
}

