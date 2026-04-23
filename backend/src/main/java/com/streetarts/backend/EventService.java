package com.streetarts.backend;

import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.stream.Collectors;

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
//    public List<Event> searchEvents(String query) {
//        try (Connection con = dataSource.getConnection()) {
//            if (!con.isValid(2)) {
//                System.out.println("[EVENT DB] Warning: connection not valid");
//            }
//        } catch (Exception e) {
//            System.out.println("[EVENT DB] Exception: " + e.getMessage());
//        }
//
//        if (query == null || query.isBlank()) {
//            return repository.findAll();
//        }
//        return repository.findByPlaceContainingIgnoreCase(query);
//    }

    public List<Event> searchEvents(String search, String date, String time) {
        List<Event> events = repository.findAll();

        return events.stream()
                .filter(event ->
                        search == null || search.isBlank() ||
                                event.getPlace().toLowerCase().contains(search.toLowerCase()) ||
                                String.valueOf(event.getUserId()).contains(search)
                )
                .filter(event ->
                        date == null || date.isBlank() ||
                                event.getEventDate().equals(LocalDate.parse(date))
                )
                .filter(event -> {
                    if (time == null || time.isBlank()) return true;

                    String[] parts = time.split("-");
                    if (parts.length != 2) return true;

                    int fromHour = Integer.parseInt(parts[0]);
                    int toHour = Integer.parseInt(parts[1]);

                    LocalTime eventTime = event.getTime();
                    return eventTime.getHour() >= fromHour && eventTime.getHour() < toHour;
                })
                .collect(Collectors.toList());
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