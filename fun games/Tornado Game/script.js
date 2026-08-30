const board = 
    document.getElementById('board');

const presetSelect =
    document.getElementById(
        "preset"
    );

const userInputs = 
    document.getElementById('user-inputs');

const createBtn = 
    document.getElementById('create-btn');

const submitBtn = 
    document.getElementById('submit');

const startGameBtn = 
    document.getElementById("start-btn");

const columnContainer = 
    document.getElementById(
        "column-container"
    );

const modal = 
    document.getElementById("question-modal");

const modalContent =
    document.getElementById(
        'question-content'
    );

const questionTimer =
    document.getElementById(
        "question-timer"
    );

const imagePickerModal =
    document.getElementById(
        "image-picker-modal"
    );

const imagePickerGrid =
    document.getElementById(
        "image-picker-grid"
    );

const closeImagePickerBtn =
    document.getElementById(
        "close-image-picker"
    );

const imagePickerSearch =
    document.getElementById(
        "image-picker-search"
    );

const imagePickerCategory =
    document.getElementById(
        "image-picker-category"
    );

const imagePickerTags =
    document.getElementById(
        "image-picker-tags"
    );

const shuffleRewardsBtn =
    document.getElementById(
        "shuffle-rewards-btn"
    );

const boardTitleInput =
    document.getElementById(
        "board-title"
    );

const saveBoardMessage =
    document.getElementById(
        "save-board-message"
    );

const loginSaveMessage =
    document.getElementById(
        "login-save-message"
    );

const saveLimitMessage =
    document.getElementById(
        "save-limit-message"
    );

const boardNameFields =
    document.getElementById(
        "board-name-fields"
    );

const playAgainControls =
    document.getElementById(
        "play-again-controls"
    );

const playAgainBtn =
    document.getElementById(
        "play-again-btn"
    );

const playAgainShuffleBtn =
    document.getElementById(
        "play-again-shuffle-btn"
    );

const shareBoardControls =
    document.getElementById(
        "share-board-controls"
    );

const shareBoardBtn =
    document.getElementById(
        "share-board-btn"
    );

const shareLinkContainer =
    document.getElementById(
        "share-link-container"
    );

const shareLinkInput =
    document.getElementById(
        "share-link"
    );

const copyShareLinkBtn =
    document.getElementById(
        "copy-share-link-btn"
    );

const shareBoardMessage =
    document.getElementById(
        "share-board-message"
    );

const editBoardBtn =
    document.getElementById(
        "edit-board-btn"
    );

const deleteBoardBtn =
    document.getElementById(
        "delete-board-btn"
    );

const startGameMessage =
    document.getElementById(
        "start-game-message"
    );

let currentUserId = null;
let customBoardReady = false;
let editingBoardId = null;
let boardSaveInProgress = false;
let boardOptionsLoadRequest = 0;
let preferredBoardId = null;

let currentQuestion = null;
let showingAnswer = null;
let currentquizCell = null;
let showingReward = false;
let activeImageTargetId = null;
let questionTimerId = null;
let questionTimeRemaining = 30;

let availableBoards = [];
let imageLibraryItems = [];
let imageLibraryCategories = [];
let imageLibraryTags = [];
let activeBoardData = [];
let freeSavedGameLimit = 10;



const rewardList = [
    {
        type: "score-100",
        text: "+100"
    },
    {
        type: "score-200",
        text: "+200"
    },
    {
        type: "tornado",
        text: "TORNADO",
        img:
            "../../images/tornado-game/tornado.png"
    },
    {
        type: "double",
        text: "DOUBLE",
        img:
            "../../images/tornado-game/doublepoints.png"
    },
    {
        type: "switch",
        text: "SWITCH",
        img:
            "../../images/tornado-game/switch.jpg"
    }
];

const defaultRewardTypes = [
    ...Array(8).fill("score-100"),
    ...Array(8).fill("score-200"),
    ...Array(3).fill("tornado"),
    ...Array(3).fill("double"),
    ...Array(3).fill("switch")
];

function shuffleArray(items) {
    const shuffled =
        [...items];

    for (
        let index = shuffled.length - 1;
        index > 0;
        index--
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            shuffled[index],
            shuffled[randomIndex]
        ] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}

// USER DATA INPUT
const userDataInput = [];

async function loadImageLibrary() {
    if (imageLibraryItems.length > 0) {
        return;
    }

    const results =
        await Promise.all([
            dbGetImageLibraryItems(),
            dbGetCategories(),
            dbGetTags()
        ]);

    imageLibraryItems =
        results[0];

    imageLibraryCategories =
        results[1];

    imageLibraryTags =
        results[2];

    populateImageCategories();
}

function populateImageCategories() {
    imagePickerCategory.innerHTML = "";

    const placeholder =
        document.createElement(
            "option"
        );

    placeholder.value = "";

    placeholder.textContent =
        "Choose a Category";

    imagePickerCategory.appendChild(
        placeholder
    );

    const browseByTagOption =
        document.createElement(
            "option"
        );

    browseByTagOption.value =
        "browse-by-tag";

    browseByTagOption.textContent =
        "Browse by Tag (All Categories)";

    imagePickerCategory.appendChild(
        browseByTagOption
    );

    imageLibraryCategories.forEach(
        category => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            imagePickerCategory.appendChild(
                option
            );
        }
    );
}

