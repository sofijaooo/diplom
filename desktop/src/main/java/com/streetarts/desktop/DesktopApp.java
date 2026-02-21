package com.streetarts.desktop;

import javafx.application.Application;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;

public class DesktopApp extends Application {

    // DEV-путь: если этот файл существует, грузим его с диска (из target/classes),
    // чтобы изменения подхватывались быстрее.
    // Можно поменять на src/main/resources/web/index.html, но тогда нужна сборка/копирование ресурсов вручную.
    private static final Path DEV_INDEX = Path.of("target/classes/web/index.html");

    @Override
    public void start(Stage stage) {
        WebView webView = new WebView();
        WebEngine engine = webView.getEngine();

        engine.getLoadWorker().stateProperty().addListener((obs, oldState, newState) -> {
            if (newState == Worker.State.FAILED) {
                Throwable ex = engine.getLoadWorker().getException();
                System.err.println("WebView load failed: " + (ex != null ? ex.getMessage() : "unknown"));
            }
        });

        String url = resolveIndexUrl();
        engine.load(url);

        stage.setTitle("StreetArt Live");
        stage.setScene(new Scene(webView, 1200, 800));
        stage.show();
    }

    private String resolveIndexUrl() {
        // 1) DEV: грузим с диска (если файл есть)
        try {
            if (Files.exists(DEV_INDEX)) {
                return DEV_INDEX.toAbsolutePath().toUri().toString();
            }
        } catch (Exception ignored) {}

        // 2) PROD: грузим из ресурсов (внутри JAR)
        URL res = getClass().getResource("/web/index.html");
        if (res == null) {
            throw new IllegalStateException("Resource /web/index.html not found. " +
                    "Ensure it exists in desktop/src/main/resources/web/index.html");
        }
        return res.toExternalForm();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
