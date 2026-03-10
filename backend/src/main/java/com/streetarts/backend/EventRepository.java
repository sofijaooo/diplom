package com.streetarts.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // поиск по месту проведения
    List<Event> findByPlaceContainingIgnoreCase(String place);

    // поиск по user_id
    List<Event> findByUserId(Integer userId);

    // поиск по дате события
    List<Event> findByEventDate(LocalDate eventDate);
}