function populateImageTags() {
    imagePickerTags.innerHTML = "";

    const categoryId =
        imagePickerCategory.value;

    if (!categoryId) {
        return;
    }

    const availableTagIds =
        new Set();

    imageLibraryItems
        .filter(
            item =>
                categoryId ===
                    "browse-by-tag" ||
                String(
                    item.categoryId
                ) === categoryId
        )
        .forEach(item => {
            item.tagIds.forEach(
                tagId => {
                    availableTagIds.add(
                        String(tagId)
                    );
                }
            );
        });

    imageLibraryTags
        .filter(
            tag =>
                availableTagIds.has(
                    String(tag.id)
                )
        )
        .forEach(tag => {
            const label =
                document.createElement(
                    "label"
                );

            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";

            checkbox.value =
                tag.id;

            label.appendChild(
                checkbox
            );

            label.append(
                ` ${tag.name}`
            );

            imagePickerTags.appendChild(
                label
            );
        });
}

function renderImagePicker() {
    imagePickerGrid.innerHTML = "";

    const categoryId =
        imagePickerCategory.value;

    if (!categoryId) {
        imagePickerGrid.textContent =
            "Choose a category to view images.";

        return;
    }

    const searchText =
        imagePickerSearch.value
            .trim()
            .toLowerCase();

    const selectedTagIds =
        Array.from(
            imagePickerTags.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        )
        .map(
            checkbox =>
                checkbox.value
        );

    const browsingByTag =
        categoryId ===
            "browse-by-tag";

    if (
        browsingByTag &&
        selectedTagIds.length === 0
    ) {
        imagePickerGrid.textContent =
            "Select at least one tag to view images from all categories.";

        return;
    }

    const filteredItems =
        imageLibraryItems.filter(
            item => {
                const categoryMatches =
                    browsingByTag ||
                    String(
                        item.categoryId
                    ) === categoryId;

                const searchMatches =
                    item.name
                        .toLowerCase()
                        .includes(
                            searchText
                        );

                const tagsMatch =
                    selectedTagIds.every(
                        tagId =>
                            item.tagIds.some(
                                itemTagId =>
                                    String(
                                        itemTagId
                                    ) === tagId
                            )
                    );

                return (
                    categoryMatches &&
                    searchMatches &&
                    tagsMatch
                );
            }
        );

    if (filteredItems.length === 0) {
        imagePickerGrid.textContent =
            "No matching images found.";

        return;
    }

    filteredItems.forEach(item => {
        const itemButton =
            document.createElement(
                "button"
            );

        itemButton.type = "button";

        itemButton.className =
            "image-picker-item";

        itemButton.dataset.itemId =
            item.id;

        const image =
            document.createElement(
                "img"
            );

        image.src =
            item.imageUrl;

        image.alt =
            item.name;

        image.loading =
            "lazy";

        const name =
            document.createElement(
                "span"
            );

        name.textContent =
            item.name;

        itemButton.appendChild(
            image
        );

        itemButton.appendChild(
            name
        );

        imagePickerGrid.appendChild(
            itemButton
        );
    });
}

createBtn.addEventListener(
    "click",
    () => {
        userInputs.classList.toggle(
            "hidden"
        );

        if (
            userInputs.classList.contains(
                "hidden"
            )
        ) {
            createBtn.textContent =
                "Create Board";

            return;
        }

        createBtn.textContent =
            "Close Editor";

        editingBoardId = null;
        boardTitleInput.value = "";
        saveBoardMessage.textContent = "";

        submitBtn.textContent =
            currentUserId
                ? "Save & Use Board"
                : "Use Board";

        createColumns();
    }
);

imagePickerCategory.addEventListener(
    "change", () => {
        populateImageTags();
        renderImagePicker();
    }
    
);

imagePickerSearch.addEventListener(
    "input",
    renderImagePicker
);

imagePickerTags.addEventListener(
    "change",
    renderImagePicker
);

imagePickerGrid.addEventListener(
    "click",
    event => {
        const itemButton =
            event.target.closest(
                ".image-picker-item"
            );

        if (
            !itemButton ||
            !activeImageTargetId
        ) {
            return;
        }

        const selectedItem =
            imageLibraryItems.find(
                item =>
                    String(item.id) ===
                    itemButton.dataset.itemId
            );

        if (!selectedItem) {
            return;
        }

        const valueInput =
            document.getElementById(
                activeImageTargetId
            );

        const container =
            valueInput.closest(
                ".selected-image-field"
            );

        const selectedName =
            container.querySelector(
                ".selected-image-name"
            );

        const chooseButton =
            container.querySelector(
                ".choose-image-btn"
            );

        const removeButton =
            container.querySelector(
                ".remove-image-btn"
            );

        valueInput.value =
            selectedItem.id;

        valueInput.dataset.imageUrl =
            selectedItem.imageUrl;

        selectedName.textContent =
            `Selected: ${selectedItem.name}`;

        selectedName.classList.remove(
            "hidden"
        );

        chooseButton.classList.add(
            "hidden"
        );

        removeButton.classList.remove(
            "hidden"
        );

        imagePickerModal.classList.add(
            "hidden"
        );

        activeImageTargetId = null;
    }
);

columnContainer.addEventListener(
    "click",
    async event => {
        const chooseButton =
            event.target.closest(
                ".choose-image-btn"
            );

        if (!chooseButton) {
            return;
        }

        activeImageTargetId =
            chooseButton.dataset.targetId;

        imagePickerModal.classList.remove(
            "hidden"
        );

        imagePickerGrid.textContent =
            "Loading images...";

        await loadImageLibrary();

        imagePickerCategory.value = "";
      
        imagePickerSearch.value = "";
        imagePickerTags.innerHTML = "";

        imagePickerGrid.textContent =
            "Choose a category to view images.";

    }
);
// removes selected item
columnContainer.addEventListener(
    "click",
    event => {
        const removeButton =
            event.target.closest(
                ".remove-image-btn"
            );

        if (!removeButton) {
            return;
        }

        const container =
            removeButton.closest(
                ".selected-image-field"
            );

        const valueInput =
            container.querySelector(
                'input[type="hidden"]'
            );

        const selectedName =
            container.querySelector(
                ".selected-image-name"
            );

        const chooseButton =
            container.querySelector(
                ".choose-image-btn"
            );

        valueInput.value = "";
        valueInput.dataset.imageUrl = "";

        selectedName.textContent = "";

        selectedName.classList.add(
            "hidden"
        );

        removeButton.classList.add(
            "hidden"
        );

        chooseButton.classList.remove(
            "hidden"
        );
    }
);

