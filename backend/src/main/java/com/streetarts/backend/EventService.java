package com.streetarts.backend;

import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.stream.Collectors;

import com.streetarts.backend.dto.EventMapDto;
import com.streetarts.backend.dto.EventListDto;
import java.util.Optional;



@Service
public class EventService {

    private final EventRepository repository;
    private final DataSource dataSource;
    private final GeocodingService geocodingService;
    private final ArtistRepository artistRepository;
    private final NotificationService notificationService;
//    public EventService(EventRepository repository,
//                        DataSource dataSource,
//                        GeocodingService geocodingService) {
//        this.repository = repository;
//        this.dataSource = dataSource;
//        this.geocodingService = geocodingService;
//    }

    public EventService(EventRepository repository,
                        DataSource dataSource,
                        GeocodingService geocodingService,
                        ArtistRepository artistRepository,
                        NotificationService notificationService) {
        this.repository = repository;
        this.dataSource = dataSource;
        this.geocodingService = geocodingService;
        this.artistRepository = artistRepository;
        this.notificationService = notificationService;
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
        List<Event> events = repository.findByStatus("approved");

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
        validateEvent(event);

        event.setDateRequest(LocalDate.now());
        event.setStatus("pending");

        GeocodingService.Coordinates coordinates = geocodingService.geocode(event.getPlace());

        if (coordinates == null) {
            throw new IllegalArgumentException("Не вдалося знайти координати для цієї адреси");
        }

        event.setLatitude(coordinates.getLatitude());
        event.setLongitude(coordinates.getLongitude());

        return repository.save(event);
    }
//    public Event createEvent(Event event) {
////        if (event.getPlace() != null && !event.getPlace().isBlank()) {
////            GeocodingService.Coordinates coordinates = geocodingService.geocode(event.getPlace());
////
////            if (coordinates != null) {
////                event.setLatitude(coordinates.getLatitude());
////                event.setLongitude(coordinates.getLongitude());
////            }
////        }
////
////        return repository.save(event);
//        event.setDateRequest(LocalDate.now());
//        event.setStatus("pending");
////        event.setDecision(null);
//
//        if (event.getPlace() != null && !event.getPlace().isBlank()) {
//            GeocodingService.Coordinates coordinates = geocodingService.geocode(event.getPlace());
//
//            if (coordinates != null) {
//                event.setLatitude(coordinates.getLatitude());
//                event.setLongitude(coordinates.getLongitude());
//            }
//        }
//
//        return repository.save(event);
//    }
private void validateEvent(Event event) {
    if (event.getUserId() == null) {
        throw new IllegalArgumentException("Користувача не знайдено");
    }

    if (event.getPlace() == null || event.getPlace().isBlank()) {
        throw new IllegalArgumentException("Введіть адресу проведення події");
    }

    if (event.getPlace().trim().length() < 5) {
        throw new IllegalArgumentException("Адреса має містити мінімум 5 символів");
    }

    if (event.getPlace().trim().length() > 100) {
        throw new IllegalArgumentException("Адреса не може бути довшою за 100 символів");
    }

    if (event.getEventDate() == null) {
        throw new IllegalArgumentException("Оберіть дату події");
    }

    if (event.getEventDate().isBefore(LocalDate.now())) {
        throw new IllegalArgumentException("Дата події не може бути в минулому");
    }

    if (event.getTime() == null) {
        throw new IllegalArgumentException("Оберіть час події");
    }

    if (event.getComments() != null && event.getComments().length() > 255) {
        throw new IllegalArgumentException("Коментар не може бути довшим за 255 символів");
    }
}
    // данные для карты
    public List<EventMapDto> getEventsForMap() {
        return repository.findByStatus("approved").stream().map(event -> {
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

    public List<EventListDto> searchEventsWithArtists(String search, String date, String time) {
        List<Event> events = searchEvents(search, date, time);

        return events.stream().map(event -> {
            EventListDto dto = new EventListDto();
            dto.setId(event.getId());
            dto.setUserId(event.getUserId());
            dto.setPlace(event.getPlace());
            dto.setEventDate(event.getEventDate() != null ? event.getEventDate().toString() : "");
            dto.setTime(event.getTime() != null ? event.getTime().toString() : "");

            Optional<Artists> artistOpt = artistRepository.findByUserId(event.getUserId());
            if (artistOpt.isPresent()) {
                Artists artist = artistOpt.get();
                dto.setNickname(artist.getNickname());
                dto.setAvatarUrl(artist.getAvatar_url());
            } else {
                dto.setNickname("Невідомий виконавець");
                dto.setAvatarUrl("");
            }

            return dto;
        }).toList();
    }

//    public List<Event> getPendingEvents() {
//        return repository.findByStatus("pending");
//    }
    public List<Event> getPendingEvents() {
        return repository.findByStatusOrderByIdAsc("pending");
    }
//    public Event approveEvent(Long eventId) {
//        Event event = repository.findById(eventId)
//                .orElseThrow(() -> new RuntimeException("Заявку не знайдено"));
//
//        event.setStatus("approved");
//        Event saved = repository.save(event);
//
//        notificationService.notifySubscribersAboutApprovedEvent(saved);
//        return repository.save(event);
//    }
public Event approveEvent(Long eventId) {
    Event event = repository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Заявку не знайдено"));

    event.setStatus("approved");

    Event saved = repository.save(event);

    notificationService.notifySubscribersAboutApprovedEvent(saved);

    return saved;
}

    public Event rejectEvent(Long eventId, String comment) {
        Event event = repository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Заявку не знайдено"));

        event.setStatus("rejected");
        event.setComments(comment);
        return repository.save(event);
    }

    public List<Event> getEventsByUserId(Integer userId) {
        return repository.findByUserId(userId)
                .stream()
                .sorted((e1, e2) -> e2.getDateRequest().compareTo(e1.getDateRequest()))
                .collect(Collectors.toList());
    }
}

