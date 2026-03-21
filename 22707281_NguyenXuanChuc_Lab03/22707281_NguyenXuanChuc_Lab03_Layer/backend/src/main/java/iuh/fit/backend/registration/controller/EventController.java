package iuh.fit.backend.registration.controller;

import iuh.fit.backend.common.ApiResponse;
import iuh.fit.backend.registration.dto.EventRequest;
import iuh.fit.backend.registration.dto.EventResponse;
import iuh.fit.backend.registration.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> findAll() {
        return ResponseEntity.ok(new ApiResponse<>("Event list", eventService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Event detail", eventService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Event created", eventService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> update(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Event updated", eventService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>("Event deleted", null));
    }
}

