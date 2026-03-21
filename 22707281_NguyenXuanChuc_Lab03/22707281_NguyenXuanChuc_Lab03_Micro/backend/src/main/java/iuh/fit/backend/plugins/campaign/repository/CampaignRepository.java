package iuh.fit.backend.plugins.campaign.repository;

import iuh.fit.backend.plugins.campaign.entity.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Optional<Campaign> findByCode(String code);
}

