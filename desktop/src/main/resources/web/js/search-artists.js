const searchField = document.getElementById("search");
const filterButton = document.getElementById("filterBtn");
const genreFilter = document.getElementById("genreFilter");
const cityFilter = document.getElementById("cityFilter");
const artistsContainer = document.getElementById("artistsList");

// загрузка артистов
async function loadArtists() {
    try {
        let url = "http://localhost:8080/api/artists";

        const params = [];

        const search = searchField.value;
        const genre = genreFilter.value;
        const city = cityFilter.value;

        if (search && search.trim() !== "") {
            params.push(`search=${encodeURIComponent(search)}`);
        }

        if (genre && genre !== "") {
            params.push(`genre=${genre}`);
        }

        if (city && city !== "") {
            params.push(`city=${encodeURIComponent(city)}`);
        }

        if (params.length > 0) {
            url += "?" + params.join("&");
        }

        const response = await fetch(url);
        const artists = await response.json();

        renderArtists(artists);

    } catch (error) {
        console.error("Помилка завантаження артистів:", error);
    }
}

// рендер артистов
function renderArtists(artists) {
    artistsContainer.innerHTML = "";

    if (!artists || artists.length === 0) {
        artistsContainer.innerHTML = `<p>Митців не знайдено</p>`;
        return;
    }

    artists.forEach(artist => {
        const el = document.createElement("div");
        el.className = "artist-card";

        el.innerHTML = `
    <div class="artist-card"><a href="artist-profile.html?id=${artist.id}">

        <div class="artist-top">
            <div class="artist-avatar">
                <img src="${artist.avatar_url}" alt="avatar">
            </div>

            <div class="artist-main">
                <div class="artist-name">${artist.nickname}</div>

                <div class="artist-meta">
                    <span class="artist-genre">${artist.genre}</span>
                    <span class="artist-city">${artist.city}</span>
                </div>
            </div>
        </div>

        <div class="artist-about">
            ${artist.about || ""}
        </div>
</a>
    </div>
`;

        artistsContainer.appendChild(el);
    });
}


// поиск при вводе
searchField.addEventListener("input", function () {
    loadArtists();
});

// кнопка фильтра
filterButton.addEventListener("click", function () {
    loadArtists();
});

// загрузка при старте
document.addEventListener("DOMContentLoaded", () => {
    loadArtists();
});