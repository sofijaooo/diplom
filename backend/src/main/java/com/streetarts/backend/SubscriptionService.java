package com.streetarts.backend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class SubscriptionService {

    private final SubscriptionRepository repository;

    public SubscriptionService(SubscriptionRepository repository) {
        this.repository = repository;
    }

    public Map<String, Object> subscribe(Integer viewerId, Long artistId) {
        if (repository.existsByViewerIdAndArtistId(viewerId, artistId)) {
            return Map.of("subscribed", true);
        }

        Subscription subscription = new Subscription();
        subscription.setViewerId(viewerId);
        subscription.setArtistId(artistId);

        repository.save(subscription);

        return Map.of("subscribed", true);
    }

    @Transactional
    public Map<String, Object> unsubscribe(Integer viewerId, Long artistId) {
        repository.deleteByViewerIdAndArtistId(viewerId, artistId);
        return Map.of("subscribed", false);
    }

    public Map<String, Object> check(Integer viewerId, Long artistId) {
        boolean subscribed = repository.existsByViewerIdAndArtistId(viewerId, artistId);
        return Map.of("subscribed", subscribed);
    }
}