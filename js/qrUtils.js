const QrUtils = {

    create({
        qrElement,
        text,
        size = 160
    }) {
        if (
            !qrElement ||
            !text ||
            typeof QRCode === "undefined"
        ) {
            return false;
        }

        qrElement.innerHTML = "";

        new QRCode(
            qrElement,
            {
                text,
                width: size,
                height: size,
                correctLevel:
                    QRCode.CorrectLevel.H
            }
        );

        return true;
    },

    makeExpandable({
        container,
        instructionElement = null
    }) {
        if (!container) {
            return;
        }

        const toggleSize = () => {
            const enlarged =
                container.classList.toggle(
                    "enlarged"
                );

            container.setAttribute(
                "aria-label",
                enlarged
                    ? "Make room QR code smaller"
                    : "Enlarge room QR code"
            );

            if (instructionElement) {
                instructionElement.textContent =
                    enlarged
                        ? "Click QR code to make smaller"
                        : "Click QR code to enlarge";
            }
        };

        container.addEventListener(
            "click",
            toggleSize
        );

        container.addEventListener(
            "keydown",
            event => {
                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }

                event.preventDefault();
                toggleSize();
            }
        );
    }

};