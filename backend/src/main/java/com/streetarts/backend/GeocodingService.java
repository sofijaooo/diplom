package com.streetarts.backend;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Coordinates geocode(String address) {
        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);

            String url = "https://nominatim.openstreetmap.org/search" +
                    "?format=json" +
                    "&limit=1" +
                    "&q=" + encodedAddress;

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "DiplomaProject/1.0 (student project)");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<NominatimResult[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    NominatimResult[].class
            );

            NominatimResult[] results = response.getBody();

            if (results != null && results.length > 0) {
                double lat = Double.parseDouble(results[0].getLat());
                double lon = Double.parseDouble(results[0].getLon());
                return new Coordinates(lat, lon);
            }

            return null;

        } catch (Exception e) {
            System.out.println("Geocoding error: " + e.getMessage());
            return null;
        }
    }

    public static class Coordinates {
        private final double latitude;
        private final double longitude;

        public Coordinates(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public double getLatitude() {
            return latitude;
        }

        public double getLongitude() {
            return longitude;
        }
    }

    public static class NominatimResult {
        private String lat;
        private String lon;

        public String getLat() {
            return lat;
        }

        public void setLat(String lat) {
            this.lat = lat;
        }

        public String getLon() {
            return lon;
        }

        public void setLon(String lon) {
            this.lon = lon;
        }
    }
}