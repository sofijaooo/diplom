package com.streetarts.backend;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArtistRepository extends JpaRepository<Artists, Long> {

    List<Artists> findByNicknameContainingIgnoreCase(String nickname);

    List<Artists> findByCityContainingIgnoreCase(String city);

    List<Artists> findByGenre(GenreRole genre);

    List<Artists> findByGenreAndCityContainingIgnoreCase(GenreRole genre, String city);

    List<Artists> findByNicknameContainingIgnoreCaseOrCityContainingIgnoreCase(String nickname, String city);
}