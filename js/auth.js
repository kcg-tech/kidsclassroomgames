const signupForm =
    document.getElementById("signup-form");

const loginForm =
    document.getElementById("login-form");

const logoutBtn =
    document.getElementById("logout-btn");

const loggedOutSection =
    document.getElementById("logged-out-section");

const loggedInSection =
    document.getElementById("logged-in-section");

const currentUserEmail =
    document.getElementById("current-user-email");

const signupMessage =
    document.getElementById("signup-message");

const loginMessage =
    document.getElementById("login-message");

const loginCard =
    document.getElementById("login-card");

const signupCard =
    document.getElementById("signup-card");

const showSignupBtn =
    document.getElementById("show-signup-btn");

const showLoginBtn =
    document.getElementById("show-login-btn");

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );

function returnToRequestedPage() {
    const returnTo =
        new URLSearchParams(
            window.location.search
        ).get("returnTo");

    if (!returnTo) {
        return false;
    }

    const returnUrl =
        new URL(
            returnTo,
            window.location.origin
        );

    if (
        returnUrl.origin !==
        window.location.origin
    ) {
        return false;
    }

    window.location.assign(
        returnUrl.href
    );

    return true;
}

function showMessage(
    element,
    message,
    type
) {
    element.textContent = message;

    element.classList.remove(
        "message-error",
        "message-success"
    );

    element.classList.add(
        type === "error"
            ? "message-error"
            : "message-success"
    );
}

function updateAccountScreen(session) {
    const isLoggedIn =
        Boolean(session?.user);

    loggedOutSection.hidden =
        isLoggedIn;

    loggedInSection.hidden =
        !isLoggedIn;

    currentUserEmail.textContent =
        session?.user?.email || "";
}


showSignupBtn.addEventListener(
    "click",
    () => {
        loginCard.hidden = true;
        signupCard.hidden = false;

        document
            .getElementById("signup-name")
            .focus();
    }
);


showLoginBtn.addEventListener(
    "click",
    () => {
        signupCard.hidden = true;
        loginCard.hidden = false;

        document
            .getElementById("login-email")
            .focus();
    }
);


passwordToggleButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                const passwordInput =
                    document.getElementById(
                        button.dataset.target
                    );

                const isCurrentlyHidden =
                    passwordInput.type ===
                    "password";

                passwordInput.type =
                    isCurrentlyHidden
                        ? "text"
                        : "password";

                button.textContent =
                    isCurrentlyHidden
                        ? "Hide"
                        : "Show";

                button.setAttribute(
                    "aria-label",
                    isCurrentlyHidden
                        ? "Hide password"
                        : "Show password"
                );

                button.setAttribute(
                    "aria-pressed",
                    String(
                        isCurrentlyHidden
                    )
                );
            }
        );
    }
);


signupForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const displayName =
            document
                .getElementById("signup-name")
                .value
                .trim();

        const email =
            document
                .getElementById("signup-email")
                .value
                .trim();

        const password =
            document
                .getElementById("signup-password")
                .value;

        showMessage(
            signupMessage,
            "Creating your account...",
            "success"
        );

        const { data, error } =
            await db.auth.signUp({
                email,
                password,

                options: {
                    data: {
                        display_name:
                            displayName
                    },

                    emailRedirectTo:
                        window.location.origin +
                        window.location.pathname
                }
            });

        if (error) {
            showMessage(
                signupMessage,
                error.message,
                "error"
            );

            return;
        }

        signupForm.reset();

        if (data.session) {
            updateAccountScreen(
                data.session
            );

            return;
        }

        showMessage(
            signupMessage,
            "Account created. Check your email to confirm your address.",
            "success"
        );
    }
);


loginForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const email =
            document
                .getElementById("login-email")
                .value
                .trim();

        const password =
            document
                .getElementById("login-password")
                .value;

        showMessage(
            loginMessage,
            "Logging in...",
            "success"
        );

        const { data, error } =
            await db.auth
                .signInWithPassword({
                    email,
                    password
                });

        if (error) {
            showMessage(
                loginMessage,
                error.message,
                "error"
            );

            return;
        }

        loginForm.reset();

        updateAccountScreen(
            data.session
        );

        returnToRequestedPage();
    }
);

logoutBtn.addEventListener(
    "click",
    async () => {
        const { error } =
            await db.auth.signOut();

        if (error) {
            alert(error.message);
        }
    }
);

db.auth.onAuthStateChange(
    (_event, session) => {
        updateAccountScreen(
            session
        );
    }
);

async function initializeAccount() {
    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    updateAccountScreen(
        data.session
    );
}

initializeAccount();