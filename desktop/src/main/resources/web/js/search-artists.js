// const searchField = document.getElementById("search");
// const filterButton = document.getElementById("filterBtn");
// // const genreFilter = document.getElementById("genreFilter");
// // const cityFilter = document.getElementById("cityFilter");
// const artistsContainer = document.getElementById("artistsList");
// const searchField = document.getElementById("search");
// const filterButton = document.getElementById("filterBtn");
// const artistsContainer = document.getElementById("artistsList");
//
// let selectedGenre = "";
// let selectedCity = "";
//
// const genrePickerBtn = document.getElementById("genrePickerBtn");
// const cityPickerBtn = document.getElementById("cityPickerBtn");
//
// const genrePopover = document.getElementById("genrePopover");
// const cityPopover = document.getElementById("cityPopover");
//
// // загрузка артистов
// async function loadArtists() {
//     try {
//         let url = "http://localhost:8080/api/artists";
//
//         const params = [];
//
//         const search = searchField.value;
//         // const genre = genreFilter.value;
//         // const city = cityFilter.value;
//         const genre = selectedGenre;
//         const city = selectedCity;
//
//         if (search && search.trim() !== "") {
//             params.push(`search=${encodeURIComponent(search)}`);
//         }
//
//         if (genre && genre !== "") {
//             params.push(`genre=${genre}`);
//         }
//
//         if (city && city !== "") {
//             params.push(`city=${encodeURIComponent(city)}`);
//         }
//
//         if (params.length > 0) {
//             url += "?" + params.join("&");
//         }
//
//         const response = await fetch(url);
//         const artists = await response.json();
//
//         renderArtists(artists);
//
//     } catch (error) {
//         console.error("Помилка завантаження артистів:", error);
//     }
// }
//
// // рендер артистов
// // function renderArtists(artists) {
// //     artistsContainer.innerHTML = "";
// //
// //     if (!artists || artists.length === 0) {
// //         artistsContainer.innerHTML = `<p>Митців не знайдено</p>`;
// //         return;
// //     }
// //
// //     artists.forEach(artist => {
// //         const el = document.createElement("div");
// //         el.className = "artist-card";
// //
// //         el.innerHTML = `
// //     <div class="artist-card"><a href="artist-profile.html?id=${artist.id}">
// //
// //         <div class="artist-top">
// //             <div class="artist-avatar">
// //                 <img src="${artist.avatar_url}" alt="avatar">
// //             </div>
// //
// //             <div class="artist-main">
// //                 <div class="artist-name">${artist.nickname}</div>
// //
// //                 <div class="artist-meta">
// //                     <span class="artist-genre">${artist.genre}</span>
// //                     <span class="artist-city">${artist.city}</span>
// //                 </div>
// //             </div>
// //         </div>
// //
// //         <div class="artist-about">
// //             ${artist.about || ""}
// //         </div>
// // </a>
// //     </div>
// // `;
// //
// //         artistsContainer.appendChild(el);
// //     });
// // }
// function renderArtists(artists) {
//     artistsContainer.innerHTML = "";
//
//     if (!artists || artists.length === 0) {
//         artistsContainer.innerHTML = `<p class="artists-empty">Митців не знайдено</p>`;
//         return;
//     }
//
//     artists.forEach(artist => {
//         // const el = document.createElement("a");
//         // el.className = "artist-card";
//         // el.href = `artist-profile.html?id=${artist.id}`;
//         //
//         // el.innerHTML = `
//         //     <div class="artist-top">
//         //         <div class="artist-avatar">
//         //             <img src="${artist.avatar_url || '../images/default-avatar.png'}" alt="avatar">
//         //         </div>
//         //
//         //         <div class="artist-main">
//         //             <div class="artist-name">${artist.nickname || "Без імені"}</div>
//         //
//         //             <div class="artist-meta">
//         //                 <span class="artist-genre">${artist.genre || "Жанр не вказано"}</span>
//         //                 <span class="artist-city">${artist.city || "Місто не вказано"}</span>
//         //             </div>
//         //         </div>
//         //     </div>
//         //
//         //     <div class="artist-about">
//         //         ${artist.about || ""}
//         //     </div>
//         // `;
//
//         const el = document.createElement("a");
//         el.className = "artist-card";
//         el.href = `artist-profile.html?id=${artist.id}`;
//
//         el.innerHTML = `
//     <div class="artist-top">
//         <div class="artist-avatar">
//             <img src="${artist.avatar_url}" alt="avatar">
//         </div>
//
//         <div class="artist-main">
//             <div class="artist-name">${artist.nickname}</div>
//
//             <div class="artist-meta">
//                 <span class="artist-genre">${artist.genre}</span>
//                 <span class="artist-city">${artist.city}</span>
//             </div>
//         </div>
//     </div>
//
//     <div class="artist-about">
//         ${artist.about || ""}
//     </div>
// `;
//
//         artistsContainer.appendChild(el);
//     });
// }
//
// // поиск при вводе
// searchField.addEventListener("input", function () {
//     loadArtists();
// });
//
// // кнопка фильтра
// filterButton.addEventListener("click", function () {
//     loadArtists();
// });
//
// // загрузка при старте
// document.addEventListener("DOMContentLoaded", () => {
//     loadArtists();
// });
//
// function togglePopover(popover) {
//     document.querySelectorAll(".popover").forEach(item => {
//         if (item !== popover) {
//             item.classList.add("is-hidden");
//         }
//     });
//
//     popover.classList.toggle("is-hidden");
// }
//
// genrePickerBtn.addEventListener("click", () => {
//     togglePopover(genrePopover);
// });
//
// cityPickerBtn.addEventListener("click", () => {
//     togglePopover(cityPopover);
// });
//
// genrePopover.querySelectorAll(".performer-option").forEach(button => {
//     button.addEventListener("click", () => {
//         selectedGenre = button.dataset.value;
//         genrePickerBtn.textContent = button.textContent;
//         genrePopover.classList.add("is-hidden");
//         loadArtists();
//     });
// });
//
// cityPopover.querySelectorAll(".performer-option").forEach(button => {
//     button.addEventListener("click", () => {
//         selectedCity = button.dataset.value;
//         cityPickerBtn.textContent = button.textContent;
//         cityPopover.classList.add("is-hidden");
//         loadArtists();
//     });
// });
//
// document.addEventListener("click", (event) => {
//     if (!event.target.closest(".picker")) {
//         document.querySelectorAll(".popover").forEach(item => {
//             item.classList.add("is-hidden");
//         });
//     }
// });

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