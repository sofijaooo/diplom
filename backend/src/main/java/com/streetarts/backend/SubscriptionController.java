package com.streetarts.backend;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, Object> subscribe(@RequestBody Map<String, String> body) {
        Integer viewerId = Integer.valueOf(body.get("viewerId"));
        Long artistId = Long.valueOf(body.get("artistId"));

        return service.subscribe(viewerId, artistId);
    }

    @DeleteMapping
    public Map<String, Object> unsubscribe(@RequestBody Map<String, String> body) {
        Integer viewerId = Integer.valueOf(body.get("viewerId"));
        Long artistId = Long.valueOf(body.get("artistId"));

        return service.unsubscribe(viewerId, artistId);
    }

    @GetMapping("/check")
    public Map<String, Object> check(
            @RequestParam("viewerId") Integer viewerId,
            @RequestParam("artistId") Long artistId
    ) {
        return service.check(viewerId, artistId);
    }
}