package com.streetarts.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByViewerIdAndArtistId(Integer viewerId, Long artistId);

    boolean existsByViewerIdAndArtistId(Integer viewerId, Long artistId);

    List<Subscription> findByArtistId(Long artistId);

    void deleteByViewerIdAndArtistId(Integer viewerId, Long artistId);
}