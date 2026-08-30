const categorySelect =
    document.getElementById(
        "categorySelect"
    );

const languageSelect =
    document.getElementById(
        "languageSelect"
    );

const tagsContainer =
    document.getElementById(
        "tagsContainer"
    );

const selectedItemsList =
    document.getElementById(
        "selectedItemsList"
    );

const selectedItemsCount =
    document.getElementById(
        "selectedItemsCount"
    );

const displayModeSelect =
    document.getElementById(
        "displayMode"
    );

const customItemsInput =
    document.getElementById(
        "customItems"
    );

const setupMessage =
    document.getElementById(
        "setupMessage"
    );

const startLotteryBtn =
    document.getElementById(
        "startLotteryBtn"
    );

const resetLotteryBtn =
    document.getElementById(
        "resetLotteryBtn"
    );

const saveLotteryBtn = document.getElementById("saveLotteryBtn");
const savedSetSelect = document.getElementById("savedSetSelect");
const editSavedSetBtn = document.getElementById("editSavedSetBtn");
const shareSavedSetBtn = document.getElementById("shareSavedSetBtn");
const deleteSavedSetBtn = document.getElementById("deleteSavedSetBtn");
const savedSetsLimit = document.getElementById("savedSetsLimit");
const savedSetMessage = document.getElementById("savedSetMessage");

const itemModeInputs =
    document.querySelectorAll(
        'input[name="lotteryItemMode"]'
    );

let availableLibraryItems = [];
let itemSelectionMode = "all";
let savedLotterySets = [];
let freeSavedGameLimit = 10;

const selectedLibraryItemIds =
    new Set();

function renderLibraryItems() {
    selectedItemsList.innerHTML = "";

    const choosingSpecificItems =
        itemSelectionMode ===
            "specific";

    selectedItemsCount.textContent =
        choosingSpecificItems
            ? selectedLibraryItemIds.size
            : availableLibraryItems.length;

    if (
        availableLibraryItems.length ===
        0
    ) {
        selectedItemsList.innerHTML = `
            <p class="item-filter-message">
                No matching library items were found. You can still add your own entries below.
            </p>
        `;

        return;
    }

    availableLibraryItems.forEach(
        item => {
            const card =
                document.createElement(
                    choosingSpecificItems
                        ? "button"
                        : "div"
                );

            card.className =
                "preview-item";

            if (choosingSpecificItems) {
                card.type = "button";

                const itemId =
                    Number(item.id);

                const selected =
                    selectedLibraryItemIds.has(
                        itemId
                    );

                card.classList.toggle(
                    "selected-item",
                    selected
                );

                card.setAttribute(
                    "aria-pressed",
                    String(selected)
                );

                card.addEventListener(
                    "click",
                    () => {
                        if (
                            selectedLibraryItemIds.has(
                                itemId
                            )
                        ) {
                            selectedLibraryItemIds.delete(
                                itemId
                            );
                        } else {
                            selectedLibraryItemIds.add(
                                itemId
                            );
                        }

                        renderLibraryItems();
                    }
                );
            }

            const image =
                document.createElement(
                    "img"
                );

            image.src = item.url;
            image.alt = item.name || "";

            const name =
                document.createElement(
                    "span"
                );

            name.textContent =
                item.name ||
                "(No name)";

            card.appendChild(image);
            card.appendChild(name);
            selectedItemsList.appendChild(
                card
            );
        }
    );
}

function getSelectedTagIds() {
    return Array.from(
        tagsContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        )
    ).map(
        checkbox =>
            Number(checkbox.value)
    );
}

async function updateLibraryItems() {
    const categoryId =
        categorySelect.value;

    const tagIds =
        getSelectedTagIds();

    if (
        categoryId ===
            "browse-by-tag" &&
        tagIds.length === 0
    ) {
        availableLibraryItems = [];
        selectedLibraryItemIds.clear();
        selectedItemsCount.textContent =
            "0";

        selectedItemsList.innerHTML = `
            <p class="item-filter-message">
                Select at least one tag to show items from all categories.
            </p>
        `;

        return;
    }

    availableLibraryItems =
        await dbGetItems(
            categoryId,
            tagIds,
            Number(languageSelect.value)
        );

    selectedLibraryItemIds.clear();
    renderLibraryItems();
}