closeImagePickerBtn.addEventListener(
    "click",
    () => {
        imagePickerModal.classList.add(
            "hidden"
        );

        activeImageTargetId = null;
       
    }
);

function createImageField(
    targetId,
    buttonText
) {
    const container =
        document.createElement("div");

    container.className =
        "selected-image-field";

    const valueInput =
        document.createElement("input");

    valueInput.type = "hidden";
    valueInput.id = targetId;
    valueInput.dataset.imageUrl = "";

    const chooseButton =
        document.createElement("button");

    chooseButton.type = "button";
    chooseButton.className =
        "choose-image-btn";

    chooseButton.dataset.targetId =
        targetId;

    chooseButton.textContent =
        buttonText;

    const selectedName =
        document.createElement("span");

    selectedName.className =
        "selected-image-name hidden";

    const removeButton =
        document.createElement("button");

    removeButton.type = "button";
    removeButton.className =
        "remove-image-btn hidden";

    removeButton.textContent =
        "Remove Image";

    container.appendChild(
        valueInput
    );

    container.appendChild(
        chooseButton
    );

    container.appendChild(
        selectedName
    );

    container.appendChild(
        removeButton
    );

    return container;
}

function fillSelectedImageField(
    targetId,
    itemId,
    imageUrl
) {
    if (!itemId) {
        return;
    }

    const valueInput =
        document.getElementById(
            targetId
        );

    if (!valueInput) {
        return;
    }

    const container =
        valueInput.closest(
            ".selected-image-field"
        );

    const selectedName =
        container.querySelector(
            ".selected-image-name"
        );

    const chooseButton =
        container.querySelector(
            ".choose-image-btn"
        );

    const removeButton =
        container.querySelector(
            ".remove-image-btn"
        );

    const libraryItem =
        imageLibraryItems.find(
            item =>
                item.id === itemId
        );

    valueInput.value = itemId;

    valueInput.dataset.imageUrl =
        imageUrl || "";

    selectedName.textContent =
        `Selected: ${
            libraryItem
                ? libraryItem.name
                : `Item ${itemId}`
        }`;

    selectedName.classList.remove(
        "hidden"
    );

    chooseButton.classList.add(
        "hidden"
    );

    removeButton.classList.remove(
        "hidden"
    );
}

function createColumns() {
    columnContainer.innerHTML = "";

    const shuffledRewards =
        shuffleArray(
            defaultRewardTypes
        );

    for (
        let position = 1;
        position <= 25;
        position++
    ) {
        const questionEditor =
            document.createElement("section");

        questionEditor.className =
            "question-editor";

        const heading =
            document.createElement("h3");

        heading.textContent =
            `Question ${position}`;

        questionEditor.appendChild(
            heading
        );

        const questionLabel =
            document.createElement("label");

        questionLabel.htmlFor =
            `question-${position}`;

        questionLabel.textContent =
            "Question";

        const questionInput =
            document.createElement("textarea");

        questionInput.id =
            `question-${position}`;

        questionInput.rows = 2;
        questionInput.required = true;

        questionEditor.appendChild(
            questionLabel
        );

        questionEditor.appendChild(
            questionInput
        );

        questionEditor.appendChild(
            createImageField(
                `question-${position}-item`,
                "Choose Question Image"
            )
        );

        const answerLabel =
            document.createElement("label");

        answerLabel.htmlFor =
            `answer-${position}`;

        answerLabel.textContent =
            "Answer";

        const answerInput =
            document.createElement("textarea");

        answerInput.id =
            `answer-${position}`;

        answerInput.rows = 2;
        answerInput.required = true;

        questionEditor.appendChild(
            answerLabel
        );

        questionEditor.appendChild(
            answerInput
        );

        questionEditor.appendChild(
            createImageField(
                `answer-${position}-item`,
                "Choose Answer Image"
            )
        );        

        const rewardLabel =
            document.createElement("label");

        rewardLabel.htmlFor =
            `reward-${position}`;

        rewardLabel.textContent =
            "Reward";

        const rewardSelect =
            document.createElement("select");

        rewardSelect.id =
            `reward-${position}`;

        rewardList.forEach(reward => {
            const option =
                document.createElement(
                    "option"
                );

            option.value =
                reward.type;

            option.textContent =
                reward.text;

            option.selected =
                reward.type ===
                shuffledRewards[
                    position - 1
                ];

            rewardSelect.appendChild(
                option
            );
        });

        questionEditor.appendChild(
            rewardLabel
        );

        questionEditor.appendChild(
            rewardSelect
        );

        columnContainer.appendChild(
            questionEditor
        );
    }
}

shuffleRewardsBtn.addEventListener(
    "click",
    () => {
        const rewardSelects =
            Array.from(
                columnContainer.querySelectorAll(
                    'select[id^="reward-"]'
                )
            );

        if (rewardSelects.length === 0) {
            return;
        }

        const currentRewards =
            rewardSelects.map(
                select =>
                    select.value
            );

        const shuffledRewards =
            shuffleArray(
                currentRewards
            );

        rewardSelects.forEach(
            (
                select,
                index
            ) => {
                select.value =
                    shuffledRewards[
                        index
                    ];
            }
        );
    }
);

