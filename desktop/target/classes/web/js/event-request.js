
document.addEventListener("DOMContentLoaded", () => {
    if (!protectPage({
        roles: ["artist"],
        message: "Заявка на подію доступна лише для митців"
    })) {
        return;
    }

    const form = document.getElementById("eventRequestForm");
    const user = getCurrentUser();

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const city = document.getElementById("eventCity").value.trim();
        const street = document.getElementById("eventStreet").value.trim();
        const house = document.getElementById("eventHouse").value.trim();

        const rawDate = document.getElementById("eventDate").value.trim();
        const rawTime = document.getElementById("eventTime").value.trim();

        const place = `${city}, ${street}, ${house}`;

        const data = {
            userId: user.id || user.userId,
            city,
            street,
            house,
            place,
            eventDateRaw: rawDate,
            eventDate: convertDateToBackendFormat(rawDate),
            time: rawTime,
            comments: document.getElementById("eventComments").value.trim()
        };

        const error = validateEventRequest(data);

        if (error) {
            showAuthError(error);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: data.userId,
                    place: data.place,
                    eventDate: data.eventDate,
                    time: data.time,
                    comments: data.comments
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showAuthError(result.message || "Не вдалося надіслати заявку");
                return;
            }

            form.reset();
            showAuthError("Заявку надіслано адміністратору на перевірку");

        } catch (error) {
            showAuthError("Сервер недоступний");
        }
    });
});

function validateEventRequest(data) {
    if (!data.city) return "Введіть місто";
    if (data.city.length < 2) return "Назва міста має містити мінімум 2 символи";

    if (!data.street) return "Введіть назву вулиці, проспекту або площі";
    if (data.street.length < 3) return "Назва вулиці має містити мінімум 3 символи";

    if (!data.house) return "Введіть номер будинку";
    if (!/^[0-9А-Яа-яA-Za-zІіЇїЄєҐґ\/\- ]{1,10}$/.test(data.house)) {
        return "Номер будинку введено некоректно";
    }

    if (data.place.length > 100) {
        return "Адреса занадто довга. Скоротіть назву вулиці або коментар";
    }

    if (!data.eventDateRaw) return "Введіть дату події";

    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(data.eventDateRaw)) {
        return "Дата має бути у форматі дд.мм.рррр";
    }

    const [day, month, year] = data.eventDateRaw.split(".").map(Number);
    const eventDateObject = new Date(year, month - 1, day);

    if (
        eventDateObject.getFullYear() !== year ||
        eventDateObject.getMonth() !== month - 1 ||
        eventDateObject.getDate() !== day
    ) {
        return "Введіть коректну дату";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDateObject.setHours(0, 0, 0, 0);

    if (eventDateObject < today) {
        return "Дата події не може бути в минулому";
    }

    if (!data.time) return "Введіть час події";

    if (!/^\d{2}:\d{2}$/.test(data.time)) {
        return "Час має бути у форматі гг:хх";
    }

    const [hours, minutes] = data.time.split(":").map(Number);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return "Введіть коректний час";
    }

    if (data.comments.length > 255) {
        return "Коментар не може бути довшим за 255 символів";
    }

    return null;
}

function convertDateToBackendFormat(date) {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        return null;
    }

    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
    loadArtistRequests();
});

async function loadArtistRequests() {
    const user = getCurrentUser();
    const container = document.getElementById("artistRequestsList");

    if (!container) {
        return;
    }

    if (!user || user.role !== "artist") {
        container.innerHTML = `<p class="artist-requests-empty">Заявки доступні лише митцю.</p>`;
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/events/user/${user.id}`);

        if (!response.ok) {
            throw new Error("Не вдалося завантажити заявки");
        }

        const events = await response.json();

        if (!events.length) {
            container.innerHTML = `<p class="artist-requests-empty">Ви ще не подавали заявки.</p>`;
            return;
        }

        container.innerHTML = events.map(event => `
            <article class="artist-request-card">
                <div class="artist-request-header">
                    <div>
                        <h3>${event.place}</h3>
                        <p>${event.eventDate} · ${event.time}</p>
                    </div>

                    <span class="artist-request-status artist-request-status-${event.status}">
                        ${getStatusLabel(event.status)}
                    </span>
                </div>

                ${event.comments ? `
                    <p class="artist-request-comment">
                        <span>Коментар:</span> ${event.comments}
                    </p>
                ` : ""}
            </article>
        `).join("");

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="artist-requests-empty">Помилка завантаження заявок.</p>`;
    }
}

function getStatusLabel(status) {
    switch (status) {
        case "pending":
            return "На розгляді";
        case "approved":
            return "Погоджено";
        case "rejected":
            return "Відхилено";
        default:
            return status;
    }
}