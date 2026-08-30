const PickerUtils = (() => {

    let pickerAudioContext = null;

    async function prepareAudio() {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        if (!pickerAudioContext) {
            pickerAudioContext =
                new AudioContextClass();
        }

        if (
            pickerAudioContext.state ===
            "suspended"
        ) {
            await pickerAudioContext.resume();
        }

        return pickerAudioContext;
    }

    function playTone({
        frequency,
        duration = 0.06,
        volume = 0.04,
        type = "sine"
    }) {
        if (
            !pickerAudioContext ||
            pickerAudioContext.state !==
                "running"
        ) {
            return;
        }

        const oscillator =
            pickerAudioContext.createOscillator();

        const gain =
            pickerAudioContext.createGain();

        const startTime =
            pickerAudioContext.currentTime;

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
            frequency,
            startTime
        );

        gain.gain.setValueAtTime(
            volume,
            startTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + duration
        );

        oscillator.connect(gain);
        gain.connect(
            pickerAudioContext.destination
        );

        oscillator.start(startTime);
        oscillator.stop(
            startTime + duration
        );
    }

    function createShuffledItems(items) {

        const shuffledItems = [...items];

        for (
            let index =
                shuffledItems.length - 1;
            index > 0;
            index--
        ) {
            const randomIndex =
                Math.floor(
                    Math.random() *
                    (index + 1)
                );

            [
                shuffledItems[index],
                shuffledItems[randomIndex]
            ] = [
                shuffledItems[randomIndex],
                shuffledItems[index]
            ];
        }

        return shuffledItems;
    }

    function showSelectedItem({
        modal,
        itemContainer,
        titleElement,
        item,
        displayMode = "image-text"
    }) {
        itemContainer.innerHTML = "";

        if (
            displayMode !== "text" &&
            item.url
        ) {
            const image =
                document.createElement("img");

            image.src = item.url;
            image.alt = item.name || "";

            itemContainer.appendChild(
                image
            );
        }

        if (
            displayMode !== "image"
        ) {
            const itemName =
                document.createElement("p");

            itemName.textContent =
                item.name || "(No name)";

            itemContainer.appendChild(
                itemName
            );
        }

        titleElement.textContent =
            "Selected Item";

        modal.classList.remove("hidden");
    }

    function closeSelectedItem(modal) {
        modal.classList.add("hidden");
    }


async function animateSelection({
    container,
    selectedItemId,
    duration = 1000
}) {
    const availableCards = [
        ...container.querySelectorAll(
            ".picker-item:not(.picked)"
        )
    ];

    const selectedCard =
        container.querySelector(
            `[data-item-id="${selectedItemId}"]`
        );

    if (
        availableCards.length === 0 ||
        !selectedCard
    ) {
        return;
    }

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const wait = milliseconds =>
        new Promise(resolve => {
            setTimeout(
                resolve,
                milliseconds
            );
        });

    if (!reduceMotion) {
        let elapsedTime = 0;
        let delay = 70;
        let previousCard = null;

        while (elapsedTime < duration) {
            if (previousCard) {
                previousCard.classList.remove(
                    "picker-item-active"
                );
            }

            const randomIndex =
                Math.floor(
                    Math.random() *
                    availableCards.length
                );

            previousCard =
                availableCards[randomIndex];

            previousCard.classList.add(
                "picker-item-active"
            );

            playTone({
                frequency:
                    420 + randomIndex * 12,

                duration:
                    0.05,

                volume:
                    0.025
            });

            await wait(delay);

            elapsedTime += delay;
            delay = Math.min(
                delay + 12,
                150
            );
        }

        if (previousCard) {
            previousCard.classList.remove(
                "picker-item-active"
            );
        }
    }

    selectedCard.classList.add(
        "picker-item-selected"
    );

const revealNotes = [
    {
        frequency: 523.25,
        delay: 0
    },
    {
        frequency: 659.25,
        delay: 90
    },
    {
        frequency: 783.99,
        delay: 180
    },
    {
        frequency: 1046.50,
        delay: 280
    }
];

    revealNotes.forEach(note => {
        setTimeout(
            () => {
                playTone({
                    frequency:
                        note.frequency,

                    duration:
                        note.delay === 280
                            ? 0.35
                            : 0.14,

                    volume:
                        0.055,

                    type:
                        "triangle"
                });
            },
            note.delay
        );
    });
    await wait(
        reduceMotion ? 150 : 400
    );

    selectedCard.classList.remove(
        "picker-item-selected"
    );
}

    function renderItems({
        container,
        items,
        pickedItemIds = [],
        displayMode = "image-text"
    }) {
        container.innerHTML = "";

        const colors = [
            "#d9ecff",
            "#ffe3a8",
            "#dff7c7",
            "#ffd8e8",
            "#e6dcff",
            "#cffff4"
        ];

        const pickedIds =
            new Set(
                pickedItemIds.map(String)
            );

        items.forEach((item, index) => {

            const itemCard =
                document.createElement("div");

            itemCard.className =
                "picker-item";

            itemCard.dataset.itemId =
                String(item.id);

            itemCard.style.backgroundColor =
                colors[index % colors.length];

            if (
                pickedIds.has(
                    String(item.id)
                )
            ) {
                itemCard.classList.add(
                    "picked"
                );
            }

            if (
                displayMode !== "text" &&
                item.url
            ) {
                const image =
                    document.createElement("img");

                image.src = item.url;
                image.alt = item.name || "";

                itemCard.appendChild(image);
            }

            if (
                displayMode !== "image" ||
                item.custom
            ) {
                const itemName =
                    document.createElement("span");

                itemName.textContent =
                    item.name || "(No name)";

                itemCard.appendChild(
                    itemName
                );
            }

            container.appendChild(
                itemCard
            );
        });
    }

    return {
            createShuffledItems,
            renderItems,
            animateSelection,
            prepareAudio,
            playTone,
            showSelectedItem,
            closeSelectedItem
        };

})();
