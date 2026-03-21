package iuh.fit.backend.registration.service.impl;

import iuh.fit.backend.campaign.entity.Campaign;
import iuh.fit.backend.campaign.repository.CampaignRepository;
import iuh.fit.backend.common.ResourceNotFoundException;
import iuh.fit.backend.registration.dto.EventRequest;
import iuh.fit.backend.registration.dto.EventResponse;
import iuh.fit.backend.registration.entity.Event;
import iuh.fit.backend.registration.repository.EventRepository;
import iuh.fit.backend.registration.service.EventService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final CampaignRepository campaignRepository;

    public EventServiceImpl(EventRepository eventRepository, CampaignRepository campaignRepository) {
        this.eventRepository = eventRepository;
        this.campaignRepository = campaignRepository;
    }

    @Override
    public List<EventResponse> findAll() {
        return eventRepository.findAllByOrderByEventDateAsc().stream().map(this::toResponse).toList();
    }

    @Override
    public EventResponse findById(Long id) {
        Event event = getEvent(id);
        return toResponse(event);
    }

    @Override
    public EventResponse create(EventRequest request) {
        Event event = new Event();
        applyRequest(event, request);
        return toResponse(eventRepository.save(event));
    }

    @Override
    public EventResponse update(Long id, EventRequest request) {
        Event event = getEvent(id);
        applyRequest(event, request);
        return toResponse(eventRepository.save(event));
    }

    @Override
    public void delete(Long id) {
        Event event = getEvent(id);
        eventRepository.delete(event);
    }

    private Event getEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    private void applyRequest(Event event, EventRequest request) {
        event.setTitle(request.getTitle());
        event.setLocation(request.getLocation());
        event.setEventDate(request.getEventDate());

        Campaign campaign = null;
        if (request.getCampaignId() != null) {
            campaign = campaignRepository.findById(request.getCampaignId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + request.getCampaignId()));
        }
        event.setCampaign(campaign);
    }

    private EventResponse toResponse(Event event) {
        Long campaignId = null;
        String campaignName = null;
        if (event.getCampaign() != null) {
            campaignId = event.getCampaign().getId();
            campaignName = event.getCampaign().getName();
        }

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getLocation(),
                event.getEventDate(),
                campaignId,
                campaignName
        );
    }
}

