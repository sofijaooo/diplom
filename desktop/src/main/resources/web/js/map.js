const toggle = document.getElementById("mapThemeToggle");
const frame = document.getElementById("mapFrame");

toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "light" : "dark";

    frame.contentWindow.postMessage(
        { type: "SET_THEME", theme: theme },
        "*"
    );
});