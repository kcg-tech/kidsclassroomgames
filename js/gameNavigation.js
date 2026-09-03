function setGameNavigationVisible(
    isVisible
) {
    const gameSiteHeader =
        document.getElementById(
            "game-site-header"
        );

    if (gameSiteHeader) {
        gameSiteHeader.hidden =
            !isVisible;
    }
}

window.setGameNavigationVisible =
    setGameNavigationVisible;

async function updateGameAccountLink() {
    const accountLink =
        document.getElementById(
            "game-account-link"
        );

    if (
        !accountLink ||
        typeof db === "undefined"
    ) {
        return;
    }

    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check navigation login status:",
            error
        );

        return;
    }

    accountLink.textContent =
        data.session?.user
            ? "My Account"
            : "Log In";
}

function createGameNavigation() {
    const parameters =
        new URLSearchParams(
            window.location.search
        );

    if (
        parameters.get("mode") ===
        "play"
    ) {
        document.body.classList.add(
            "play-mode"
        );
    }

    if (parameters.has("room")) {
        document.body.classList.add(
            "student-mode"
        );
    }

    const header =
        document.createElement(
            "header"
        );

    header.id =
        "game-site-header";

    header.className =
        "game-site-header";

    header.innerHTML = `
        <a
            class="game-site-logo"
            href="/"
            aria-label="Kids Classroom Games home"
        >
            <img
                src="/images/home/kcglogo.png"
                alt=""
            >

            <span>
                Kids Classroom Games
            </span>
        </a>

        <nav
            class="game-site-nav"
            aria-label="Main navigation"
        >
            <a href="/#generators">
                Teacher Tools
            </a>

            <a href="/#games">
                Fun Games
            </a>

            <a href="/#live-games">
                Live Games
            </a>

            <a href="/#pickers">
                Random Pickers
            </a>

            <a href="/about.html">
                About
            </a>

            <a href="/contact.html">
                Contact
            </a>

            <a href="/faq.html">
                Help
            </a>

            <a
                id="game-account-link"
                href="/account.html"
            >
                Log In
            </a>
        </nav>
    `;

    document.body.prepend(
        header
    );

    updateGameAccountLink();
}

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        createGameNavigation
    );
} else {
    createGameNavigation();
}
