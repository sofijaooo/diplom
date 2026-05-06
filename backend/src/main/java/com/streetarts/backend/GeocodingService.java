package com.streetarts.backend;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Coordinates geocode(String address) {
        String[] parts = address.split(",");

        if (parts.length >= 3) {
            String city = normalizeCity(parts[0].trim());
            String street = normalizeStreet(parts[1].trim());
            String house = parts[2].trim();

            Coordinates structuredFull = geocodeStructured(city, street, house);
            if (structuredFull != null) return structuredFull;

            Coordinates structuredStreet = geocodeStructured(city, street, "");
            if (structuredStreet != null) return structuredStreet;
        }

        List<String> variants = buildAddressVariants(address);

        for (String variant : variants) {
            Coordinates coordinates = geocodeSingle(variant);
            if (coordinates != null) return coordinates;
        }

        return null;
    }

    private List<String> buildAddressVariants(String address) {
        String[] parts = address.split(",");

        String city = parts.length > 0 ? parts[0].trim() : "";
        String street = parts.length > 1 ? parts[1].trim() : "";
        String house = parts.length > 2 ? parts[2].trim() : "";

        String normalizedCity = normalizeCity(city);
        String normalizedStreet = normalizeStreet(street);

        List<String> variants = new ArrayList<>();

        variants.add(address);

        if (!house.isBlank() && !normalizedStreet.isBlank() && !normalizedCity.isBlank()) {
            variants.add(normalizedStreet + " " + house + ", " + normalizedCity + ", Ukraine");
        }

        if (!normalizedStreet.isBlank() && !normalizedCity.isBlank()) {
            variants.add(normalizedStreet + ", " + normalizedCity + ", Ukraine");
        }

        if (!normalizedCity.isBlank()) {
            variants.add(normalizedCity + ", Ukraine");
        }

        return variants;
    }

    private Coordinates geocodeStructured(String city, String street, String house) {
        try {
            String streetValue = house == null || house.isBlank()
                    ? street
                    : street + " " + house;

            String streetParam = URLEncoder.encode(streetValue, StandardCharsets.UTF_8);
            String cityParam = URLEncoder.encode(city, StandardCharsets.UTF_8);

            String url = "https://nominatim.openstreetmap.org/search"
                    + "?street=" + streetParam
                    + "&city=" + cityParam
                    + "&country=Ukraine"
                    + "&format=json"
                    + "&limit=1"
                    + "&accept-language=uk,en";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "StreetArtLive/1.0 student-project");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<NominatimResult[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    NominatimResult[].class
            );

            NominatimResult[] results = response.getBody();

            System.out.println("GEOCODING STRUCTURED: " + streetValue + ", " + city);

            if (results == null || results.length == 0) {
                System.out.println("GEOCODING STRUCTURED RESPONSE: empty");
                return null;
            }

            double latitude = Double.parseDouble(results[0].lat);
            double longitude = Double.parseDouble(results[0].lon);

            System.out.println("GEOCODING LAT: " + latitude);
            System.out.println("GEOCODING LON: " + longitude);

            return new Coordinates(latitude, longitude);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Coordinates geocodeSingle(String address) {
        try {
            String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);

            String url = "https://nominatim.openstreetmap.org/search"
                    + "?q=" + encodedAddress
                    + "&format=json"
                    + "&limit=1"
                    + "&countrycodes=ua"
                    + "&accept-language=uk,en";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "StreetArtLive/1.0 student-project");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<NominatimResult[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    NominatimResult[].class
            );

            NominatimResult[] results = response.getBody();

            System.out.println("GEOCODING TRY: " + address);

            if (results == null || results.length == 0) {
                System.out.println("GEOCODING RESPONSE: empty");
                return null;
            }

            double latitude = Double.parseDouble(results[0].lat);
            double longitude = Double.parseDouble(results[0].lon);

            System.out.println("GEOCODING LAT: " + latitude);
            System.out.println("GEOCODING LON: " + longitude);

            return new Coordinates(latitude, longitude);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String normalizeCity(String city) {
        return city
                .replace("Суми", "Sumy")
                .replace("Київ", "Kyiv")
                .replace("Львів", "Lviv")
                .replace("Харків", "Kharkiv")
                .replace("Одеса", "Odesa")
                .replace("Дніпро", "Dnipro")
                .trim();
    }

    private String normalizeStreet(String street) {
        String cleaned = street
                .replace("вулиця", "")
                .replace("вул.", "")
                .replace("вул", "")
                .replace("проспект", "")
                .replace("площа", "")
                .trim();

        String transliterated = transliterate(cleaned);

        return transliterated + " Street";
    }
    private String transliterate(String text) {
        return text
                .replace("А", "A").replace("а", "a")
                .replace("Б", "B").replace("б", "b")
                .replace("В", "V").replace("в", "v")
                .replace("Г", "H").replace("г", "h")
                .replace("Ґ", "G").replace("ґ", "g")
                .replace("Д", "D").replace("д", "d")
                .replace("Е", "E").replace("е", "e")
                .replace("Є", "Ye").replace("є", "ie")
                .replace("Ж", "Zh").replace("ж", "zh")
                .replace("З", "Z").replace("з", "z")
                .replace("И", "Y").replace("и", "y")
                .replace("І", "I").replace("і", "i")
                .replace("Ї", "Yi").replace("ї", "i")
                .replace("Й", "Y").replace("й", "i")
                .replace("К", "K").replace("к", "k")
                .replace("Л", "L").replace("л", "l")
                .replace("М", "M").replace("м", "m")
                .replace("Н", "N").replace("н", "n")
                .replace("О", "O").replace("о", "o")
                .replace("П", "P").replace("п", "p")
                .replace("Р", "R").replace("р", "r")
                .replace("С", "S").replace("с", "s")
                .replace("Т", "T").replace("т", "t")
                .replace("У", "U").replace("у", "u")
                .replace("Ф", "F").replace("ф", "f")
                .replace("Х", "Kh").replace("х", "kh")
                .replace("Ц", "Ts").replace("ц", "ts")
                .replace("Ч", "Ch").replace("ч", "ch")
                .replace("Ш", "Sh").replace("ш", "sh")
                .replace("Щ", "Shch").replace("щ", "shch")
                .replace("Ю", "Yu").replace("ю", "iu")
                .replace("Я", "Ya").replace("я", "ia")
                .replace("ь", "")
                .replace("’", "")
                .replace("'", "");
    }

    public static class NominatimResult {
        public String lat;
        public String lon;
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
}