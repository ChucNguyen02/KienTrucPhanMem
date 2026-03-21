package iuh.fit.backend.campaign.dto;

import java.time.LocalDate;

public record CampaignResponse(
        Long id,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        boolean active
) {
}

