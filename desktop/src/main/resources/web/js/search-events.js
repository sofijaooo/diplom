// const searchField = document.getElementById("search");
// const filterButton = document.getElementById("filterBtn");
// const eventsContainer = document.getElementById("eventsList");
//
// // загрузка событий
// async function loadEvents(query = "") {
//     try {
//         let url = "http://localhost:8080/api/events";
//
//         if (query.trim() !== "") {
//             url += `?search=${encodeURIComponent(query)}`;
//         }
//
//         const response = await fetch(url);
//         const events = await response.json();
//
//         renderEvents(events);
//     } catch (error) {
//         console.error("Помилка завантаження подій:", error);
//     }
// }
//
// // рендер событий
// function renderEvents(events) {
//     eventsContainer.innerHTML = "";
//
//     if (!events || events.length === 0) {
//         eventsContainer.innerHTML = `<p>Події не знайдено</p>`;
//         return;
//     }
//     // <p>Коментар: ${event.comments || ""}</p>
//     // <p>Рішення: ${event.decision === null ? "Не визначено" : event.decision}</p>
//     events.forEach(event => {
//         const el = document.createElement("div");
//         el.className = "event-card";
//         el.innerHTML = `
//
//
//         <div class="event-row event-row-top">
//             <div class="event-date-time">
//                 <span>${event.eventDate}</span>
//                 <span>${event.time}</span>
//             </div>
//
//             <button class="event-btn">Показати на мапі</button>
//         </div>
//
//         <div class="event-row event-row-bottom">
//             <div class="event-user">
//                 <div class="event-avatar">
//
//                 </div>
//                 <span class="event-username">${event.userId}</span>
//             </div>
//
//             <div class="event-place">
//                 ${event.place}
//             </div>
//         </div>
//
//         `;
//         eventsContainer.appendChild(el);
//     });
// }
//
// // динамический поиск при вводе
// searchField.addEventListener("input", function () {
//     const query = this.value;
//     loadEvents(query);
// });
//
// // поиск по кнопке
// filterButton.addEventListener("click", function () {
//     const query = searchField.value;
//     loadEvents(query);
// });
//
// // при загрузке страницы показываем все события
// document.addEventListener("DOMContentLoaded", () => {
//     loadEvents();
// });
const searchField = document.getElementById("search");
const filterButton = document.getElementById("filterBtn");
const eventsContainer = document.getElementById("eventsList");
const dateValue = document.getElementById("dateValue");
const timeFilter = document.getElementById("timeFilter");

async function loadEvents() {
    try {
        let url = "http://localhost:8080/api/events";
        const params = [];

        const search = searchField.value.trim();
        const date = dateValue ? dateValue.value.trim() : "";
        const time = timeFilter ? timeFilter.value.trim() : "";

        if (search !== "") {
            params.push(`search=${encodeURIComponent(search)}`);
        }

        if (date !== "") {
            params.push(`date=${encodeURIComponent(date)}`);
        }

        if (time !== "") {
            params.push(`time=${encodeURIComponent(time)}`);
        }

        if (params.length > 0) {
            url += "?" + params.join("&");
        }
        console.log("REQUEST URL:", url);
        console.log("dateValue:", dateValue?.value);
        console.log("timeFilter:", timeFilter?.value);

        const response = await fetch(url);
        const events = await response.json();

        renderEvents(events);
    } catch (error) {
        console.error("Помилка завантаження подій:", error);
    }
}

function renderEvents(events) {
    eventsContainer.innerHTML = "";

    if (!events || events.length === 0) {
        eventsContainer.innerHTML = `<p>Події не знайдено</p>`;
        return;
    }

    events.forEach(event => {
        const el = document.createElement("div");
        el.className = "event-card";

        // el.innerHTML = `
        //     <div class="event-row event-row-top">
        //         <div class="event-date-time">
        //             <span>${event.eventDate}</span>
        //             <span>${event.time}</span>
        //         </div>
        //
        //         <button class="event-btn">Показати на мапі</button>
        //     </div>
        //
        //     <div class="event-row event-row-bottom">
        //         <div class="event-user">
        //             <div class="event-avatar"></div>
        //             <span class="event-username">${event.userId}</span>
        //         </div>
        //
        //         <div class="event-place">
        //             ${event.place}
        //         </div>
        //     </div>
        // `;

        el.innerHTML = `
    <div class="event-row event-row-top">
        <div class="event-date-time">
            <span>${event.eventDate}</span>
            <span>${event.time}</span>
        </div>

        <button 
            class="event-btn event-map-btn"
            data-id="${event.id}"
            data-lat="${event.latitude ?? ''}"
            data-lng="${event.longitude ?? ''}"
            data-place="${event.place ?? ''}"
            data-date="${event.eventDate ?? ''}"
            data-time="${event.time ?? ''}"
        >
            Показати на мапі
        </button>
    </div>

    <div class="event-row event-row-bottom">
        <div class="event-user">
            <div class="event-avatar"></div>
            <span class="event-username">${event.userId}</span>
        </div>

        <div class="event-place">
            ${event.place}
        </div>
    </div>
`;

        eventsContainer.appendChild(el);

        const mapBtn = el.querySelector(".event-map-btn");

        mapBtn.addEventListener("click", () => {
            const focusEvent = {
                id: mapBtn.dataset.id,
                latitude: mapBtn.dataset.lat,
                longitude: mapBtn.dataset.lng,
                place: mapBtn.dataset.place,
                eventDate: mapBtn.dataset.date,
                time: mapBtn.dataset.time
            };

            localStorage.setItem("mapFocusEvent", JSON.stringify(focusEvent));
            window.location.href = "map.html";
        });
    });
}

searchField.addEventListener("input", loadEvents);
filterButton.addEventListener("click", loadEvents);

document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});