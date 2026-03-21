package iuh.fit.backend.plugins.campaign.controller;

import iuh.fit.backend.plugins.campaign.dto.CampaignResponse;
import iuh.fit.backend.plugins.campaign.dto.CreateCampaignRequest;
import iuh.fit.backend.plugins.campaign.dto.UpdateCampaignStatusRequest;
import iuh.fit.backend.plugins.campaign.service.CampaignService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CampaignResponse createCampaign(@Valid @RequestBody CreateCampaignRequest request) {
        return campaignService.create(request);
    }

    @GetMapping
    public List<CampaignResponse> findAll() {
        return campaignService.findAll();
    }

    @PutMapping("/{campaignId}/status")
    public CampaignResponse updateStatus(
            @PathVariable Long campaignId,
            @Valid @RequestBody UpdateCampaignStatusRequest request
    ) {
        return campaignService.updateStatus(campaignId, request.status());
    }
}

