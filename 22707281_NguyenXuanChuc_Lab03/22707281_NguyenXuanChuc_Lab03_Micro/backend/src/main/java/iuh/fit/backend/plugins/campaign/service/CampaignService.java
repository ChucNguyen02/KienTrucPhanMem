package iuh.fit.backend.plugins.campaign.service;

import iuh.fit.backend.common.ResourceNotFoundException;
import iuh.fit.backend.plugins.campaign.dto.CampaignResponse;
import iuh.fit.backend.plugins.campaign.dto.CreateCampaignRequest;
import iuh.fit.backend.plugins.campaign.entity.Campaign;
import iuh.fit.backend.plugins.campaign.entity.CampaignStatus;
import iuh.fit.backend.plugins.campaign.repository.CampaignRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    @Transactional
    public CampaignResponse create(CreateCampaignRequest request) {
        campaignRepository.findByCode(request.code()).ifPresent(c -> {
            throw new IllegalArgumentException("Campaign code already exists: " + request.code());
        });
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("endDate must be greater than or equal to startDate");
        }

        Campaign campaign = new Campaign();
        campaign.setCode(request.code());
        campaign.setName(request.name());
        campaign.setStartDate(request.startDate());
        campaign.setEndDate(request.endDate());
        campaign.setStatus(CampaignStatus.PLANNED);
        campaign.setMaxParticipants(request.maxParticipants());
        campaign.setPointPerAttendance(request.pointPerAttendance());

        return CampaignResponse.from(campaignRepository.save(campaign));
    }

    @Transactional(readOnly = true)
    public List<CampaignResponse> findAll() {
        return campaignRepository.findAll().stream().map(CampaignResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public Campaign getById(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id=" + id));
    }

    @Transactional
    public CampaignResponse updateStatus(Long campaignId, CampaignStatus status) {
        Campaign campaign = getById(campaignId);
        campaign.setStatus(status);
        return CampaignResponse.from(campaignRepository.save(campaign));
    }
}

