package com.streetarts.backend;

import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;
    private final DataSource dataSource;

    public EventService(EventRepository repository, DataSource dataSource) {
        this.repository = repository;
        this.dataSource = dataSource;
    }

    // поиск по месту
    public List<Event> searchEvents(String query) {
        //проверка
        try (Connection con = dataSource.getConnection()) {
            if (!con.isValid(2)) {
                System.out.println("[EVENT DB] Warning: connection not valid");
            }
        } catch (Exception e) {
            System.out.println("[EVENT DB] Exception: " + e.getMessage());
        }

        if (query == null || query.isBlank()) {
            return repository.findAll();
        }
        return repository.findByPlaceContainingIgnoreCase(query);
    }
}