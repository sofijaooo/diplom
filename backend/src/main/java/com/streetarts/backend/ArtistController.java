package com.streetarts.backend;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "*")
public class ArtistController {

    private final ArtistService service;

    public ArtistController(ArtistService service) {
        this.service = service;
    }

    @GetMapping
    public List<Artists> searchArtists(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "genre", required = false) GenreRole genre,
            @RequestParam(name = "city", required = false) String city
    ) {
        return service.searchArtists(search, genre, city);
    }

    @PostMapping
    public Artists createArtist(@RequestBody Artists artist) {
        return service.createArtist(artist);
    }
}
