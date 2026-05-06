// // document.addEventListener("DOMContentLoaded", () => {
// //     if (!protectPage({
// //         roles: ["artist"],
// //         message: "Заявка на подію доступна лише для митців"
// //     })) {
// //         return;
// //     }
// //
// //     const form = document.getElementById("eventRequestForm");
// //     const user = getCurrentUser();
// //
// //     form.addEventListener("submit", async (event) => {
// //         event.preventDefault();
// //
// //         const data = {
// //             userId: user.id || user.userId,
// //             place: document.getElementById("eventPlace").value.trim(),
// //             eventDate: document.getElementById("eventDate").value,
// //             time: document.getElementById("eventTime").value,
// //             comments: document.getElementById("eventComments").value.trim()
// //         };
// //
// //         const error = validateEventRequest(data);
// //
// //         if (error) {
// //             showAuthError(error);
// //             return;
// //         }
// //
// //         try {
// //             const response = await fetch("http://localhost:8080/api/events", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },
// //                 body: JSON.stringify(data)
// //             });
// //
// //             const result = await response.json();
// //
// //             if (!response.ok) {
// //                 showAuthError(result.message || "Не вдалося надіслати заявку");
// //                 return;
// //             }
// //
// //             form.reset();
// //             showAuthError("Заявку надіслано адміністратору на перевірку");
// //
// //         } catch (error) {
// //             showAuthError("Сервер недоступний");
// //         }
// //     });
// // });
// //
// // function validateEventRequest(data) {
// //     if (!data.place) {
// //         return "Введіть адресу проведення події";
// //     }
// //
// //     if (data.place.length < 5) {
// //         return "Адреса має містити мінімум 5 символів";
// //     }
// //
// //     if (data.place.length > 100) {
// //         return "Адреса не може бути довшою за 100 символів";
// //     }
// //
// //     if (!data.eventDate) {
// //         return "Оберіть дату події";
// //     }
// //
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);
// //
// //     const eventDate = new Date(data.eventDate);
// //     eventDate.setHours(0, 0, 0, 0);
// //
// //     if (eventDate < today) {
// //         return "Дата події не може бути в минулому";
// //     }
// //
// //     if (!data.time) {
// //         return "Оберіть час події";
// //     }
// //
// //     if (data.comments.length > 255) {
// //         return "Коментар не може бути довшим за 255 символів";
// //     }
// //
// //     return null;
// // }
//
// document.addEventListener("DOMContentLoaded", () => {
//     if (!protectPage({
//         roles: ["artist"],
//         message: "Заявка на подію доступна лише для митців"
//     })) {
//         return;
//     }
//
//     const form = document.getElementById("eventRequestForm");
//     const user = getCurrentUser();
//
//     form.addEventListener("submit", async (event) => {
//         event.preventDefault();
//
//         const rawDate = document.getElementById("eventDate").value.trim();
//         const rawTime = document.getElementById("eventTime").value.trim();
//
//         const data = {
//             userId: user.id || user.userId,
//             place: document.getElementById("eventPlace").value.trim(),
//             eventDateRaw: rawDate,
//             eventDate: convertDateToBackendFormat(rawDate),
//             time: rawTime,
//             comments: document.getElementById("eventComments").value.trim()
//         };
//
//         const error = validateEventRequest(data);
//
//         if (error) {
//             showAuthError(error);
//             return;
//         }
//
//         try {
//             const response = await fetch("http://localhost:8080/api/events", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     userId: data.userId,
//                     place: data.place,
//                     eventDate: data.eventDate,
//                     time: data.time,
//                     comments: data.comments
//                 })
//             });
//
//             const result = await response.json();
//
//             if (!response.ok) {
//                 showAuthError(result.message || "Не вдалося надіслати заявку");
//                 return;
//             }
//
//             form.reset();
//             showAuthError("Заявку надіслано адміністратору на перевірку");
//
//         } catch (error) {
//             showAuthError("Сервер недоступний");
//         }
//     });
// });
//
// function validateEventRequest(data) {
//     if (!data.place) {
//         return "Введіть адресу проведення події";
//     }
//
//     if (data.place.length < 5) {
//         return "Адреса має містити мінімум 5 символів";
//     }
//
//     if (data.place.length > 100) {
//         return "Адреса не може бути довшою за 100 символів";
//     }
//
//     if (!data.eventDateRaw) {
//         return "Введіть дату події";
//     }
//
//     if (!/^\d{2}\.\d{2}\.\d{4}$/.test(data.eventDateRaw)) {
//         return "Дата має бути у форматі дд.мм.рррр";
//     }
//
//     const dateParts = data.eventDateRaw.split(".");
//     const day = Number(dateParts[0]);
//     const month = Number(dateParts[1]);
//     const year = Number(dateParts[2]);
//
//     const eventDateObject = new Date(year, month - 1, day);
//
//     if (
//         eventDateObject.getFullYear() !== year ||
//         eventDateObject.getMonth() !== month - 1 ||
//         eventDateObject.getDate() !== day
//     ) {
//         return "Введіть коректну дату";
//     }
//
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     eventDateObject.setHours(0, 0, 0, 0);
//
//     if (eventDateObject < today) {
//         return "Дата події не може бути в минулому";
//     }
//
//     if (!data.time) {
//         return "Введіть час події";
//     }
//
//     if (!/^\d{2}:\d{2}$/.test(data.time)) {
//         return "Час має бути у форматі гг:хх";
//     }
//
//     const timeParts = data.time.split(":");
//     const hours = Number(timeParts[0]);
//     const minutes = Number(timeParts[1]);
//
//     if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
//         return "Введіть коректний час";
//     }
//
//     if (data.comments.length > 255) {
//         return "Коментар не може бути довшим за 255 символів";
//     }
//
//     return null;
// }
//
// function convertDateToBackendFormat(date) {
//     if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
//         return null;
//     }
//
//     const parts = date.split(".");
//     const day = parts[0];
//     const month = parts[1];
//     const year = parts[2];
//
//     return `${year}-${month}-${day}`;
// }
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