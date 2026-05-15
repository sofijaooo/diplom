document.addEventListener("DOMContentLoaded", () => {
    if (!protectPage({
        roles: ["admin"],
        message: "Модерація доступна лише адміністратору"
    })) {
        return;
    }

    loadPendingEvents();
});

async function loadPendingEvents() {
    const container = document.getElementById("pendingEventsList");

    try {
        const response = await fetch("http://localhost:8080/api/events/pending");

        if (!response.ok) {
            throw new Error("Не вдалося завантажити заявки");
        }

        const events = await response.json();

        const groupedEvents = {};

        events.forEach(event => {
            const key = `${event.eventDate}_${event.time}`;

            if (!groupedEvents[key]) {
                groupedEvents[key] = [];
            }

            groupedEvents[key].push(event.id);
        });

        if (!events.length) {
            container.innerHTML = `<p class="moderation-empty">Немає заявок на модерацію.</p>`;
            return;
        }

        container.innerHTML = events.map(event => {

            const key = `${event.eventDate}_${event.time}`;

            const hasConflict = groupedEvents[key].length > 1;

            return `
            <article class="moderation-event-card ${hasConflict ? 'moderation-event-card-conflict' : ''}">
                <div class="moderation-event-header">
                    <div>
                        <h3 class="moderation-event-title">${event.place}</h3>
                        <p class="moderation-info-value">Коментар митця: ${event.comments || "—"}</p>
                    </div>

                    <div class="moderation-status-group">
    <span class="moderation-event-status">Pending</span>

    ${hasConflict ? `
        <span class="moderation-conflict-badge">
            Конфлікт часу
        </span>
    ` : ""}
</div>
                </div>

                <div class="moderation-event-info">
                    <div class="moderation-info-item">
                        <span class="moderation-info-label">Дата</span>
                        <span class="moderation-info-value">${event.eventDate}</span>
                    </div>

                    <div class="moderation-info-item">
                        <span class="moderation-info-label">Час</span>
                        <span class="moderation-info-value">${event.time}</span>
                    </div>
                </div>

                <div class="moderation-comment-block">
                    <label for="comment-${event.id}">Коментар адміністратора</label>
                    <textarea id="comment-${event.id}" placeholder="Причина відхилення"></textarea>
                </div>

                <div class="moderation-actions">
                    <button class="moderation-button" onclick="approveEvent(${event.id})">
                        Узгодити
                    </button>

                    <button class="moderation-button moderation-button-reject" onclick="rejectEvent(${event.id})">
                        Відхилити
                    </button>
                </div>
            </article>
        `;
        }).join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="moderation-empty">Помилка завантаження заявок.</p>`;
    }
}

async function approveEvent(eventId) {
    try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}/approve`, {
            method: "PUT"
        });

        if (!response.ok) {
            throw new Error("Помилка погодження заявки");
        }

        await loadPendingEvents();

    } catch (error) {
        console.error(error);
        alert("Не вдалося погодити заявку");
    }
}

async function rejectEvent(eventId) {
    const commentField = document.getElementById(`comment-${eventId}`);
    const comment = commentField.value.trim();

    if (!comment) {
        alert("Вкажіть причину відхилення");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/events/${eventId}/reject`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment: comment
            })
        });

        if (!response.ok) {
            throw new Error("Помилка відхилення заявки");
        }

        await loadPendingEvents();

    } catch (error) {
        console.error(error);
        alert("Не вдалося відхилити заявку");
    }
}