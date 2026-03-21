package iuh.fit.backend.plugins.campaign.dto;

import iuh.fit.backend.plugins.campaign.entity.CampaignStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateCampaignStatusRequest(@NotNull CampaignStatus status) {
}

