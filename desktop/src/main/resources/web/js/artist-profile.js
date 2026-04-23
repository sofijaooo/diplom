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

        renderArtistProfile(artist);
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