function getCurrentUser() {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

function renderAccessBlock(pageTitle = "Цей розділ доступний після реєстрації") {
    const main = document.querySelector("main");

    if (!main) return;

    main.innerHTML = `
        <section class="access-card">
            <h2>${pageTitle}</h2>
            <p>
                Зареєструйтеся або увійдіть, щоб переглядати мапу виступів,
                список подій, профілі митців та користуватися можливостями платформи.
            </p>

            <div class="access-actions">
                <button onclick="window.location.href='register.html'">
                    Зареєструватися
                </button>

                <button class="access-secondary" onclick="window.location.href='../index.html'">
                    На головну
                </button>
            </div>
        </section>
    `;
}

function protectPage(options = {}) {
    const user = getCurrentUser();

    if (!user) {
        renderAccessBlock(options.message);
        return false;
    }

    if (options.roles && !options.roles.includes(user.role)) {
        renderAccessBlock("У вас немає доступу до цього розділу");
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const isArtist = document.getElementById("isArtist");
    const artistFields = document.getElementById("artistFields");

    if (isArtist && artistFields) {
        isArtist.addEventListener("change", () => {
            artistFields.classList.toggle("is-hidden", !isArtist.checked);
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const role = isArtist.checked ? "artist" : "user";

            const user = {
                id: Date.now(),
                username: document.getElementById("username").value.trim(),
                email: document.getElementById("email").value.trim(),
                role: role
            };

            if (role === "artist") {
                user.artistProfile = {
                    nickname: document.getElementById("artistNickname").value.trim(),
                    genre: document.getElementById("artistGenre").value,
                    city: document.getElementById("artistCity").value.trim(),
                    about: document.getElementById("artistAbout").value.trim()
                };
            }

            setCurrentUser(user);

            window.location.href = role === "artist"
                ? "performers.html"
                : "list-events.html";
        });
    }
});