async function getUserInput(event) {
    event.preventDefault();

    if (!userInputs.reportValidity()) {
        return;
    }

    userDataInput.length = 0;

    for (
        let position = 1;
        position <= 25;
        position++
    ) {
        const questionInput =
            document.getElementById(
                `question-${position}`
            );

        const answerInput =
            document.getElementById(
                `answer-${position}`
            );

        const rewardSelect =
            document.getElementById(
                `reward-${position}`
            );

        const questionImageInput =
            document.getElementById(
                `question-${position}-item`
            );

        const answerImageInput =
            document.getElementById(
                `answer-${position}-item`
            );

        const reward =
            rewardList.find(
                item =>
                    item.type ===
                    rewardSelect.value
            );

        userDataInput.push({
            position: position,

            question:
                questionInput.value.trim(),

            questionItemId:
                questionImageInput.value
                    ? Number(
                        questionImageInput.value
                    )
                    : null,

            questionImg:
                questionImageInput
                    .dataset.imageUrl ||
                null,

            answer:
                answerInput.value.trim(),

            answerItemId:
                answerImageInput.value
                    ? Number(
                        answerImageInput.value
                    )
                    : null,

            answerImg:
                answerImageInput
                    .dataset.imageUrl ||
                null,

            rewardType:
                rewardSelect.value,

            reward: reward,

            used: false
        });
    }

    const uniqueRewardTypes =
        new Set(
            userDataInput.map(
                question =>
                    question.rewardType
            )
        );

    if (uniqueRewardTypes.size === 1) {
        const continueWithSameRewards =
            confirm(
                "All 25 questions have the same reward. Do you want to continue?"
            );

        if (!continueWithSameRewards) {
            return;
        }
    }

    localStorage.setItem(
        "tornadoGameBoard",
        JSON.stringify(
            userDataInput
        )
    );

    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check login:",
            error
        );

        saveBoardMessage.textContent =
            "The board could not be prepared.";

        return;
    }

    const session =
        data.session;

    if (
        !session ||
        session.user?.is_anonymous) {

        presetSelect.value = "select";
        updateBoardManagementControls();        

        customBoardReady = true;
        updateStartButton();

        saveBoardMessage.textContent =
            "Your temporary board is ready. Click Start Game to play.";

        alert(
            "Your temporary board is ready. Click Start Game to play."
        );

        return;
    }
    
    const boardName =
    boardTitleInput.value.trim();

    if (!boardName) {
        boardTitleInput.focus();
        return;
    }

    const duplicateBoard =
        availableBoards.some(
            board =>
                !board.is_preset &&
                board.owner_id ===
                    session.user.id &&
                board.id !==
                    editingBoardId &&
                board.name.toLowerCase() ===
                    boardName.toLowerCase()
        );

if (duplicateBoard) {
    alert(
        "You already have a board with this name. Please enter a different name."
    );

    saveBoardMessage.textContent =
        "You already have a board with this name.";

    boardTitleInput.focus();
    return;
}

submitBtn.disabled = true;
submitBtn.textContent =
    "Saving...";

    boardSaveInProgress = true;

    try {
        let savedBoardId;
        let completionAlertMessage;

        if (editingBoardId) {
            const updated =
                await dbUpdateTornadoBoard(
                    editingBoardId,
                    session.user.id,
                    boardName,
                    userDataInput
                );

            if (!updated) {
                saveBoardMessage.textContent =
                    "The board could not be updated.";

                return;
            }

            savedBoardId =
                editingBoardId;

            saveBoardMessage.textContent =
                `"${boardName}" was updated successfully.`;

            completionAlertMessage =
                "Your changes were saved. The previous share link is no longer valid. Click Start Game to play.";

            editingBoardId = null;
        } else {
            const result =
                await dbSaveTornadoBoard(
                    session.user.id,
                    boardName,
                    userDataInput
                );

            if (result.error) {
                const reachedFreeLimit =
                    result.error.message?.includes(
                        "Free accounts can save up to"
                    );

                const limitMessage =
                    `You have reached the free limit of ${freeSavedGameLimit} Tornado boards. Delete one or upgrade to Premium.`;

                saveBoardMessage.textContent =
                    reachedFreeLimit
                        ? limitMessage
                        : "The board could not be saved.";

                if (reachedFreeLimit) {
                    alert(limitMessage);
                }

                return;
            }

            savedBoardId =
                result.board.id;

            saveBoardMessage.textContent =
                `"${boardName}" was saved successfully.`;

            completionAlertMessage =
                "Your Tornado board has been saved. Click Start Game to play.";
        }

        preferredBoardId =
            String(savedBoardId);

        userInputs.classList.add(
            "hidden"
        );

        createBtn.textContent =
            "Create Board";

        await loadBoardOptions();

        presetSelect.value =
            preferredBoardId;

        customBoardReady = false;

        updateStartButton();
        updateBoardManagementControls();

        startGameBtn.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        alert(
            completionAlertMessage
        );
    } catch (error) {
        console.error(
            "Save Tornado board error:",
            error
        );

        saveBoardMessage.textContent =
            "The board could not be saved.";
    } finally {
        boardSaveInProgress = false;
        submitBtn.disabled = false;
        submitBtn.textContent =
            "Save & Use Board";
    }
}
// GET USER DATA
submitBtn.addEventListener("click", getUserInput);

