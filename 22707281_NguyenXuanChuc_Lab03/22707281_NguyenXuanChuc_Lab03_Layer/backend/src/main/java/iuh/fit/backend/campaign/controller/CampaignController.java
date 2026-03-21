package iuh.fit.backend.campaign.controller;

import iuh.fit.backend.campaign.dto.CampaignRequest;
import iuh.fit.backend.campaign.dto.CampaignResponse;
import iuh.fit.backend.campaign.service.CampaignService;
import iuh.fit.backend.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> findAll() {
        return ResponseEntity.ok(new ApiResponse<>("Campaign list", campaignService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>("Campaign detail", campaignService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampaignResponse>> create(@Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Campaign created", campaignService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> update(@PathVariable Long id, @Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(new ApiResponse<>("Campaign updated", campaignService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        campaignService.delete(id);
        return ResponseEntity.ok(new ApiResponse<>("Campaign deleted", null));
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateActiveStatus(@PathVariable Long id, @RequestParam boolean value) {
        return ResponseEntity.ok(new ApiResponse<>("Campaign status updated", campaignService.changeActiveStatus(id, value)));
    }
}

