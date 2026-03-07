package com.streetarts.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Component
public class DbCheck implements CommandLineRunner {

    private static final String URL  = "jdbc:postgresql://localhost:5432/postgres";
    private static final String USER = "postgres";
    private static final String PASS = "postgres"; // change

    @Override
    public void run(String... args) {
        System.out.println("[DB] Checking PostgreSQL connection...");

        try (Connection con = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = con.prepareStatement("SELECT 1");
             ResultSet rs = ps.executeQuery()) {

            rs.next();
            System.out.println("[DB] Connected ✅ SELECT 1 -> " + rs.getInt(1));

        } catch (Exception e) {
            System.out.println("[DB] FAILED ❌ " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}