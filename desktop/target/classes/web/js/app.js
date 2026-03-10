console.log("StreetArt Live UI loaded");
const API_BASE = "http://localhost:8080";

// Запросікі
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btnMatchId");
    const field = document.getElementById("matchIdField");
    const status = document.getElementById("matchIdStatus");

    if (!btn || !field || !status) return;

    btn.addEventListener("click", async () => {
        status.textContent = "Loading...";
        field.value = "";

        try {
            const res = await fetch(`${API_BASE}/api/first-match-id`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            field.value = data.matchId ?? "";
            status.textContent = data.matchId ? "OK" : (data.message ?? "No data");
        } catch (e) {
            status.textContent = `Error: ${e.message}`;
        }
    });
});

// health check
document.addEventListener("DOMContentLoaded", () => {
    startBackendHealthCheck({
        url: `${API_BASE}/api/health`,
        onlineInterval: 20000,
        offlineInterval: 2000,
        timeout: 3000,

        onStatusChange: function (online) {
            console.log("Backend status:", online ? "ONLINE" : "OFFLINE");

            const statusEl = document.getElementById("connectionStatus");
            if (statusEl) {
                statusEl.textContent = online
                    ? "Backend: OK ✅"
                    : "Backend: OFFLINE ❌ (retrying...)";
            }
        },

        onOnline: function () {
            console.log("Соединение восстановлено");
        },

        onOffline: function () {
            console.log("Соединение потеряно");
        }
    });
});