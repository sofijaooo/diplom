package com.streetarts.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // пошук по місцю проведення
    List<Event> findByPlaceContainingIgnoreCase(String place);

    // пошук по user_id
    List<Event> findByUserId(Integer userId);

    // пошук по даті івента
    List<Event> findByEventDate(LocalDate eventDate);

    // пошук по статусу
    List<Event> findByStatus(String status);

    List<Event> findByStatusOrderByIdAsc(String status);
}