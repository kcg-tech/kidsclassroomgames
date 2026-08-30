const lotteryGrid =
    document.getElementById(
        "lotteryGrid"
    );

const lotteryTitle =
    document.getElementById(
        "lotteryTitle"
    );

const pickNextBtn =
    document.getElementById(
        "pickNextBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const remainingCount =
    document.getElementById(
        "remainingCount"
    );

const playMessage =
    document.getElementById(
        "playMessage"
    );

const selectedItemModal =
    document.getElementById(
        "selectedItemModal"
    );

const selectedItemContent =
    document.getElementById(
        "selectedItemContent"
    );

const selectedItemTitle =
    document.getElementById(
        "selectedItemTitle"
    );

const closeSelectedItemBtn =
    document.getElementById(
        "closeSelectedItemBtn"
    );

let lotteryData = null;
let shuffledItems = [];
let pickedItemIds = [];
let selectionInProgress = false;

function calculateGridDimensions(
    itemCount
) {
    const availableWidth =
        Math.max(
            window.innerWidth,
            320
        );

    const availableHeight =
        Math.max(
            window.innerHeight - 150,
            220
        );

    const aspectRatio =
        availableWidth /
        availableHeight;

    const columns =
        Math.max(
            1,
            Math.ceil(
                Math.sqrt(
                    itemCount *
                    aspectRatio
                )
            )
        );

    const rows =
        Math.ceil(
            itemCount /
            columns
        );

    return {
        columns,
        rows
    };
}

function updateGridDimensions() {
    const { columns, rows } =
        calculateGridDimensions(
            shuffledItems.length
        );

    lotteryGrid.style.setProperty(
        "--grid-columns",
        columns
    );

    lotteryGrid.style.setProperty(
        "--grid-rows",
        rows
    );

    requestAnimationFrame(
        fitRevealedItemText
    );
}

function fitRevealedItemText() {
    lotteryGrid
        .querySelectorAll(
            ".picker-item.picked"
        )
        .forEach(card => {
            const text =
                card.querySelector(
                    "span"
                );

            if (!text) {
                return;
            }

            const item =
                shuffledItems.find(
                    candidate =>
                        String(
                            candidate.id
                        ) ===
                        card.dataset.itemId
                );

            const imageIsVisible =
                Boolean(
                    item?.url &&
                    lotteryData.displayMode !==
                        "text"
                );

            const availableWidth =
                card.clientWidth * 0.9;

            const availableHeight =
                card.clientHeight *
                (
                    imageIsVisible
                        ? 0.27
                        : 0.76
                );

            let fontSize =
                Math.min(
                    card.clientWidth *
                        (
                            imageIsVisible
                                ? 0.14
                                : 0.24
                        ),
                    card.clientHeight *
                        (
                            imageIsVisible
                                ? 0.16
                                : 0.3
                        ),
                    120
                );

            fontSize = Math.max(
                fontSize,
                10
            );

            text.style.width =
                `${availableWidth}px`;

            text.style.maxHeight =
                `${availableHeight}px`;

            text.style.fontSize =
                `${fontSize}px`;

            while (
                fontSize > 10 &&
                (
                    text.scrollWidth >
                        availableWidth + 1 ||
                    text.scrollHeight >
                        availableHeight + 1
                )
            ) {
                fontSize -= 1;

                text.style.fontSize =
                    `${fontSize}px`;
            }
        });
}

function updateRemainingCount() {
    const remaining =
        shuffledItems.length -
        pickedItemIds.length;

    remainingCount.textContent =
        `${remaining} ${
            remaining === 1
                ? "item"
                : "items"
        } remaining`;

    pickNextBtn.disabled =
        remaining === 0 ||
        selectionInProgress;

    resetBtn.classList.toggle(
        "play-again",
        remaining === 0
    );

    if (remaining === 0) {
        pickNextBtn.textContent =
            "All Items Revealed";
        resetBtn.textContent =
            "Play Again";
    } else {
        pickNextBtn.textContent =
            "Pick Next";
        resetBtn.textContent =
            "Reset";
    }
}

function renderGrid() {
    PickerUtils.renderItems({
        container: lotteryGrid,
        items: shuffledItems,
        pickedItemIds,
        displayMode:
            lotteryData.displayMode
    });

    updateGridDimensions();
    updateRemainingCount();

    requestAnimationFrame(
        fitRevealedItemText
    );
}

function showSelectedItem(
    item
) {
    selectedItemContent.innerHTML = "";

    if (
        item.url &&
        lotteryData.displayMode !==
            "text"
    ) {
        const image =
            document.createElement(
                "img"
            );

        image.src = item.url;
        image.alt = item.name || "";
        selectedItemContent.appendChild(
            image
        );
    }

    if (
        item.custom ||
        lotteryData.displayMode !==
            "image"
    ) {
        const name =
            document.createElement(
                "p"
            );

        name.textContent =
            item.name || "(No name)";

        selectedItemContent.appendChild(
            name
        );
    }

    selectedItemTitle.textContent =
        "Selected Item";

    selectedItemModal.classList.remove(
        "hidden"
    );
}

function closeSelectedItem() {
    selectedItemModal.classList.add(
        "hidden"
    );
}

async function pickNextItem() {
    if (selectionInProgress) {
        return;
    }

    const remainingItems =
        shuffledItems.filter(
            item =>
                !pickedItemIds.includes(
                    String(item.id)
                )
        );

    if (remainingItems.length === 0) {
        updateRemainingCount();
        return;
    }

    selectionInProgress = true;
    updateRemainingCount();

    try {
        await PickerUtils.prepareAudio();

        const selectedItem =
            remainingItems[
                Math.floor(
                    Math.random() *
                    remainingItems.length
                )
            ];

        await PickerUtils.animateSelection({
            container: lotteryGrid,
            selectedItemId:
                selectedItem.id,
            duration: 1050
        });

        pickedItemIds.push(
            String(selectedItem.id)
        );

        renderGrid();
        showSelectedItem(
            selectedItem
        );
    } finally {
        selectionInProgress = false;
        updateRemainingCount();
    }
}

function resetLottery() {
    pickedItemIds = [];
    shuffledItems =
        PickerUtils.createShuffledItems(
            lotteryData.items
        );

    playMessage.textContent = "";
    closeSelectedItem();
    renderGrid();
}

function loadLottery() {
    const sessionId =
        new URLSearchParams(
            window.location.search
        ).get("session");

    if (!sessionId) {
        playMessage.textContent =
            "This Grid Lottery could not be loaded.";
        pickNextBtn.disabled = true;
        return;
    }

    const storedLottery =
        localStorage.getItem(
            `kcgGridLottery:${sessionId}`
        );

    if (!storedLottery) {
        playMessage.textContent =
            "This Grid Lottery is no longer available. Return to the setup page and start it again.";
        pickNextBtn.disabled = true;
        return;
    }

    try {
        lotteryData =
            JSON.parse(
                storedLottery
            );
    } catch (error) {
        console.error(
            "Could not read Grid Lottery:",
            error
        );

        playMessage.textContent =
            "This Grid Lottery could not be loaded.";
        pickNextBtn.disabled = true;
        return;
    }

    if (
        !Array.isArray(
            lotteryData.items
        ) ||
        lotteryData.items.length < 2
    ) {
        playMessage.textContent =
            "This Grid Lottery does not contain enough items.";
        pickNextBtn.disabled = true;
        return;
    }

    lotteryTitle.textContent =
        lotteryData.title ||
        "Grid Lottery";

    document.title =
        `${lotteryTitle.textContent} | Kids Classroom Games`;

    resetLottery();
}

pickNextBtn.addEventListener(
    "click",
    pickNextItem
);

resetBtn.addEventListener(
    "click",
    resetLottery
);

closeSelectedItemBtn.addEventListener(
    "click",
    closeSelectedItem
);

selectedItemModal.addEventListener(
    "click",
    closeSelectedItem
);

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            closeSelectedItem();
        }

        if (
            event.key === "Enter" &&
            selectedItemModal.classList.contains(
                "hidden"
            )
        ) {
            pickNextItem();
        }
    }
);

window.addEventListener(
    "resize",
    updateGridDimensions
);

loadLottery();
