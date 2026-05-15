package com.streetarts.backend;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final JavaMailSender mailSender;

    public NotificationService(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            ArtistRepository artistRepository,
            JavaMailSender mailSender
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.artistRepository = artistRepository;
        this.mailSender = mailSender;
    }

    public void notifySubscribersAboutApprovedEvent(Event event) {
        Artists artist = artistRepository.findByUserId(event.getUserId())
                .orElse(null);

        if (artist == null) {
            return;
        }

        List<Subscription> subscriptions =
                subscriptionRepository.findByArtistId(artist.getId());

        for (Subscription subscription : subscriptions) {
            User viewer = userRepository.findById(subscription.getViewerId())
                    .orElse(null);

            if (viewer == null || viewer.getEmail() == null) {
                continue;
            }

            sendEmail(viewer.getEmail(), artist, event);
        }
    }

    private void sendEmail(String to, Artists artist, Event event) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Новий виступ митця " + artist.getNickname());

        message.setText(
                "Вітаємо!\n\n" +
                        "Митець, на якого ви підписані, має новий погоджений виступ.\n\n" +
                        "Митець: " + artist.getNickname() + "\n" +
                        "Місце: " + event.getPlace() + "\n" +
                        "Дата: " + event.getEventDate() + "\n" +
                        "Час: " + event.getTime() + "\n\n" +
                        "StreetArt Live"
        );

        mailSender.send(message);
    }
}