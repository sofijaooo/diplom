package com.streetarts.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "artists")
public class Artists {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artist_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "nickname", nullable = false, length = 50)
    private String nickname;

    @Column(name = "about", nullable = false, length = 100)
    private String about;

    @Enumerated(EnumType.STRING)
    @Column(name = "genre", nullable = false)
    private GenreRole genre;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "avatar_url", nullable = false, length = 255)
    private String avatar_url;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public GenreRole getGenre() {
        return genre;
    }

    public void setGenre(GenreRole genre) {
        this.genre = genre;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAvatar_url() {
        return avatar_url;
    }

    public void setAvatar_url(String avatar_url) {
        this.avatar_url = avatar_url;
    }
}