function parseCustomItems() {
    const entries =
        customItemsInput.value
            .split(/[\n,]+/)
            .map(item => item.trim())
            .filter(Boolean);

    const uniqueEntries = [];
    const seenEntries = new Set();

    entries.forEach(entry => {
        const normalizedEntry =
            entry.toLocaleLowerCase();

        if (
            seenEntries.has(
                normalizedEntry
            )
        ) {
            return;
        }

        seenEntries.add(
            normalizedEntry
        );

        uniqueEntries.push({
            id:
                `custom-${
                    crypto.randomUUID()
                }`,
            name: entry,
            url: null,
            custom: true
        });
    });

    return uniqueEntries;
}

function getChosenLibraryItems() {
    if (
        itemSelectionMode ===
        "all"
    ) {
        return [
            ...availableLibraryItems
        ];
    }

    return availableLibraryItems.filter(
        item =>
            selectedLibraryItemIds.has(
                Number(item.id)
            )
    );
}

function getLotterySetupValues() {
    const libraryItems = getChosenLibraryItems();
    const customItems = parseCustomItems();

    return {
        name: document.getElementById("lotteryTitle").value.trim(),
        languageId: Number(languageSelect.value),
        displayMode: displayModeSelect.value,
        libraryItems,
        customItems,
        items: [...libraryItems, ...customItems]
    };
}

function validateLotterySetup(setup, requireName = false) {
    if (requireName && !setup.name) {
        return "Enter a Grid Lottery name before saving.";
    }

    if (setup.items.length < 2) {
        return "Choose or enter at least two items.";
    }

    if (setup.items.length > 50) {
        window.alert(
            `A Grid Lottery can contain only 50 items. You currently have ${setup.items.length}.`
        );
        return "Reduce the total number of items to 50 or fewer.";
    }

    return "";
}

function startGridLottery() {
    const setup = getLotterySetupValues();
    const validationMessage = validateLotterySetup(setup);

    if (validationMessage) {
        setupMessage.textContent = validationMessage;

        return;
    }

    setupMessage.textContent = "";

    const sessionId =
        crypto.randomUUID();

    const lotteryData = {
        version: 1,
        createdAt:
            new Date().toISOString(),
        title:
            document.getElementById(
                "lotteryTitle"
            ).value.trim() ||
            "Grid Lottery",
        displayMode:
            setup.displayMode,
        items: setup.items
    };

    localStorage.setItem(
        `kcgGridLottery:${sessionId}`,
        JSON.stringify(lotteryData)
    );

    const playUrl =
        new URL(
            "gridlottery-play.html",
            window.location.href
        );

    playUrl.searchParams.set(
        "session",
        sessionId
    );

    window.open(
        playUrl.toString(),
        "_blank",
        "noopener"
    );
}

async function getRegularUser() {
    const { data, error } = await db.auth.getSession();
    const user = data?.session?.user;

    if (error || !user || user.is_anonymous) return null;
    return user;
}

function renderSavedLotterySets() {
    savedSetSelect.innerHTML = '<option value="">Choose a saved set</option>';

    savedLotterySets.forEach(set => {
        const option = document.createElement("option");
        option.value = String(set.id);
        option.textContent = set.name;
        savedSetSelect.appendChild(option);
    });

    savedSetsLimit.textContent = `${savedLotterySets.length} of ${freeSavedGameLimit} saved`;
    editSavedSetBtn.disabled = true;
    shareSavedSetBtn.disabled = true;
    deleteSavedSetBtn.disabled = true;
}

async function loadSavedLotterySets() {
    if (!(await getRegularUser())) {
        savedLotterySets = [];
        renderSavedLotterySets();
        savedSetsLimit.textContent = `Log in to save up to ${freeSavedGameLimit} sets.`;
        return;
    }

    freeSavedGameLimit = await dbGetFreeSavedGameLimit();
    const result = await dbGetMyGridLotterySets();
    savedLotterySets = result.data;
    renderSavedLotterySets();
}

