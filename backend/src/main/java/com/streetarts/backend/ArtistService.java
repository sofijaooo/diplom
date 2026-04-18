package com.streetarts.backend;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtistService {

    private final ArtistRepository repository;

    public ArtistService(ArtistRepository repository) {
        this.repository = repository;
    }

    public List<Artists> searchArtists(String search, GenreRole genre, String city) {
        List<Artists> artists = repository.findAll();

        return artists.stream()
                .filter(artist ->
                        search == null || search.isBlank() ||
                                artist.getNickname().toLowerCase().contains(search.toLowerCase()) ||
                                artist.getCity().toLowerCase().contains(search.toLowerCase()) ||
                                artist.getAbout().toLowerCase().contains(search.toLowerCase()) ||
                                artist.getGenre().name().toLowerCase().contains(search.toLowerCase())
                )
                .filter(artist ->
                        genre == null || artist.getGenre() == genre
                )
                .filter(artist ->
                        city == null || city.isBlank() ||
                                artist.getCity().toLowerCase().contains(city.toLowerCase())
                )
                .collect(Collectors.toList());
    }

    public Artists createArtist(Artists artist) {
        return repository.save(artist);
    }

    public Artists getArtistByUserId(Integer userId) {
        return repository.findAll().stream()
                .filter(artist -> artist.getUserId().equals(userId))
                .findFirst()
                .orElse(null);
    }
}
