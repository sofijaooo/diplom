const searchField = document.getElementById("search");
const filterButton = document.getElementById("filterBtn");
const eventsContainer = document.getElementById("eventsList");

// загрузка событий
async function loadEvents(query = "") {
    try {
        let url = "http://localhost:8080/api/events";

        if (query.trim() !== "") {
            url += `?search=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        const events = await response.json();

        renderEvents(events);
    } catch (error) {
        console.error("Помилка завантаження подій:", error);
    }
}

// рендер событий
function renderEvents(events) {
    eventsContainer.innerHTML = "";

    if (!events || events.length === 0) {
        eventsContainer.innerHTML = `<p>Події не знайдено</p>`;
        return;
    }
    // <p>Коментар: ${event.comments || ""}</p>
    // <p>Рішення: ${event.decision === null ? "Не визначено" : event.decision}</p>
    events.forEach(event => {
        const el = document.createElement("div");
        el.className = "event-card";
        el.innerHTML = `
           <div class="event-card">

        <div class="event-row event-row-top">
            <div class="event-date-time">
                <span>${event.eventDate}</span>
                <span>${event.time}</span>
            </div>

            <button class="event-btn">Показати на мапі</button>
        </div>

        <div class="event-row event-row-bottom">
            <div class="event-user">
                <div class="event-avatar">
                    <img src="${artist.avatar_url}" alt="avatar">
                </div>
                <span class="event-username">${event.userId}</span>
            </div>

            <div class="event-place">
                ${event.place}
            </div>
        </div>

    </div>  
        `;
        eventsContainer.appendChild(el);
    });
}

// динамический поиск при вводе
searchField.addEventListener("input", function () {
    const query = this.value;
    loadEvents(query);
});

// поиск по кнопке
filterButton.addEventListener("click", function () {
    const query = searchField.value;
    loadEvents(query);
});

// при загрузке страницы показываем все события
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});