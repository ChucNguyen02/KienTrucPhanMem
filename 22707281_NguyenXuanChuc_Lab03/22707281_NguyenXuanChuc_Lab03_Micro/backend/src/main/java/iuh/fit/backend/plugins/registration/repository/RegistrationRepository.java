package iuh.fit.backend.plugins.registration.repository;

import iuh.fit.backend.plugins.registration.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByCampaignId(Long campaignId);

    Optional<Registration> findByCampaignIdAndStudentCode(Long campaignId, String studentCode);
}