async function saveGridLotterySet() {
    savedSetMessage.textContent = "";

    const requiredFields = [
        document.getElementById("lotteryTitle"),
        categorySelect,
        languageSelect,
        displayModeSelect
    ];

    const firstInvalidField = requiredFields.find(
        field => !field.checkValidity()
    );

    if (firstInvalidField) {
        firstInvalidField.reportValidity();
        return;
    }

    const setup = getLotterySetupValues();
    const validationMessage = validateLotterySetup(setup, true);

    if (validationMessage) {
        savedSetMessage.textContent = validationMessage;
        return;
    }

    if (!(await getRegularUser())) {
        savedSetMessage.textContent = "Log in or create a free account to save Grid Lottery Sets.";
        return;
    }

    saveLotteryBtn.disabled = true;
    saveLotteryBtn.textContent = "Saving...";

    const result = await dbSaveGridLotterySet({
        name: setup.name,
        languageId: setup.languageId,
        displayMode: setup.displayMode,
        itemIds: setup.libraryItems.map(item => Number(item.id)),
        customItems: setup.customItems.map(item => item.name)
    });

    saveLotteryBtn.disabled = false;
    saveLotteryBtn.textContent = "Save Grid Lottery Set";

    if (result.error) {
        savedSetMessage.textContent = result.error.message || "The Grid Lottery Set could not be saved.";
        return;
    }

    savedSetMessage.textContent = "Grid Lottery Set saved successfully.";
    await loadSavedLotterySets();
}

async function loadSelectedLotterySet() {
    const set = savedLotterySets.find(row => String(row.id) === savedSetSelect.value);
    if (!set) return;

    const itemResult = await dbGetGridLotterySetItems(
        set.id,
        Number(set.language_id)
    );
    if (itemResult.error) {
        savedSetMessage.textContent = "The saved items could not be loaded.";
        return;
    }

    document.getElementById("lotteryTitle").value = set.name;
    languageSelect.value = String(set.language_id);
    displayModeSelect.value = set.display_mode;
    customItemsInput.value = (set.custom_items || []).join("\n");
    itemSelectionMode = "specific";
    itemModeInputs.forEach(input => {
        input.checked = input.value === "specific";
    });

    availableLibraryItems = itemResult.data;
    selectedLibraryItemIds.clear();
    itemResult.data.forEach(item => selectedLibraryItemIds.add(Number(item.id)));
    renderLibraryItems();
    savedSetMessage.textContent = `Loaded “${set.name}”.`;
}

async function editSelectedLotterySet() {
    const set = savedLotterySets.find(
        row => String(row.id) === savedSetSelect.value
    );

    if (!set) return;

    const requiredFields = [
        document.getElementById("lotteryTitle"),
        categorySelect,
        languageSelect,
        displayModeSelect
    ];
    const firstInvalidField = requiredFields.find(
        field => !field.checkValidity()
    );

    if (firstInvalidField) {
        firstInvalidField.reportValidity();
        return;
    }

    const setup = getLotterySetupValues();
    const validationMessage = validateLotterySetup(setup, true);

    if (validationMessage) {
        savedSetMessage.textContent = validationMessage;
        return;
    }

    editSavedSetBtn.disabled = true;
    editSavedSetBtn.textContent = "Saving...";

    const result = await dbUpdateGridLotterySet({
        setId: set.id,
        name: setup.name,
        languageId: setup.languageId,
        displayMode: setup.displayMode,
        itemIds: setup.libraryItems.map(item => Number(item.id)),
        customItems: setup.customItems.map(item => item.name)
    });

    editSavedSetBtn.textContent = "Edit";

    if (result.error) {
        editSavedSetBtn.disabled = false;
        savedSetMessage.textContent = result.error.message || "The saved set could not be edited.";
        return;
    }

    savedSetMessage.textContent = "Grid Lottery Set updated successfully.";
    await loadSavedLotterySets();
}

async function shareSelectedLotterySet() {
    const set = savedLotterySets.find(
        row => String(row.id) === savedSetSelect.value
    );

    if (!set) return;

    shareSavedSetBtn.disabled = true;
    shareSavedSetBtn.textContent = "Creating Link...";

    const result = await dbEnableGridLotterySetSharing(set.id);

    shareSavedSetBtn.disabled = false;
    shareSavedSetBtn.textContent = "Create Link";

    if (result.error || !result.data) {
        savedSetMessage.textContent = result.error?.message || "The share link could not be created.";
        return;
    }

    const shareUrl = new URL(window.location.href);
    shareUrl.search = "";
    shareUrl.hash = "";
    shareUrl.searchParams.set("set", result.data);

    try {
        await navigator.clipboard.writeText(shareUrl.toString());
        savedSetMessage.textContent = "Share link copied.";
    } catch (error) {
        window.prompt("Copy this Grid Lottery link:", shareUrl.toString());
        savedSetMessage.textContent = "Share link created.";
    }
}

