// function getCurrentUser() {
//     const raw = localStorage.getItem("currentUser");
//     return raw ? JSON.parse(raw) : null;
// }
//
// function setCurrentUser(user) {
//     localStorage.setItem("currentUser", JSON.stringify(user));
// }
//
// function logout() {
//     localStorage.removeItem("currentUser");
//     window.location.href = "../index.html";
// }

function getCurrentUser() {
    const raw = sessionStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
}

function logout() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

// function renderAccessBlock(pageTitle = "Цей розділ доступний після реєстрації") {
//     const main = document.querySelector("main");
//
//     if (!main) return;
//
//     main.innerHTML = `
//         <section class="access-card">
//             <h2>${pageTitle}</h2>
//             <p>
//                 Зареєструйтеся або увійдіть, щоб переглядати мапу виступів,
//                 список подій, профілі митців та користуватися можливостями платформи.
//             </p>
//
//             <div class="access-actions">
//                 <button onclick="window.location.href='register.html'">
//                     Зареєструватися
//                 </button>
//
//                 <button class="access-secondary" onclick="window.location.href='../index.html'">
//                     На головну
//                 </button>
//             </div>
//         </section>
//     `;
// }

function renderAccessBlock(pageTitle = "Цей розділ доступний після входу в акаунт") {
    const main = document.querySelector("main");

    if (!main) return;

    main.innerHTML = `
        <section class="access-card">
            <h2>${pageTitle}</h2>
            <p>
                Увійдіть або зареєструйтеся, щоб переглядати мапу виступів,
                список подій, профілі митців та користуватися можливостями платформи.
            </p>

            <div class="access-actions">
                <button onclick="window.location.href='login.html'">
                    Увійти
                </button>

                <button class="access-secondary" onclick="window.location.href='register.html'">
                    Зареєструватися
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

    // const user = getCurrentUser();
    //
    // document.querySelectorAll(".artist-only").forEach(link => {
    //     if (!user || user.role !== "artist") {
    //         link.style.display = "none";
    //     }
    // });
    const user = getCurrentUser();

    document.body.classList.toggle(
        "is-artist",
        !!user && user.role === "artist"
    );
    const registerForm = document.getElementById("registerForm");
    const isArtist = document.getElementById("isArtist");
    const artistFields = document.getElementById("artistFields");

    if (isArtist && artistFields) {
        isArtist.addEventListener("change", () => {
            artistFields.classList.toggle("is-hidden", !isArtist.checked);
        });
    }

    if (registerForm) {
        // registerForm.addEventListener("submit", async (event) => {
        //     event.preventDefault();
        //
        //     const role = isArtist.checked ? "artist" : "user";
        //
        //     const user = {
        //         id: Date.now(),
        //         username: document.getElementById("username").value.trim(),
        //         email: document.getElementById("email").value.trim(),
        //         role: role
        //     };
        //
        //     if (role === "artist") {
        //         user.artistProfile = {
        //             nickname: document.getElementById("artistNickname").value.trim(),
        //             genre: document.getElementById("artistGenre").value,
        //             city: document.getElementById("artistCity").value.trim(),
        //             about: document.getElementById("artistAbout").value.trim()
        //         };
        //     }
        //
        //     setCurrentUser(user);
        //
        //     window.location.href = role === "artist"
        //         ? "performers.html"
        //         : "list-events.html";
        // });
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const role = isArtist.checked ? "artist" : "user";

            const data = {
                name: document.getElementById("name").value.trim(),
                surname: document.getElementById("surname").value.trim(),
                birthDate: document.getElementById("birthDate").value,
                phone: document.getElementById("phone").value.trim(),

                username: document.getElementById("username").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value,
                role: role

                // artistNickname: document.getElementById("artistNickname")?.value.trim(),
                // artistGenre: document.getElementById("artistGenre")?.value,
                // artistCity: document.getElementById("artistCity")?.value.trim(),
                // artistAbout: document.getElementById("artistAbout")?.value.trim()
            };
            if (role === "artist") {
                data.artistNickname = document.getElementById("artistNickname").value.trim();
                data.artistGenre = document.getElementById("artistGenre").value;
                data.artistCity = document.getElementById("artistCity").value.trim();
                data.artistAbout = document.getElementById("artistAbout").value.trim();
            }
            try {
                const response = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    showAuthError(result.message || "Помилка реєстрації");
                    return;
                }

                setCurrentUser(result);
                window.location.href = "../index.html";

            } catch (error) {
                showAuthError("Сервер недоступний");
            }
        });
    }
});

function showAuthError(message) {
    let errorBox = document.getElementById("authError");

    if (!errorBox) {
        errorBox = document.createElement("p");
        errorBox.id = "authError";
        errorBox.className = "auth-error";
        document.querySelector("form").prepend(errorBox);
    }

    errorBox.textContent = message;
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
            email: document.getElementById("loginEmail").value.trim(),
            password: document.getElementById("loginPassword").value,
            // role: document.getElementById("loginRole").value
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                showAuthError(result.message || "Помилка входу");
                return;
            }

            setCurrentUser(result);
            window.location.href = "../index.html";

        } catch (error) {
            showAuthError("Сервер недоступний");
        }
    });
}

