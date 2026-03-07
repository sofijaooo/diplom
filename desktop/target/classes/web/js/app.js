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

//щастя здоровля

let healthTimer = null;

async function checkBackend() {
    try {
        const res = await fetch(`${API_BASE}/api/health`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.ok === true;
    } catch {
        return false;
    }
}

function setConnectionUI(isOk) {
    const status = document.getElementById("connectionStatus");
    if (!status) return;

    status.textContent = isOk ? "Backend: OK ✅" : "Backend: OFFLINE ❌ (retrying…)";
}

async function startHealthChecks() {
    // 1) try immediately on open
    const okNow = await checkBackend();
    setConnectionUI(okNow);

    // 2) if not ok, retry every 10 seconds until it becomes ok
    if (!okNow) {
        if (healthTimer) clearInterval(healthTimer);
        healthTimer = setInterval(async () => {
            const ok = await checkBackend();
            setConnectionUI(ok);

            if (ok) {
                clearInterval(healthTimer);
                healthTimer = null;
            }
        }, 2_000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startHealthChecks();
});