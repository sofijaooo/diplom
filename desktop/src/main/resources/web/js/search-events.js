document.getElementById("search").addEventListener("input", async function () {
    const query = this.value;

    const response = await fetch(`http://localhost:8080/api/events?search=${encodeURIComponent(query)}`);
    const events = await response.json();

    renderEvents(events);
});
const searchField = document.getElementById("searchInput");
const filterButton = document.getElementById("filterBtn");

filterButton.addEventListener("click", async () => {
    const query = searchField.value; // берём текст из поля поиска

    const response = await fetch(`http://localhost:8080/api/events?search=${encodeURIComponent(query)}`);
    const events = await response.json();

    renderEvents(events); // твоя функция рендеринга событий
});
function renderEvents(events) {
    const container = document.getElementById("eventsList");
    container.innerHTML = "";

    events.forEach(event => {
        const el = document.createElement("div");
        el.className = "event-card";
        el.innerHTML = `
            <p>ID: ${event.id}</p>
            <p>Місце: ${event.place}</p>
            <p>Дата: ${event.eventDate} Час: ${event.time}</p>
            <p>Автор: ${event.userId}</p>
            <p>Коментар: ${event.comments || ''}</p>
            <p>Рішення: ${event.decision === null ? 'Не визначено' : event.decision}</p>
        `;
        container.appendChild(el);
    });
}
document.getElementById("search").addEventListener("input", async function () {
    const query = this.value;

    console.log("SEARCH:", query);

    const response = await fetch(`http://localhost:8080/api/events?search=${encodeURIComponent(query)}`);

    const events = await response.json();

    console.log("EVENTS:", events);

    renderEvents(events);
});