async function loadSharedLotterySet() {
    const slug = new URLSearchParams(window.location.search).get("set");
    if (!slug) return;

    const result = await dbGetSharedGridLotterySet(slug);

    if (result.error || !result.data) {
        savedSetMessage.textContent = "This shared Grid Lottery Set is unavailable.";
        return;
    }

    const set = result.data;
    document.getElementById("lotteryTitle").value = set.name;
    languageSelect.value = String(set.language_id);
    displayModeSelect.value = set.display_mode;
    customItemsInput.value = (set.custom_items || []).join("\n");
    itemSelectionMode = "specific";
    itemModeInputs.forEach(input => {
        input.checked = input.value === "specific";
    });

    availableLibraryItems = set.items;
    selectedLibraryItemIds.clear();
    set.items.forEach(item => selectedLibraryItemIds.add(Number(item.id)));
    renderLibraryItems();
    savedSetMessage.textContent = `Shared set “${set.name}” loaded.`;
}

async function deleteSelectedLotterySet() {
    const set = savedLotterySets.find(row => String(row.id) === savedSetSelect.value);
    if (!set || !window.confirm(`Delete “${set.name}”?`)) return;

    deleteSavedSetBtn.disabled = true;
    const result = await dbDeleteGridLotterySet(set.id);

    if (result.error) {
        savedSetMessage.textContent = result.error.message || "The saved set could not be deleted.";
        deleteSavedSetBtn.disabled = false;
        return;
    }

    savedSetMessage.textContent = "Grid Lottery Set deleted.";
    await loadSavedLotterySets();
}

function resetGridLottery() {
    document.getElementById(
        "lotteryTitle"
    ).value = "";

    customItemsInput.value = "";
    displayModeSelect.value =
        "image-text";
    itemSelectionMode = "all";

    itemModeInputs.forEach(input => {
        input.checked =
            input.value === "all";
    });

    tagsContainer
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach(checkbox => {
            checkbox.checked = false;
        });

    categorySelect.selectedIndex = 0;
    selectedLibraryItemIds.clear();
    setupMessage.textContent = "";
    updateLibraryItems();
}

categorySelect.addEventListener(
    "change",
    updateLibraryItems
);

languageSelect.addEventListener(
    "change",
    updateLibraryItems
);

itemModeInputs.forEach(input => {
    input.addEventListener(
        "change",
        event => {
            itemSelectionMode =
                event.target.value;

            selectedLibraryItemIds.clear();
            renderLibraryItems();
        }
    );
});

startLotteryBtn.addEventListener(
    "click",
    startGridLottery
);

resetLotteryBtn.addEventListener(
    "click",
    resetGridLottery
);

saveLotteryBtn.addEventListener("click", saveGridLotterySet);
editSavedSetBtn.addEventListener("click", editSelectedLotterySet);
shareSavedSetBtn.addEventListener("click", shareSelectedLotterySet);
deleteSavedSetBtn.addEventListener("click", deleteSelectedLotterySet);
savedSetSelect.addEventListener("change", async () => {
    const hasSelection = Boolean(savedSetSelect.value);
    editSavedSetBtn.disabled = !hasSelection;
    shareSavedSetBtn.disabled = !hasSelection;
    deleteSavedSetBtn.disabled = !hasSelection;

    if (hasSelection) {
        await loadSelectedLotterySet();
    }
});

async function initializeGridLottery() {
    await loadCategories(
        categorySelect
    );

    categorySelect.querySelector(
        'option[value=""]'
    )?.remove();

    categorySelect.innerHTML = `
        <option value="browse-by-tag">
            All Categories (Filter by Tags)
        </option>
    ` + categorySelect.innerHTML;

    await loadTags(
        tagsContainer,
        updateLibraryItems
    );

    await loadLanguages(
        languageSelect
    );

    await updateLibraryItems();
    await loadSavedLotterySets();
    await loadSharedLotterySet();
}

initializeGridLottery();
