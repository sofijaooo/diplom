package com.streetarts.backend;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;  // user_id в таблице — INT, ссылка на users

    @Column(name = "place", nullable = false, length = 100)
    private String place;    // место проведения события

    @Column(name = "time", nullable = false)
    private LocalTime time;  // время события

    @Column(name = "date_request")
    private LocalDate dateRequest; // дата создания заявки, default CURRENT_DATE

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;   // дата события

    @Column(name = "comments", length = 255)
    private String comments;       // комментарии

    @Column(name = "decision")
    private Boolean decision;      // решение (true/false/null)

    // --- Геттеры и сеттеры ---

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

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public LocalDate getDateRequest() {
        return dateRequest;
    }

    public void setDateRequest(LocalDate dateRequest) {
        this.dateRequest = dateRequest;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Boolean getDecision() {
        return decision;
    }

    public void setDecision(Boolean decision) {
        this.decision = decision;
    }
}