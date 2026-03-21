package iuh.fit.backend.registration.repository;

import iuh.fit.backend.registration.entity.Registration;
import iuh.fit.backend.registration.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEventIdOrderByRegisteredAtDesc(Long eventId);

    long countByEventId(Long eventId);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    long countByEventCampaignId(Long campaignId);

    long countByEventCampaignIdAndStatus(Long campaignId, RegistrationStatus status);
}

