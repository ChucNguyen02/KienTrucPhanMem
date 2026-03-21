package iuh.fit.backend.registration.repository;

import iuh.fit.backend.registration.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByEventDateAsc();

    long countByCampaignId(Long campaignId);
}