//BUILD BOARD
startGameBtn.addEventListener(
    "click",
    () => {
        const selectedBoardId =
            presetSelect.value;

        const selectedTeamCount =
            document.getElementById(
                "team-count"
            ).value;

        const playUrl =
            new URL(
                window.location.href
            );

        playUrl.searchParams.set(
            "mode",
            "play"
        );

        playUrl.searchParams.set(
            "board",
            selectedBoardId
        );

        playUrl.searchParams.set(
            "teams",
            selectedTeamCount
        );

        startGameMessage.innerHTML = "";

        const gameWindow =
            window.open(
                playUrl.toString(),
                "_blank"
            );

        if (!gameWindow) {
            startGameMessage.textContent =
                "The new tab was blocked. ";

            const fallbackLink =
                document.createElement("a");

            fallbackLink.href =
                playUrl.toString();

            fallbackLink.textContent =
                "Open the game here instead.";

            startGameMessage.appendChild(
                fallbackLink
            );
        }
    }
);

function createSharedBoardUrl(shareSlug) {
    const shareUrl =
        createShareablePageUrl();

    shareUrl.search = "";

    shareUrl.searchParams.set(
        "mode",
        "play"
    );

    shareUrl.searchParams.set(
        "share",
        shareSlug
    );

    return shareUrl.toString();
}

function updateBoardManagementControls() {
    const selectedBoard =
        availableBoards.find(
            board =>
                String(board.id) ===
                presetSelect.value
        );

    const userOwnsBoard =
        Boolean(
            selectedBoard &&
            currentUserId &&
            !selectedBoard.is_preset &&
            selectedBoard.owner_id ===
                currentUserId
        );

    shareBoardControls.classList.toggle(
        "hidden",
        !userOwnsBoard
    );

    shareBoardMessage.textContent = "";

    if (!userOwnsBoard) {
        shareLinkInput.value = "";

        shareLinkContainer.classList.add(
            "hidden"
        );

        shareBoardBtn.classList.remove(
            "hidden"
        );

        return;
    }

    if (selectedBoard.slug) {
        shareLinkInput.value =
            createSharedBoardUrl(
                selectedBoard.slug
            );

        shareLinkContainer.classList.remove(
            "hidden"
        );

        shareBoardBtn.classList.add(
            "hidden"
        );
    } else {
        shareLinkInput.value = "";

        shareLinkContainer.classList.add(
            "hidden"
        );

        shareBoardBtn.classList.remove(
            "hidden"
        );
    }
}

shareBoardBtn.addEventListener(
    "click",
    async () => {
        const selectedBoard =
            availableBoards.find(
                board =>
                    String(board.id) ===
                    presetSelect.value
            );

        if (
            !selectedBoard ||
            selectedBoard.is_preset ||
            selectedBoard.owner_id !==
                currentUserId
        ) {
            return;
        }

        shareBoardBtn.disabled = true;
        shareBoardBtn.textContent =
            "Creating Link...";

        const shareSlug =
            selectedBoard.slug ||
            crypto.randomUUID();

        const sharedBoard =
            await dbEnableTornadoSharing(
                selectedBoard.id,
                currentUserId,
                shareSlug
            );

        shareBoardBtn.disabled = false;
        shareBoardBtn.textContent =
            "Create Share Link";

        if (!sharedBoard) {
            shareBoardMessage.textContent =
                "The share link could not be created.";

            return;
        }

        selectedBoard.slug =
            sharedBoard.slug;

        selectedBoard.is_public = true;

        shareLinkInput.value =
            createSharedBoardUrl(
                sharedBoard.slug
            );

        shareLinkContainer.classList.remove(
            "hidden"
        );

        shareBoardBtn.classList.add(
            "hidden"
        );

        shareBoardMessage.textContent =
            "Share link created.";
    }
);

copyShareLinkBtn.addEventListener(
    "click",
    async () => {
        try {
            await navigator.clipboard.writeText(
                shareLinkInput.value
            );

            shareBoardMessage.textContent =
                "Link copied.";
            alert("Share link copied.");

        } catch (error) {
            console.error(
                "Could not copy link:",
                error
            );

            shareLinkInput.select();

            shareBoardMessage.textContent =
                "Copy the selected link manually.";
        }
    }
);

