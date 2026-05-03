package com.streetarts.backend;


import com.streetarts.backend.dto.AuthResponse;
import com.streetarts.backend.dto.LoginRequest;
import com.streetarts.backend.dto.RegisterRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, ArtistRepository artistRepository) {
        this.userRepository = userRepository;
        this.artistRepository = artistRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegister(request);

        if (userRepository.existsByEmailIgnoreCase(request.email)) {
            throw new RuntimeException("Користувач з такою поштою вже існує");
        }

        UserRole role = "artist".equals(request.role) ? UserRole.artist : UserRole.user;

        User user = new User();
        user.setName(request.name.trim());
        user.setSurname(request.surname.trim());
        if (request.birthDate != null && !request.birthDate.isBlank()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            user.setBirthDate(LocalDate.parse(request.birthDate, formatter));
        }
        user.setPhone(request.phone.trim());
        user.setUsername(request.username.trim());
        user.setEmail(request.email.trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        if (role == UserRole.artist) {
            Artists artist = new Artists();
            artist.setUserId(savedUser.getId());
            artist.setNickname(request.artistNickname.trim());
            artist.setGenre(GenreRole.valueOf(request.artistGenre));
            artist.setCity(request.artistCity.trim());
            if (request.artistAbout != null && !request.artistAbout.isBlank()) {
                artist.setAbout(request.artistAbout.trim());
            } else {
                artist.setAbout(null);
            }
            artist.setAvatar_url(null);

            artistRepository.save(artist);
        }

        return new AuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.email == null || request.email.isBlank()) {
            throw new RuntimeException("Введіть email");
        }

        if (request.password == null || request.password.isBlank()) {
            throw new RuntimeException("Введіть пароль");
        }

        User user = userRepository.findByEmailIgnoreCase(request.email.trim())
                .orElseThrow(() -> new RuntimeException("Користувача з такою поштою не знайдено"));

        if (!passwordEncoder.matches(request.password, user.getPasswordHash())) {
            throw new RuntimeException("Невірний пароль");
        }

        if ("admin".equals(request.role) && user.getRole() != UserRole.admin) {
            throw new RuntimeException("Ця пошта не прив’язана до адміністратора");
        }

        return new AuthResponse(user);
    }

    private void validateRegister(RegisterRequest request) {

        if (request.name == null || !request.name.trim().matches("^[A-Za-zА-Яа-яІіЇїЄє'\\- ]{2,}$")) {
            throw new RuntimeException("Ім’я має містити лише літери (мінімум 2 символи)");
        }

        if (request.surname == null || !request.surname.trim().matches("^[A-Za-zА-Яа-яІіЇїЄє'\\- ]{2,}$")) {
            throw new RuntimeException("Прізвище має містити лише літери (мінімум 2 символи)");
        }

        if (request.phone == null || !request.phone.trim().matches("^\\+\\d{10,15}$")) {
            throw new RuntimeException("Телефон має починатися з + та містити 10–15 цифр");
        }

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            LocalDate birthDate = LocalDate.parse(request.birthDate, formatter);

            if (birthDate.isAfter(LocalDate.now())) {
                throw new RuntimeException("Дата народження не може бути в майбутньому");
            }

            if (birthDate.isAfter(LocalDate.now().minusYears(10))) {
                throw new RuntimeException("Мінімальний вік — 10 років");
            }

        } catch (Exception e) {
            throw new RuntimeException("Дата народження має бути у форматі 31.01.2000");
        }

        if (request.username == null || request.username.trim().length() < 2) {

            throw new RuntimeException("Нікнейм має містити мінімум 2 символи");
        }

        if (request.email == null || !request.email.matches("^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$")) {
            throw new RuntimeException("Введіть коректний email");
        }

        if (request.password == null || request.password.length() < 6) {
            throw new RuntimeException("Пароль має містити мінімум 6 символів");
        }

        if ("artist".equals(request.role)) {
            if (request.artistNickname == null || request.artistNickname.trim().length() < 2) {
                throw new RuntimeException("Псевдонім митця має містити мінімум 2 символи");
            }

            if (request.artistGenre == null || request.artistGenre.isBlank()) {
                throw new RuntimeException("Оберіть жанр");
            }

            if (request.artistCity == null ||
                    !request.artistCity.trim().matches("^[A-Za-zА-Яа-яІіЇїЄє'\\- ]{2,}$")) {
                throw new RuntimeException("Місто має містити лише літери (мінімум 2 символи)");
            }

// description НЕ обов’язковий
            if (request.artistAbout != null && request.artistAbout.length() > 500) {
                throw new RuntimeException("Опис не може перевищувати 500 символів");
            }
        }
    }
}