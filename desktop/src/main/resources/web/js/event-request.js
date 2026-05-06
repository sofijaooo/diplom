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

        const data = {
            userId: user.id || user.userId,
            place: document.getElementById("eventPlace").value.trim(),
            eventDate: document.getElementById("eventDate").value,
            time: document.getElementById("eventTime").value,
            comments: document.getElementById("eventComments").value.trim()
        };

        if (!data.place || !data.eventDate || !data.time) {
            showAuthError("Заповніть адресу, дату та час події");
            return;
        }

        const response = await fetch("http://localhost:8080/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            showAuthError("Не вдалося надіслати заявку");
            return;
        }

        form.reset();
        showAuthError("Заявку надіслано адміністратору на перевірку");
    });
});