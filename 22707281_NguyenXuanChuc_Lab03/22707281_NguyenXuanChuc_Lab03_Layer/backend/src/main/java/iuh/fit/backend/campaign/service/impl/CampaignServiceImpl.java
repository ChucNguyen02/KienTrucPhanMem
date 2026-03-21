package iuh.fit.backend.campaign.service.impl;

import iuh.fit.backend.campaign.dto.CampaignRequest;
import iuh.fit.backend.campaign.dto.CampaignResponse;
import iuh.fit.backend.campaign.entity.Campaign;
import iuh.fit.backend.campaign.repository.CampaignRepository;
import iuh.fit.backend.campaign.service.CampaignService;
import iuh.fit.backend.common.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignServiceImpl(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    @Override
    public List<CampaignResponse> findAll() {
        return campaignRepository.findAllByOrderByStartDateDesc().stream().map(this::toResponse).toList();
    }

    @Override
    public CampaignResponse findById(Long id) {
        Campaign campaign = getCampaign(id);
        return toResponse(campaign);
    }

    @Override
    public CampaignResponse create(CampaignRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());
        Campaign campaign = new Campaign();
        applyRequest(campaign, request);
        return toResponse(campaignRepository.save(campaign));
    }

    @Override
    public CampaignResponse update(Long id, CampaignRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());
        Campaign campaign = getCampaign(id);
        applyRequest(campaign, request);
        return toResponse(campaignRepository.save(campaign));
    }

    @Override
    public void delete(Long id) {
        Campaign campaign = getCampaign(id);
        campaignRepository.delete(campaign);
    }

    @Override
    public CampaignResponse changeActiveStatus(Long id, boolean active) {
        Campaign campaign = getCampaign(id);
        campaign.setActive(active);
        return toResponse(campaignRepository.save(campaign));
    }

    private Campaign getCampaign(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));
    }

    private void applyRequest(Campaign campaign, CampaignRequest request) {
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setActive(request.isActive());
    }

    private void validateDateRange(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after or equal to start date");
        }
    }

    private CampaignResponse toResponse(Campaign campaign) {
        return new CampaignResponse(
                campaign.getId(),
                campaign.getName(),
                campaign.getDescription(),
                campaign.getStartDate(),
                campaign.getEndDate(),
                campaign.isActive()
        );
    }
}