editBoardBtn.addEventListener(
    "click",
    async () => {
        const selectedBoard =
            availableBoards.find(
                board =>
                    String(board.id) ===
                    presetSelect.value
            );

        if (
            !selectedBoard ||
            selectedBoard.is_preset ||
            selectedBoard.owner_id !==
                currentUserId
        ) {
            return;
        }

        editBoardBtn.disabled = true;
        editBoardBtn.textContent =
            "Loading...";

        if (
            imageLibraryItems.length === 0
        ) {
            const results =
                await Promise.all([
                    dbGetImageLibraryItems(),
                    dbGetCategories(),
                    dbGetTags()
                ]);

            imageLibraryItems =
                results[0];

            imageLibraryCategories =
                results[1];

            imageLibraryTags =
                results[2];

            populateImageCategories();
        }

        const savedBoard =
            await dbGetTornadoBoard(
                selectedBoard.id
            );

        editBoardBtn.disabled = false;
        editBoardBtn.textContent =
            "Edit Board";

        if (!savedBoard) {
            shareBoardMessage.textContent =
                "The board could not be loaded for editing.";

            return;
        }

        userInputs.classList.remove(
            "hidden"
        );

        createBtn.textContent =
            "Close Editor";

        createColumns();

        boardTitleInput.value =
            savedBoard.name;

        savedBoard.questions.forEach(
            question => {
                const position =
                    question.position;

                document.getElementById(
                    `question-${position}`
                ).value =
                    question.question;

                document.getElementById(
                    `answer-${position}`
                ).value =
                    question.answer;

                document.getElementById(
                    `reward-${position}`
                ).value =
                    question.rewardType;

                fillSelectedImageField(
                    `question-${position}-item`,
                    question.questionItemId,
                    question.questionImg
                );

                fillSelectedImageField(
                    `answer-${position}-item`,
                    question.answerItemId,
                    question.answerImg
                );
            }
        );

        editingBoardId =
            selectedBoard.id;

        submitBtn.textContent =
            "Save Changes & Use Board";

        userInputs.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);

deleteBoardBtn.addEventListener(
    "click",
    async () => {
        const selectedBoard =
            availableBoards.find(
                board =>
                    String(board.id) ===
                    presetSelect.value
            );

        if (
            !selectedBoard ||
            selectedBoard.is_preset ||
            selectedBoard.owner_id !==
                currentUserId
        ) {
            return;
        }

        const confirmed =
            confirm(
                `Permanently delete "${selectedBoard.name}"? This cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        deleteBoardBtn.disabled = true;
        deleteBoardBtn.textContent =
            "Deleting...";

        const deleted =
            await dbDeleteTornadoBoard(
                selectedBoard.id,
                currentUserId
            );

        deleteBoardBtn.disabled = false;
        deleteBoardBtn.textContent =
            "Delete Board";

        if (!deleted) {
            alert(
                "The board could not be deleted."
            );

            return;
        }

        if (
            editingBoardId ===
            selectedBoard.id
        ) {
            editingBoardId = null;

            userInputs.classList.add(
                "hidden"
            );

            createBtn.textContent =
                "Create Board";

            boardTitleInput.value = "";
            submitBtn.textContent =
                "Save & Use Board";
        }

        await loadBoardOptions();

        presetSelect.value = "select";
        customBoardReady = false;
        preferredBoardId = null;

        updateStartButton();
        updateBoardManagementControls();

        alert(
            "The board was permanently deleted."
        );
    }
);

presetSelect.addEventListener(
    "change",
    () => {
        preferredBoardId =
            presetSelect.value ===
                "select"
                ? null
                : presetSelect.value;

        customBoardReady = false;

        updateStartButton();
        updateBoardManagementControls();
    }
);

async function buildBoard(
    selectedBoardId =
        presetSelect.value
    ) {
    

    let boardData;

    if (selectedBoardId === "select") {
        const savedTemporaryBoard =
            localStorage.getItem(
                "tornadoGameBoard"
            );

        try {
            boardData =
                savedTemporaryBoard
                    ? JSON.parse(
                        savedTemporaryBoard
                    )
                    : userDataInput;
        } catch (error) {
            console.warn(
                "Invalid temporary Tornado board:",
                error
            );

            localStorage.removeItem(
                "tornadoGameBoard"
            );

            boardData =
                userDataInput;
        }
    } else {
        const savedBoard =
            await dbGetTornadoBoard(
                selectedBoardId
            );

        if (savedBoard) {
            boardData =
                savedBoard.questions;
        }
    }

    if (
        !boardData ||
        boardData.length !== 25
    ) {
        alert(
            "The selected Tornado board could not be loaded."
        );

        return false;
    }

    activeBoardData = boardData.map(question => ({
        ...question,
        used: false
    }));

    renderBoard(activeBoardData);

    return true;
}

function renderBoard(boardData) {
    board.innerHTML = "";

    boardData.forEach(
        (
            question,
            index
        ) => {
            const quizCell =
                document.createElement(
                    "button"
                );

            quizCell.type =
                "button";

            quizCell.className =
                "quiz-cell";

            quizCell.textContent =
                index + 1;

            quizCell.setAttribute(
                "aria-label",
                `Open question ${index + 1}`
            );

            quizCell.addEventListener(
                "click",
                async () => {
                    if (question.used) {
                        return;
                    }

                    await SoundUtils.prepare();

                    currentquizCell =
                        quizCell;

                    showQuestion(
                        question
                    );
                }
            );

            board.appendChild(
                quizCell
            );
        }
    );
}

function showModalTextAndImage(
    text,
    imageUrl,
    imageDescription
) {
    modalContent.innerHTML = "";

    if (imageUrl) {
        const image =
            document.createElement("img");

        image.src = imageUrl;
        image.alt = imageDescription;

        image.addEventListener(
            "error",
            () => {
                image.remove();
            }
        );

        modalContent.appendChild(
            image
        );
    }

    const paragraph =
        document.createElement("p");

    paragraph.textContent =
        text || "";

    modalContent.appendChild(
        paragraph
    );
}

function updateQuestionTimerDisplay() {
    questionTimer.classList.remove(
        "warning",
        "danger",
        "finished"
    );

    SoundUtils.playTimerTick({
        secondsRemaining:
            questionTimeRemaining,

        totalSeconds:
            30
    });

    if (questionTimeRemaining <= 0) {
        questionTimer.textContent =
            "TIME'S UP!";

        questionTimer.classList.add(
            "finished"
        );

        return;
    }

    questionTimer.textContent =
        String(questionTimeRemaining);

    if (questionTimeRemaining <= 5) {
        questionTimer.classList.add(
            "danger"
        );

    } else if (
        questionTimeRemaining <= 10
    ) {
        questionTimer.classList.add(
            "warning"
        );
    }
}

function stopQuestionTimer() {
    if (questionTimerId) {
        clearInterval(
            questionTimerId
        );

        questionTimerId = null;
    }
}

function hideQuestionTimer() {
    stopQuestionTimer();

    questionTimer.classList.add(
        "hidden"
    );
}

function startQuestionTimer() {
    stopQuestionTimer();

    questionTimeRemaining = 30;

    questionTimer.classList.remove(
        "hidden"
    );

    updateQuestionTimerDisplay();

    questionTimerId = setInterval(
        () => {
            questionTimeRemaining -= 1;


            updateQuestionTimerDisplay();

            if (
                questionTimeRemaining > 0
            ) {
                SoundUtils.playTimerTick({
                    secondsRemaining:
                        questionTimeRemaining,

                    totalSeconds:
                        30
                });

            } else {
                stopQuestionTimer();
                SoundUtils.playTimeUp();
            }
        },
        1000
    );
}

function showQuestion(question) {
    currentQuestion = question;
    showingAnswer = false;
    showingReward = false;

    modal.classList.remove(
        "hidden"
    );

     modal.focus();   

    showModalTextAndImage(
        question.question,
        question.questionImg,
        "Question image"
    );

    startQuestionTimer();
}

function showReward(question) {
    const reward =
        rewardList.find(
            item =>
                item.type ===
                question.rewardType
        ) ||
        question.reward;

    if (reward.type === "double") {
        SoundUtils.playGood("big");

    } else if (reward.type === "switch") {
        SoundUtils.playGood("normal");

    } else if (reward.type === "tornado") {
        SoundUtils.playBad();
    }

    modalContent.innerHTML = "";

    if (reward.img) {
        const figure =
            document.createElement(
                "figure"
            );

        figure.className =
            "reward-container";

        const image =
            document.createElement(
                "img"
            );

        image.src =
            reward.img;

        image.alt =
            reward.text;

        image.className =
            "reward-img";

        image.addEventListener(
            "error",
            () => {
                image.remove();
            }
        );

        const caption =
            document.createElement(
                "figcaption"
            );

        caption.className =
            "reward-text";

        caption.textContent =
            reward.text;

        figure.appendChild(
            image
        );

        figure.appendChild(
            caption
        );

        modalContent.appendChild(
            figure
        );
    } else {
        const heading =
            document.createElement(
                "h2"
            );

        heading.className =
            "reward-text";

        heading.textContent =
            reward.text;

        modalContent.appendChild(
            heading
        );
    }
}

async function updateSaveBoardAccess() {
    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check login:",
            error
        );

        return;
    }

    const user =
        data.session?.user;

    const isLoggedIn =
        Boolean(
            user &&
            !user.is_anonymous
        );

    if (isLoggedIn) {
        freeSavedGameLimit =
            await dbGetFreeSavedGameLimit();
    }

    const hasPremium =
        isLoggedIn
            ? await dbUserHasPremium()
            : false;

    saveLimitMessage.classList.toggle(
        "hidden",
        !isLoggedIn
    );

    if (isLoggedIn) {
        saveLimitMessage.textContent =
            hasPremium
                ? "Premium account: Unlimited saved boards."
                : `Free account: You can save up to ${freeSavedGameLimit} Tornado boards.`;
    }

    loginSaveMessage.classList.toggle(
        "hidden",
        isLoggedIn
    );

    boardNameFields.classList.toggle(
        "hidden",
        !isLoggedIn
    );

    boardTitleInput.disabled =
        !isLoggedIn;

    boardTitleInput.required =
        isLoggedIn;

    submitBtn.textContent =
        isLoggedIn
            ? "Save & Use Board"
            : "Use Board";
}

function updateStartButton() {
    const savedBoardSelected =
        presetSelect.value !==
            "select";

    startGameBtn.classList.toggle(
        "hidden",
        !customBoardReady &&
        !savedBoardSelected
    );
}

db.auth.onAuthStateChange(
    () => {
        setTimeout(
            refreshAccountState,
            0
        );
    }
);

function addBoardOptionGroup(
    label,
    boards
) {
    if (boards.length === 0) {
        return;
    }

    const group =
        document.createElement(
            "optgroup"
        );

    group.label = label;

    boards.forEach(board => {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            board.id;

        option.textContent =
            board.name;

        group.appendChild(
            option
        );
    });

    presetSelect.appendChild(
        group
    );
}

async function loadBoardOptions() {
    const requestId =
        ++boardOptionsLoadRequest;

    const selectedBoardValue =
        preferredBoardId ||
        presetSelect.value;

    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check login:",
            error
        );

        return;
    }

    const userId =
        data.session?.user?.id ||
        null;

    const boards =
        await dbGetTornadoBoardList(
            userId
        );

    if (
        requestId !==
        boardOptionsLoadRequest
    ) {
        return;
    }

    availableBoards =
        boards;

    currentUserId =
        userId;

    presetSelect.innerHTML = "";

    const placeholder =
        document.createElement(
            "option"
        );

    placeholder.value =
        "select";

    placeholder.textContent =
        "Select a Board";

    presetSelect.appendChild(
        placeholder
    );

    const officialBoards =
        boards.filter(
            board =>
                board.is_preset
        );

    const myBoards =
        boards.filter(
            board =>
                !board.is_preset &&
                board.owner_id ===
                    userId
        );

    addBoardOptionGroup(
        "Official Boards",
        officialBoards
    );

    addBoardOptionGroup(
        "My Boards",
        myBoards
    );

    const selectedBoardStillExists =
        Array.from(
            presetSelect.options
        ).some(
            option =>
                option.value ===
                    selectedBoardValue
        );

    if (selectedBoardStillExists) {
        presetSelect.value =
            selectedBoardValue;

        preferredBoardId =
            selectedBoardValue;
    }

    updateStartButton();
}

document
    .getElementById(
        "team-count"
    )
    .addEventListener(
        "change",
        () => {
            if (
                document.body.classList.contains(
                    "play-mode"
                )
            ) {
                buildScoreBoard();
            }
        }
    );

async function refreshAccountState() {
    if (boardSaveInProgress) {
        return;
    }

    await updateSaveBoardAccess();
    await loadBoardOptions();

    updateBoardManagementControls();
}

window.addEventListener(
    "focus",
    refreshAccountState
);

document.addEventListener(
    "visibilitychange",
    () => {
        if (!document.hidden) {
            refreshAccountState();
        }
    }
);

function updatePlayAgainControls() {
    const unusedCells =
        document.querySelectorAll(
            ".quiz-cell:not(.used)"
        );

    playAgainControls.classList.toggle(
        "hidden",
        unusedCells.length !== 0
        
    );
}

modal.addEventListener("click", () => {
   
    if(!currentQuestion) return;


    // First click after opening
    if (!showingAnswer) {
        showingAnswer = true;

        hideQuestionTimer();

        showModalTextAndImage(
            currentQuestion.answer,
            currentQuestion.answerImg,
            "Answer image"
        );
    } else if(!showingReward){
    showingReward = true;
    showReward(currentQuestion);
    }

    // Second click closes
    else{
        
         modal.classList.add("hidden");

        currentQuestion.used = true;
        currentquizCell.textContent =
             currentQuestion.reward.text;

        currentquizCell.classList.add("used");


        currentQuestion = null;
        currentquizCell = null;
        showingAnswer = false;
        showingReward = false;

        updatePlayAgainControls();
    }

    
   
});

modal.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            modal.click();
        }
    }
);

playAgainBtn.addEventListener("click", () => {
    window.location.reload();
});

playAgainShuffleBtn.addEventListener("click", () => {
    const shuffledRewardTypes = shuffleArray(
        activeBoardData.map(
            question => question.rewardType
        )
    );

    activeBoardData =
        activeBoardData.map((question, index) => {
            const rewardType =
                shuffledRewardTypes[index];

            const reward =
                rewardList.find(
                    item =>
                        item.type === rewardType
                );

            return {
                ...question,
                rewardType: rewardType,
                reward: reward,
                used: false
            };
        });

    renderBoard(activeBoardData);
    buildScoreBoard();

    playAgainControls.classList.add("hidden");
});

async function initializePageMode() {
    const parameters =
        new URLSearchParams(
            window.location.search
        );

    if (
        parameters.get("mode") !==
        "play"
    ) {
        return;
    }

    document.body.classList.add(
        "play-mode"
    );

    const selectedBoardId =
        parameters.get("board") ||
        "select";

    const shareSlug =
        parameters.get("share");

    document.getElementById(
        "team-count"
    ).value =
        parameters.get("teams") ||
        "2";

    let boardLoaded = false;

    if (shareSlug) {
        const sharedBoard =
            await dbGetTornadoBoardBySlug(
                shareSlug
            );

        if (
            sharedBoard &&
            sharedBoard.questions.length === 25
        ) {
            activeBoardData =
                sharedBoard.questions.map(
                    question => ({
                        ...question,
                        used: false
                    })
                );

            renderBoard(activeBoardData);
            boardLoaded = true;
        } else {
            board.innerHTML =
                "<p>This shared board is no longer available.</p>";
        }
    } else {
        boardLoaded =
            await buildBoard(
                selectedBoardId
            );
    }

    if (boardLoaded) {
        buildScoreBoard();
    }
}

function buildScoreBoard() {
    const scoreboard =
        document.getElementById(
            "scoreboard"
        );

    const teamCount =
        Number(
            document.getElementById(
                "team-count"
            ).value
        );

    scoreboard.innerHTML = "";

    scoreboard.dataset.teamCount =
        teamCount;

    for (
        let teamNumber = 1;
        teamNumber <= teamCount;
        teamNumber++
    ) {
        const team =
            document.createElement(
                "section"
            );

        team.className =
            "team-score";

        const heading =
            document.createElement(
                "h3"
            );

        heading.textContent =
            `Team ${teamNumber}`;

        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "team-score-controls";

        const minusButton =
            document.createElement(
                "button"
            );

        minusButton.type =
            "button";

        minusButton.className =
            "minus";

        minusButton.textContent =
            "−";

        const scoreInput =
            document.createElement(
                "input"
            );

        scoreInput.type =
            "number";

        scoreInput.className =
            "team-score-value";

        scoreInput.value =
            "0";

        scoreInput.min =
            "0";

        scoreInput.max =
            "13000";

        scoreInput.step =
            "100";

        const plusButton =
            document.createElement(
                "button"
            );

        plusButton.type =
            "button";

        plusButton.className =
            "plus";

        plusButton.textContent =
            "+";

        const tornadoButton =
            document.createElement(
                "button"
            );

        tornadoButton.type =
            "button";

        tornadoButton.className =
            "team-tornado-btn";

        tornadoButton.textContent =
            "🌪 0";

        function normalizeScore() {
            let score =
                Number(
                    scoreInput.value
                );

            if (!Number.isFinite(score)) {
                score = 0;
            }

            score =
                Math.round(
                    score / 100
                ) * 100;

            score =
                Math.max(
                    0,
                    Math.min(
                        13000,
                        score
                    )
                );

            scoreInput.value =
                String(score);

            return score;
        }

        minusButton.addEventListener(
            "click",
            () => {
                const score =
                    normalizeScore();

                scoreInput.value =
                    String(
                        Math.max(
                            0,
                            score - 100
                        )
                    );
            }
        );

        plusButton.addEventListener(
            "click",
            () => {
                const score =
                    normalizeScore();

                scoreInput.value =
                    String(
                        Math.min(
                            13000,
                            score + 100
                        )
                    );
            }
        );

        tornadoButton.addEventListener(
            "click",
            () => {
                scoreInput.value =
                    "0";
            }
        );

        scoreInput.addEventListener(
            "change",
            normalizeScore
        );

        scoreInput.addEventListener(
            "blur",
            normalizeScore
        );

        controls.appendChild(
            minusButton
        );

        controls.appendChild(
            scoreInput
        );

        controls.appendChild(
            plusButton
        );

        team.appendChild(
            heading
        );

        team.appendChild(
            controls
        );

        team.appendChild(
            tornadoButton
        );

        scoreboard.appendChild(
            team
        );
    }
}

refreshAccountState();
initializePageMode();
