package com.streetarts.backend;

import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;

import com.streetarts.backend.dto.EventMapDto;

@Service
public class EventService {

    private final EventRepository repository;
    private final DataSource dataSource;
    private final GeocodingService geocodingService;

    public EventService(EventRepository repository,
                        DataSource dataSource,
                        GeocodingService geocodingService) {
        this.repository = repository;
        this.dataSource = dataSource;
        this.geocodingService = geocodingService;
    }

    // поиск по месту
    public List<Event> searchEvents(String query) {
        try (Connection con = dataSource.getConnection()) {
            if (!con.isValid(2)) {
                System.out.println("[EVENT DB] Warning: connection not valid");
            }
        } catch (Exception e) {
            System.out.println("[EVENT DB] Exception: " + e.getMessage());
        }

        if (query == null || query.isBlank()) {
            return repository.findAll();
        }
        return repository.findByPlaceContainingIgnoreCase(query);
    }

    // создание события
    public Event createEvent(Event event) {
        if (event.getPlace() != null && !event.getPlace().isBlank()) {
            GeocodingService.Coordinates coordinates = geocodingService.geocode(event.getPlace());

            if (coordinates != null) {
                event.setLatitude(coordinates.getLatitude());
                event.setLongitude(coordinates.getLongitude());
            }
        }

        return repository.save(event);
    }

    // данные для карты
    public List<EventMapDto> getEventsForMap() {
        return repository.findAll().stream().map(event -> {
            EventMapDto dto = new EventMapDto();
            dto.setId(event.getId());
            dto.setPlace(event.getPlace());
            dto.setEventDate(event.getEventDate() != null ? event.getEventDate().toString() : "");
            dto.setTime(event.getTime() != null ? event.getTime().toString() : "");
            dto.setLatitude(event.getLatitude());
            dto.setLongitude(event.getLongitude());
            return dto;
        }).toList();
    }
}