
if (!protectPage()) {
    throw new Error("Access denied");
}

const searchField = document.getElementById("search");
const filterButton = document.getElementById("filterBtn");
const artistsContainer = document.getElementById("artistsList");

let selectedGenre = "";
let selectedCity = "";

const genrePickerBtn = document.getElementById("genrePickerBtn");
const cityPickerBtn = document.getElementById("cityPickerBtn");
const genrePopover = document.getElementById("genrePopover");
const cityPopover = document.getElementById("cityPopover");

async function loadArtists() {
    try {
        let url = "http://localhost:8080/api/artists";
        const params = [];

        const search = searchField.value.trim();

        if (search !== "") {
            params.push(`search=${encodeURIComponent(search)}`);
        }

        if (selectedGenre !== "") {
            params.push(`genre=${encodeURIComponent(selectedGenre)}`);
        }

        if (selectedCity !== "") {
            params.push(`city=${encodeURIComponent(selectedCity)}`);
        }

        if (params.length > 0) {
            url += "?" + params.join("&");
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const artists = await response.json();
        renderArtists(artists);

    } catch (error) {
        console.error("Помилка завантаження артистів:", error);
        artistsContainer.innerHTML = `<p class="artists-empty">Помилка завантаження митців</p>`;
    }
}

function renderArtists(artists) {
    artistsContainer.innerHTML = "";

    if (!artists || artists.length === 0) {
        artistsContainer.innerHTML = `<p class="artists-empty">Митців не знайдено</p>`;
        return;
    }

    artists.forEach(artist => {
        const el = document.createElement("a");
        el.className = "artist-card";
        el.href = `artist-profile.html?id=${artist.id}`;

        el.innerHTML = `
            <div class="artist-top">
                <div class="artist-avatar">
                    <img src="${artist.avatar_url || "../images/default-avatar.png"}" alt="avatar">
                </div>

                <div class="artist-main">
                    <div class="artist-name">${artist.nickname || "Без імені"}</div>

                    <div class="artist-meta">
                        <span class="artist-genre">${artist.genre || "Жанр не вказано"}</span>
                        <span class="artist-city">${artist.city || "Місто не вказано"}</span>
                    </div>
                </div>
            </div>

            <div class="artist-about">
                ${artist.about || ""}
            </div>
        `;

        artistsContainer.appendChild(el);
    });
}

function closeAllPopovers() {
    document.querySelectorAll(".popover").forEach(popover => {
        popover.classList.add("is-hidden");
    });
}

function togglePopover(popover) {
    document.querySelectorAll(".popover").forEach(item => {
        if (item !== popover) {
            item.classList.add("is-hidden");
        }
    });

    popover.classList.toggle("is-hidden");
}

searchField.addEventListener("input", loadArtists);

filterButton.addEventListener("click", loadArtists);

genrePickerBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    togglePopover(genrePopover);
});

cityPickerBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    togglePopover(cityPopover);
});

genrePopover.querySelectorAll(".performer-option").forEach(button => {
    button.addEventListener("click", function () {
        selectedGenre = this.dataset.value;
        genrePickerBtn.textContent = this.textContent;
        genrePopover.classList.add("is-hidden");
        loadArtists();
    });
});

cityPopover.querySelectorAll(".performer-option").forEach(button => {
    button.addEventListener("click", function () {
        selectedCity = this.dataset.value;
        cityPickerBtn.textContent = this.textContent;
        cityPopover.classList.add("is-hidden");
        loadArtists();
    });
});

document.addEventListener("click", function (event) {
    if (!event.target.closest(".picker")) {
        closeAllPopovers();
    }
});

document.addEventListener("DOMContentLoaded", loadArtists);