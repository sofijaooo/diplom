package com.streetarts.backend;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.*;

import com.streetarts.backend.dto.EventMapDto;
import org.springframework.web.bind.annotation.*;
import com.streetarts.backend.dto.EventListDto;

import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

//    @GetMapping
//    public List<Event> searchEvents(@RequestParam(name = "search", required = false) String search) {
//        return service.searchEvents(search);
//    }
//@GetMapping
//public List<Event> searchEvents(
//        @RequestParam(name = "search", required = false) String search,
//        @RequestParam(name = "date", required = false) String date,
//        @RequestParam(name = "time", required = false) String time
//) {
//    return service.searchEvents(search, date, time);
//}
@GetMapping
public List<EventListDto> searchEvents(
        @RequestParam(name = "search", required = false) String search,
        @RequestParam(name = "date", required = false) String date,
        @RequestParam(name = "time", required = false) String time
) {
    return service.searchEventsWithArtists(search, date, time);
}

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            return ResponseEntity.ok(service.createEvent(event));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/map")
    public List<EventMapDto> getEventsForMap() {
        return service.getEventsForMap();
    }


    @GetMapping("/pending")
    public List<Event> getPendingEvents() {
        return service.getPendingEvents();
    }

//    @PutMapping("/{eventId}/approve")
//    public Event approveEvent(@PathVariable Long eventId) {
//        return service.approveEvent(eventId);
//    }
@PutMapping("/{eventId}/approve")
public Event approveEvent(@PathVariable("eventId") Long eventId) {
    return service.approveEvent(eventId);
}

//    @PutMapping("/{eventId}/reject")
//    public Event rejectEvent(@PathVariable Long eventId, String comment) {
//        return service.rejectEvent(eventId, comment);
//    }
//    @PutMapping("/{eventId}/reject")
//    public Event rejectEvent(
//            @PathVariable Long eventId,
//            @RequestBody Map<String, String> body
//    ) {
//        return service.rejectEvent(eventId, body.get("comment"));
//    }
@PutMapping("/{eventId}/reject")
public Event rejectEvent(
        @PathVariable("eventId") Long eventId,
        @RequestBody Map<String, String> body
) {
    return service.rejectEvent(eventId, body.get("comment"));
}

    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable("userId") Integer userId) {
        return service.getEventsByUserId(userId);
    }
}

