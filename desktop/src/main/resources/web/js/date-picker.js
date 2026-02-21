const uaMonths = ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
const pad = n => String(n).padStart(2, "0");
const fmtISO = (y,m,d) => `${y}-${pad(m+1)}-${pad(d)}`;
const fmtLabel = (y,m,d) => `${pad(d)}.${pad(m+1)}.${y}`;

const btn = document.getElementById("dateBtn");
const pop = document.getElementById("datePopover");
const grid = document.getElementById("calGrid");
const title = document.getElementById("monthTitle");
const label = document.getElementById("dateLabel");
const hidden = document.getElementById("dateValue");

let view = new Date(); // поточний місяць
view.setDate(1);

function openPop() {
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    render();
}
function closePop() {
    pop.hidden = true;
    btn.setAttribute("aria-expanded", "false");
}

function render() {
    const y = view.getFullYear();
    const m = view.getMonth();
    title.textContent = `${uaMonths[m]} ${y}`;
    grid.innerHTML = "";

    const firstDay = new Date(y, m, 1);
    const jsDay = firstDay.getDay();
    const offset = (jsDay + 6) % 7;

    const daysInMonth = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
        const empty = document.createElement("div");
        empty.className = "cal__cell cal__cell--empty";
        grid.appendChild(empty);
    }

    // дні
    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "cal__cell";
        cell.textContent = d;

        const iso = fmtISO(y, m, d);
        if (hidden.value === iso) cell.classList.add("is-selected");

        cell.addEventListener("click", () => {
            hidden.value = iso;
            label.textContent = fmtLabel(y, m, d);
            closePop();
        });

        grid.appendChild(cell);
    }
}

btn.addEventListener("click", () => (pop.hidden ? openPop() : closePop()));
document.getElementById("prevMonth").addEventListener("click", () => { view.setMonth(view.getMonth() - 1); render(); });
document.getElementById("nextMonth").addEventListener("click", () => { view.setMonth(view.getMonth() + 1); render(); });
document.getElementById("closeDate").addEventListener("click", closePop);
document.getElementById("clearDate").addEventListener("click", () => { hidden.value=""; label.textContent="Дата"; closePop(); });

document.addEventListener("click", (e) => {
    if (!pop.hidden && !pop.contains(e.target) && e.target !== btn && !btn.contains(e.target)) closePop();
});