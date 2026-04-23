const toggle = document.getElementById("mapThemeToggle");
const frame = document.getElementById("mapFrame");

toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "light" : "dark";

    frame.contentWindow.postMessage(
        { type: "SET_THEME", theme: theme },
        "*"
    );
});


const toggle = document.getElementById("mapThemeToggle");
const frame = document.getElementById("mapFrame");

function sendTheme() {
    const theme = toggle.checked ? "light" : "dark";

    frame.contentWindow.postMessage(
        { type: "SET_THEME", theme },
        "*"
    );
}

function sendFocusEvent() {
    const raw = localStorage.getItem("mapFocusEvent");
    if (!raw) return;

    try {
        const focusEvent = JSON.parse(raw);

        frame.contentWindow.postMessage(
            { type: "FOCUS_EVENT", event: focusEvent },
            "*"
        );

        localStorage.removeItem("mapFocusEvent");
    } catch (e) {
        console.error("Помилка читання mapFocusEvent:", e);
    }
}

if (toggle && frame) {
    frame.addEventListener("load", () => {
        sendTheme();
        setTimeout(() => {
            sendFocusEvent();
        }, 300);
    });

    toggle.addEventListener("change", sendTheme);
}