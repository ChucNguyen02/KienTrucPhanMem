package iuh.fit.backend.campaign.repository;

import iuh.fit.backend.campaign.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    List<Campaign> findAllByOrderByStartDateDesc();
}

