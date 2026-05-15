
package com.streetarts.backend;

import jakarta.persistence.*;
        import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @Column(name = "viewer_id", nullable = false)
    private Integer viewerId;

    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }

    public Integer getViewerId() { return viewerId; }
    public void setViewerId(Integer viewerId) { this.viewerId = viewerId; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}