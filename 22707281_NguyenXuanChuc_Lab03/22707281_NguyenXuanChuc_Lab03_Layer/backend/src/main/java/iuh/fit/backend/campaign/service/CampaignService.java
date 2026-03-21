package iuh.fit.backend.campaign.service;

import iuh.fit.backend.campaign.dto.CampaignRequest;
import iuh.fit.backend.campaign.dto.CampaignResponse;

import java.util.List;

public interface CampaignService {
    List<CampaignResponse> findAll();

    CampaignResponse findById(Long id);

    CampaignResponse create(CampaignRequest request);

    CampaignResponse update(Long id, CampaignRequest request);

    void delete(Long id);

    CampaignResponse changeActiveStatus(Long id, boolean active);
}

