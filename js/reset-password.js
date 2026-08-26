const newPasswordForm =
    document.getElementById(
        "new-password-form"
    );

const newPasswordInput =
    document.getElementById(
        "new-password"
    );

const confirmPasswordInput =
    document.getElementById(
        "confirm-password"
    );

const resetPasswordMessage =
    document.getElementById(
        "reset-password-message"
    );

const passwordToggleButtons =
    document.querySelectorAll(
        ".password-toggle"
    );

function showResetMessage(
    message,
    type
) {
    resetPasswordMessage.textContent =
        message;

    resetPasswordMessage.classList.remove(
        "message-error",
        "message-success"
    );

    resetPasswordMessage.classList.add(
        type === "error"
            ? "message-error"
            : "message-success"
    );
}

passwordToggleButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            () => {
                const passwordInput =
                    document.getElementById(
                        button.dataset.target
                    );

                const isHidden =
                    passwordInput.type ===
                    "password";

                passwordInput.type =
                    isHidden
                        ? "text"
                        : "password";

                button.textContent =
                    isHidden
                        ? "Hide"
                        : "Show";

                button.setAttribute(
                    "aria-label",
                    isHidden
                        ? "Hide password"
                        : "Show password"
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isHidden)
                );
            }
        );
    }
);

newPasswordForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const newPassword =
            newPasswordInput.value;

        const confirmedPassword =
            confirmPasswordInput.value;

        if (
            newPassword !==
            confirmedPassword
        ) {
            showResetMessage(
                "The passwords do not match.",
                "error"
            );

            return;
        }

        if (newPassword.length < 8) {
            showResetMessage(
                "Your password must contain at least 8 characters.",
                "error"
            );

            return;
        }

        showResetMessage(
            "Updating your password...",
            "success"
        );

        const { error } =
            await db.auth.updateUser({
                password:
                    newPassword
            });

        if (error) {
            console.error(
                "Could not update password:",
                error
            );

            const passwordErrorMessage =
                error.message?.includes(
                    "different from the old password"
                )
                    ? "Your new password must be different from your current password."
                    : "Your password could not be updated. Please request a new reset link and try again.";

            showResetMessage(
                passwordErrorMessage,
                "error"
            );

            return;
        }

        newPasswordForm.reset();

        showResetMessage(
            "Your password was updated successfully. Returning to the login page...",
            "success"
        );

        await db.auth.signOut();

        setTimeout(
            () => {
                window.location.assign(
                    "account.html"
                );
            },
            2000
        );
    }
);

async function initializePasswordReset() {
    const { data, error } =
        await db.auth.getSession();

    if (
        error ||
        !data.session?.user
    ) {
        newPasswordForm.hidden = true;

        showResetMessage(
            "This reset link is invalid or has expired. Please request a new password reset link.",
            "error"
        );
    }
}

initializePasswordReset();