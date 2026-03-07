package com.streetarts.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;

@CrossOrigin(originPatterns = "*")
@RestController
public class Controller {

    private final DataSource dataSource;

    public Controller(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/api/first-match-id")
    public Map<String, Object> firstMatchId() {
        String sql = "SELECT match_id FROM raw.matches LIMIT 1;";

        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) return Map.of("matchId", rs.getString(1));
            return Map.of("matchId", null, "message", "raw.matches is empty");

        } catch (Exception e) {
            // temporary debug output
            return Map.of("error", e.getClass().getSimpleName(), "message", e.getMessage());
        }
    }
}