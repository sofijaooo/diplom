function getArtistIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function translateGenre(genre) {
    switch (genre) {
        case "singer": return "Вокал";
        case "musician": return "Музика";
        case "painter": return "Живопис";
        case "performer": return "Перформанс";
        default: return genre || "—";
    }
}

async function loadArtistProfile() {
    const artistId = getArtistIdFromUrl();

    if (!artistId) {
        document.getElementById("artistNickname").textContent = "Профіль не знайдено";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/artists");
        const artists = await response.json();

        const artist = artists.find(item => String(item.id) === String(artistId));

        if (!artist) {
            document.getElementById("artistNickname").textContent = "Митця не знайдено";
            return;
        }

        // renderArtistProfile(artist);
        // loadArtistEvents(artist);
        renderArtistProfile(artist);
        loadArtistMedia(artist.userId);
        loadArtistEvents(artist);
    } catch (error) {
        console.error("Помилка завантаження профілю митця:", error);
        document.getElementById("artistNickname").textContent = "Не вдалося завантажити профіль";
    }
}

function renderArtistProfile(artist) {
    const avatar = document.getElementById("artistAvatar");
    const nickname = document.getElementById("artistNickname");
    const about = document.getElementById("artistAbout");
    const genre = document.getElementById("artistGenre");
    const city = document.getElementById("artistCity");

    const nicknameInfo = document.getElementById("artistNicknameInfo");
    const genreInfo = document.getElementById("artistGenreInfo");
    const cityInfo = document.getElementById("artistCityInfo");

    avatar.src = artist.avatar_url || "https://via.placeholder.com/300x300";
    avatar.alt = artist.nickname || "Аватар митця";

    nickname.textContent = artist.nickname || "Без імені";
    about.textContent = artist.about || "Опис поки що відсутній.";

    const genreText = translateGenre(artist.genre);
    const cityText = artist.city || "—";

    genre.textContent = genreText;
    city.textContent = cityText;

    nicknameInfo.textContent = artist.nickname || "—";
    genreInfo.textContent = genreText;
    cityInfo.textContent = cityText;
}

document.addEventListener("DOMContentLoaded", () => {
    loadArtistProfile();
});

document.addEventListener("DOMContentLoaded", () => {
    loadArtistProfile();

    const viewArtistEventsBtn = document.getElementById("viewArtistEventsBtn");

    if (viewArtistEventsBtn) {
        viewArtistEventsBtn.addEventListener("click", () => {
            const profilePage = document.querySelector(".artist-profile-page");
            const eventsSection = document.getElementById("artistEventsList");

            if (profilePage && eventsSection) {
                profilePage.scrollTo({
                    top: eventsSection.offsetTop - 24,
                    behavior: "smooth"
                });
            }
        });
    }
});

async function loadArtistEvents(artist) {
    const eventsContainer = document.getElementById("artistEventsList");

    if (!eventsContainer) return;

    try {
        const response = await fetch("http://localhost:8080/api/events");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const events = await response.json();

        const now = new Date();

        const artistEvents = events
            .filter(event => String(event.userId) === String(artist.userId))
            .filter(event => {
                if (!event.eventDate) return false;

                const eventDateTime = new Date(`${event.eventDate}T${event.time || "00:00"}`);
                return eventDateTime >= now;
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.eventDate}T${a.time || "00:00"}`);
                const dateB = new Date(`${b.eventDate}T${b.time || "00:00"}`);
                return dateA - dateB;
            });

        renderArtistEvents(artistEvents);

    } catch (error) {
        console.error("Помилка завантаження виступів митця:", error);
        eventsContainer.innerHTML = `<p class="artist-events-empty">Не вдалося завантажити виступи</p>`;
    }
}

function renderArtistEvents(events) {
    const eventsContainer = document.getElementById("artistEventsList");

    eventsContainer.innerHTML = "";

    if (!events || events.length === 0) {
        eventsContainer.innerHTML = `<p class="artist-events-empty">Найближчих виступів поки немає</p>`;
        return;
    }

    events.forEach(event => {
        const el = document.createElement("article");
        el.className = "artist-event-card";

        el.innerHTML = `
            <div class="artist-event-top">
                <span class="artist-event-date">${event.eventDate || "—"}</span>
                <span class="artist-event-time">${event.time || "—"}</span>
            </div>

            <div class="artist-event-place">
                ${event.place || "Місце не вказано"}
            </div>
        `;

        eventsContainer.appendChild(el);
    });
}
async function loadArtistMedia(userId) {
    const mediaGrid = document.getElementById("artistMediaGrid");

    if (!mediaGrid) return;

    try {
        const response = await fetch(`http://localhost:8080/api/artist-account/${userId}/media`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const media = await response.json();
        renderArtistMedia(media);

    } catch (error) {
        console.error("Помилка завантаження медіа митця:", error);
        mediaGrid.innerHTML = `<p class="artist-events-empty">Не вдалося завантажити медіаконтент</p>`;
    }
}

function renderArtistMedia(media) {
    const mediaGrid = document.getElementById("artistMediaGrid");

    mediaGrid.innerHTML = "";

    if (!media || media.length === 0) {
        mediaGrid.innerHTML = `<p class="artist-events-empty">Медіаконтент ще не додано</p>`;
        return;
    }

    media.forEach(item => {
        const card = document.createElement("div");
        card.className = "artist-media-card";

        if (item.mediaType === "video") {
            card.innerHTML = `
                <video src="${item.mediaUrl}" controls></video>
            `;
        } else {
            card.innerHTML = `
                <img src="${item.mediaUrl}" alt="Медіаконтент митця">
            `;
        }

        mediaGrid.appendChild(card);
    });
}


document.addEventListener("click", async (event) => {
    const button = event.target.closest(".subscribe-button");

    if (!button) {
        return;
    }

    const user = getCurrentUser();

    if (!user) {
        alert("Щоб підписатися, потрібно увійти в акаунт");
        return;
    }

    const artistId = button.dataset.artistId;

    try {
        const response = await fetch("http://localhost:8080/api/subscriptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                viewerId: user.id,
                artistId: artistId
            })
        });

        if (!response.ok) {
            throw new Error("Помилка підписки");
        }

        button.textContent = "Ви підписані";
        button.disabled = true;

    } catch (error) {
        console.error(error);
        alert("Не вдалося оформити підписку");
    }
});