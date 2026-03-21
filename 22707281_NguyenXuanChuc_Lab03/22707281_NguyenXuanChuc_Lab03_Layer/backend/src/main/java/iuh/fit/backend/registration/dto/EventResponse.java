package iuh.fit.backend.registration.dto;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String location,
        LocalDateTime eventDate,
        Long campaignId,
        String campaignName
) {
}

