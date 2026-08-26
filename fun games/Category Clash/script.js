// HTML ELEMENTS
const board = 
    document.getElementById(
        'board'
    );
const userInputs = 
    document.getElementById(
        'user-inputs'
    );
const createBtn = 
    document.getElementById(
        'create-btn'
    );

const startGameBtn = 
    document.getElementById(
        'start-btn'
    );
const presetSelect = 
    document.getElementById(
        'preset'
    );
const columnContainer = 
    document.getElementById(
        "column-container"
    );
const modal = 
    document.getElementById(
        "question-modal"
    );
const modalContent = 
    document.getElementById(
        'question-content'
    );
const questionTimer =
    document.getElementById(
        "question-timer"
    );
const saveBoardControls =
    document.getElementById(
        "save-board-controls"
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

const imagePickerCategory =
    document.getElementById(
        "image-picker-category"
    );

const imagePickerTags =
    document.getElementById(
        "image-picker-tags"
    );

const imagePickerSearch =
    document.getElementById(
        "image-picker-search"
    );

const saveBoardBtn =
    document.getElementById(
        "save-board-btn"
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

const restartGameBtn =
    document.getElementById(
        "restart-game-btn"
    );

const startGameMessage =
    document.getElementById(
        "start-game-message"
    );

const CATEGORY_COUNT = 5;
const QUESTIONS_PER_CATEGORY = 5;

let activeImageTargetId = null;
let currentQuestion = null;
let showingAnswer = null;
let currentScoreCell = null;
let customBoardReady = false;
let availableBoards = [];
let currentUserId = null;
let editingBoardId = null;
let questionTimerId = null;
let questionTimeRemaining = 30;

let imageLibraryItems = [];
let imageLibraryCategories = [];
let imageLibraryTags = [];
const userDataInput = [];
let freeSavedGameLimit = 10;


createBtn.addEventListener(
    "click",
    async () => {
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

        createColumns();
    }
);

function createImageField(id) {
    const container =
        document.createElement("div");

    container.className =
        "selected-image-field";

    const valueInput =
        document.createElement("input");

    valueInput.type = "hidden";
    valueInput.id = id;
    valueInput.dataset.imageUrl = "";

    const chooseButton =
        document.createElement("button");

    chooseButton.type = "button";
    chooseButton.className =
        "choose-image-btn";
    chooseButton.textContent =
        "Select Image";
    chooseButton.dataset.targetId = id;

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
    removeButton.dataset.targetId = id;

    container.appendChild(valueInput);
    container.appendChild(chooseButton);
    container.appendChild(selectedName);
    container.appendChild(removeButton);

    return container;
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

            checkbox.type = "checkbox";
            checkbox.value = tag.id;

            label.appendChild(checkbox);
            label.append(` ${tag.name}`);

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
        ).map(
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
        imageLibraryItems.filter(item => {
            const categoryMatches =
                browsingByTag ||
                String(
                    item.categoryId
                ) === categoryId;

            const searchMatches =
                item.name
                    .toLowerCase()
                    .includes(searchText);

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
        });

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
            document.createElement("img");

        image.src = item.imageUrl;
        image.alt = item.name;
        image.loading = "lazy";

        const name =
            document.createElement("span");

        name.textContent = item.name;

        itemButton.appendChild(image);
        itemButton.appendChild(name);

        imagePickerGrid.appendChild(
            itemButton
        );
    });
}

imagePickerCategory.addEventListener(
    "change",
    () => {
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

// OPENS PICKER
columnContainer.addEventListener(
    "click",
    event => {
        const chooseButton =
            event.target.closest(
                ".choose-image-btn"
            );

        if (!chooseButton) {
            return;
        }

        activeImageTargetId =
            chooseButton.dataset.targetId;

        renderImagePicker();

        imagePickerModal.classList.remove(
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

// REMOVES SELECTED IMAGES
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

        const valueInput =
            document.getElementById(
                removeButton.dataset.targetId
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

        chooseButton.textContent =
            "Select Image";
    }
);


function populateImageCategories() {
    imagePickerCategory.innerHTML = "";

    const placeholder =
        document.createElement("option");

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

            option.value = category.id;
            option.textContent =
                category.name;

            imagePickerCategory.appendChild(
                option
            );
        }
    );
}
// CREATE USER INPUT
function createColumns (){
    columnContainer.innerHTML = "";

    for (let col= 1; col <= CATEGORY_COUNT; col++){
        const column = document.createElement("div");
        column.className = "column";
        
        const categoryLabel = document.createElement("label");
        categoryLabel.textContent = `Category ${col}`;

        const categoryInput = document.createElement("input");
        categoryInput.required = true;
        categoryInput.type = "text";
        categoryInput.id = `category-${col}`;

        column.appendChild(categoryLabel);
        column.appendChild(categoryInput);

        for (let row=1; row<=QUESTIONS_PER_CATEGORY; row ++){

            //QUESTIONS

            const qLabel = document.createElement("label");
            qLabel.textContent = `Question ${row}`;

            const qText = document.createElement("input");
            qText.required = true;
            qText.type = "text";
            qText.id = `question-${col}-${row}`;

            const qImageLabel =
                document.createElement("label");

            qImageLabel.textContent =
                "Question Image";

            const qImageSelect =
                createImageField(
                    `question-${col}-${row}-item`
                );

            column.appendChild(qLabel);
            column.appendChild(qText);
            column.appendChild(qImageLabel);
            column.appendChild(qImageSelect);

            //ANSWERS

            const aLabel = document.createElement("label");
            aLabel.textContent = `Answer ${row}`;

            const aText = document.createElement("input");
            aText.required = true;
            aText.type = "text";
            aText.id = `answer-${col}-${row}`;

            const aImageLabel =
                document.createElement("label");

            aImageLabel.textContent =
                "Answer Image";

            const aImageSelect =
                createImageField(
                    `answer-${col}-${row}-item`
                );

            column.appendChild(aLabel);
            column.appendChild(aText);
            column.appendChild(aImageLabel);
            column.appendChild(aImageSelect);

            //SCORE

           const sText = document.createElement("select");
            sText.id = `score-${col}-${row}`;

            for(let score = 100; score <= 500; score += 100){

                const option =
                document.createElement("option");

                option.value = score;
                option.textContent = score;

                if(score === row * 100){
                option.selected = true;
                }


                sText.appendChild(option);

                }
            column.appendChild(sText)
        }

    columnContainer.appendChild(column)    
    }
    
};

userInputs.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        if (!userInputs.reportValidity()) {
            return;
        }

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

        saveBoardBtn.disabled = true;

        saveBoardMessage.textContent = "";

        if (
            !session ||
            session.user?.is_anonymous
        ) {
            saveBoardBtn.textContent =
                "Preparing...";

            try {
                await getUserInput(false);

                saveBoardMessage.textContent =
                    "Board is ready. Click Start Game to play.";
                alert(
                    "Your temporary board is ready. Click Start Game to play."
                );
            } catch (error) {
                console.error(
                    "Prepare Board error:",
                    error
                );

                saveBoardMessage.textContent =
                    "The board could not be prepared.";
            } finally {
                saveBoardBtn.disabled = false;
                saveBoardBtn.textContent =
                    "Use Board";
            }

            return;
        }

        const boardName =
            boardTitleInput.value.trim();

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
            saveBoardBtn.disabled = false;
            saveBoardBtn.textContent =
                "Save & Use Board";

            return;
        }

        if (!boardName) {
            boardTitleInput.focus();
            saveBoardBtn.disabled = false;

            return;
        }

        saveBoardBtn.textContent =
            "Saving...";

        try {
            await getUserInput(false);

            let savedBoardId;

            if (editingBoardId) {
                const updated =
                    await dbUpdateCategoryClashBoard(
                        editingBoardId,
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

                alert(
                    "Your changes were saved. The previous share link is no longer valid. Click Start Game to play."
                );

                editingBoardId = null;
            } else {
                const result =
                    await dbSaveCategoryClashBoard(
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
                        `You have reached the free limit of ${freeSavedGameLimit} Category Clash boards. Delete one or upgrade to Premium.`;

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

                alert(
                    "Your board has been saved. Click Start Game to play."
                );
            }

            await loadBoardOptions();

            presetSelect.value =
                String(savedBoardId);

            updateStartButton();
            updateShareBoardControls();
            
        } catch (error) {
            console.error(
                "Save Board error:",
                error
            );

            saveBoardMessage.textContent =
                "The board could not be saved.";
        } finally {
            saveBoardBtn.disabled = false;
            saveBoardBtn.textContent =
                "Save & Use Board";
        }
    }
);

async function getUserInput(
    showAlert = true
){
    

        userDataInput.length = 0;
        
        for (let col = 1;col <= CATEGORY_COUNT; col++){

            const category = {
            category: document.getElementById(`category-${col}`).value,
            questions: []
            };

        

            for (let row = 1; row <=QUESTIONS_PER_CATEGORY; row++){

                const question = 
                    document
                    .getElementById(
                        `question-${col}-${row}`).value;
                const answer = 
                    document
                    .getElementById(
                        `answer-${col}-${row}`).value;
                const score = 
                    document
                    .getElementById(
                        `score-${col}-${row}`).value;

                const qImageInput =
                    document.getElementById(
                        `question-${col}-${row}-item`
                    );

                const aImageInput =
                    document.getElementById(
                        `answer-${col}-${row}-item`
                    );

                const qImg =
                    qImageInput.dataset.imageUrl ||
                    null;

                const aImg =
                    aImageInput.dataset.imageUrl ||
                    null;

                const qItemId =
                    qImageInput.value
                        ? Number(qImageInput.value)
                        : null;

                const aItemId =
                    aImageInput.value
                        ? Number(aImageInput.value)
                        : null;

                category.questions.push({
                    score: score,

                    question: question,
                    questionImg: qImg,
                    questionItemId: qItemId,

                    answer: answer,
                    answerImg: aImg,
                    answerItemId: aItemId,

                    used: false
                });
                
            };
            
        userDataInput.push(category);
        
        };
    localStorage.setItem(
            "categoryClashBoard",
            JSON.stringify(userDataInput)
        );  
        
    customBoardReady = true;
    updateStartButton();
   
   if (showAlert) {
    alert(
        "Board is ready. Click Start Game to play."
    );
}
  
};

async function loadBoardOptions() {
    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check the session:",
            error
        );
    }

    const userId =
        data?.session?.user?.id ||
        null;

    const boards =
        await dbGetCategoryClashBoardList(
            userId
        );
        
    availableBoards = boards;

    currentUserId = userId;

    presetSelect.innerHTML = "";

    const placeholder =
        document.createElement("option");

    placeholder.value = "select";
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
                board.owner_id === userId
        );

    addBoardOptionGroup(
        "Official Boards",
        officialBoards
    );

    addBoardOptionGroup(
        "My Boards",
        myBoards
    );

    updateStartButton();
    updateShareBoardControls();
}

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

        option.value = board.id;
        option.textContent =
            board.name;

        group.appendChild(option);
    });

    presetSelect.appendChild(group);
}

function createSharedBoardUrl(
    shareSlug
) {
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

function updateShareBoardControls() {
    const selectedBoard =
        availableBoards.find(
            board =>
                String(board.id) ===
                presetSelect.value
        );

    const userOwnsBoard =
        selectedBoard &&
        !selectedBoard.is_preset &&
        selectedBoard.owner_id ===
            currentUserId;

    shareBoardControls.classList.toggle(
        "hidden",
        !userOwnsBoard
    );

    shareBoardMessage.textContent = "";

    if (!userOwnsBoard) {
        shareLinkContainer.classList.add(
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
            await dbEnableCategoryClashSharing(
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

        shareBoardMessage.textContent =
            "Share link created.";

        updateShareBoardControls();
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
            await dbGetCategoryClashBoard(
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

        savedBoard.categories.forEach(
            (category, categoryIndex) => {
                const col =
                    categoryIndex + 1;

                document.getElementById(
                    `category-${col}`
                ).value =
                    category.category;

                category.questions.forEach(
                    (
                        question,
                        questionIndex
                    ) => {
                        const row =
                            questionIndex + 1;

                        document.getElementById(
                            `question-${col}-${row}`
                        ).value =
                            question.question;

                        document.getElementById(
                            `answer-${col}-${row}`
                        ).value =
                            question.answer;

                        document.getElementById(
                            `score-${col}-${row}`
                        ).value =
                            String(
                                question.score
                            );

                        fillSelectedImageField(
                            `question-${col}-${row}-item`,
                            question.questionItemId,
                            question.questionImg
                        );

                        fillSelectedImageField(
                            `answer-${col}-${row}-item`,
                            question.answerItemId,
                            question.answerImg
                        );
                    }
                );
            }
        );

        editingBoardId =
            selectedBoard.id;

        saveBoardBtn.textContent =
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
                `Permanently delete "${selectedBoard.name}"?\n\n` +
                "This cannot be undone, and its share link will stop working."
            );

        if (!confirmed) {
            return;
        }

        deleteBoardBtn.disabled = true;
        deleteBoardBtn.textContent =
            "Deleting...";

        const deleted =
            await dbDeleteCategoryClashBoard(
                selectedBoard.id,
                currentUserId
            );

        deleteBoardBtn.disabled = false;
        deleteBoardBtn.textContent =
            "Delete Board";

        if (!deleted) {
            shareBoardMessage.textContent =
                "The board could not be deleted.";

            return;
        }

        alert(
            `"${selectedBoard.name}" was permanently deleted.`
        );

        await loadBoardOptions();

        presetSelect.value = "select";

        updateStartButton();
        updateShareBoardControls();
    }
);

function updateStartButton() {
    const presetIsSelected =
        presetSelect.value !== "select";

    startGameBtn.classList.toggle(
        "hidden",
        !customBoardReady &&
        !presetIsSelected
    );
}

presetSelect.addEventListener(
    "change",
    () => {
        updateStartButton();
        updateShareBoardControls();
    }
);

startGameBtn.addEventListener("click", () => {
    const selectedPreset =
        document.getElementById("preset").value;

    const selectedTeamCount =
        document.getElementById("team-count").value;

    const playUrl =
        new URL(window.location.href);

    playUrl.searchParams.set(
        "mode",
        "play"
    );

    playUrl.searchParams.set(
        "preset",
        selectedPreset
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
});

restartGameBtn.addEventListener(
    "click",
    () => {
        window.location.reload();
    }
);

function renderBoard(boardData){

    board.innerHTML = "";

    // categories
    boardData.forEach(category=>{

        const categoryCell =
        document.createElement("div");

        categoryCell.className =
        "category-cell";

        categoryCell.textContent =
        category.category

        board.appendChild(categoryCell);

    });

    // scores
    for(let row=0; row<5; row++){

        boardData.forEach(category=>{

            const question =
            category.questions[row];

            const scoreCell =
            document.createElement("div");

            scoreCell.className =
            "score-cell";

            scoreCell.textContent =
            question.score;

            scoreCell.setAttribute(
                "role",
                "button"
            );

            scoreCell.setAttribute(
                "tabindex",
                "0"
            );

            scoreCell.setAttribute(
                "aria-label",
                `Open question for ${question.score} points`
            );

            scoreCell.addEventListener(
                "click",
                async () => {
                    if (question.used) {
                        return;
                    }

                    await SoundUtils.prepare();

                    currentScoreCell =
                        scoreCell;

                    showQuestion(question);
                }
            );

            scoreCell.addEventListener(
                "keydown",
                event => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();
                        scoreCell.click();
                    }
                }
            );

            board.appendChild(scoreCell);

        });

    }

};

function displayModalContent(
    text,
    imageUrl
) {
    modalContent.innerHTML = "";

    if (imageUrl) {
        const image =
            document.createElement("img");

        image.src = imageUrl;
        image.alt = "";

        image.addEventListener(
            "error",
            () => {
                image.remove();
            }
        );       

        modalContent.appendChild(image);
    }

    const paragraph =
        document.createElement("p");

    paragraph.textContent = text;

    modalContent.appendChild(paragraph);
}

function updateQuestionTimerDisplay() {
    questionTimer.classList.remove(
        "warning",
        "danger",
        "finished"
    );

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

    SoundUtils.playTimerTick({
        secondsRemaining:
            questionTimeRemaining,

        totalSeconds:
            30
    });

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

    modal.classList.remove("hidden");
    modal.focus();

    displayModalContent(
        question.question,
        question.questionImg
    );

    startQuestionTimer();
}

function updateRestartButton() {
    const unusedScoreCells =
        document.querySelectorAll(
            ".score-cell:not(.used)"
        );

    restartGameBtn.classList.toggle(
        "hidden",
        unusedScoreCells.length !== 0
    );
}

modal.addEventListener("click", () => {
   
    if(!currentQuestion) return;

    // First click after opening
    if(!showingAnswer){

        showingAnswer = true;

        hideQuestionTimer();

        displayModalContent(
            currentQuestion.answer,
            currentQuestion.answerImg
        );

    }

    // Second click closes
    else{
        
         modal.classList.add("hidden");

        currentQuestion.used = true;

        currentScoreCell.classList.add("used");

        currentScoreCell.textContent = "";

        currentQuestion = null;
        currentScoreCell = null;
        showingAnswer = false;

        updateRestartButton();

    }

});

//for keyboard users
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


function buildScoreBoard(){

    const scoreboard =
    document.getElementById("scoreboard");

    scoreboard.innerHTML = "";

    const teamCount =
    Number(
    document.getElementById("team-count").value
    );

    scoreboard.dataset.teamCount =
    teamCount;

    for(let i=1; i<=teamCount; i++){

        const team =
        document.createElement("div");

        team.className = "team-score";

        team.innerHTML = `
            <h3>Team ${i}</h3>

            <div id="score-${i}">
                0
            </div>

            <button class="minus">
                -
            </button>

            <button class="plus">
                +
            </button>
        `;

        scoreboard.appendChild(team);
    }

    addScoreEvents();
}

document
    .getElementById("team-count")
    .addEventListener(
        "change",
        () => {
            buildScoreBoard();
        }
    );

function addScoreEvents(){

    document
    .querySelectorAll(".team-score")
    .forEach(team=>{

        const scoreDisplay =
        team.querySelector("div");

        let score = 0;

        team
        .querySelector(".plus")
        .addEventListener(
            "click",
            ()=>{
                if (score === 13000 )return;
                score += 100;

                scoreDisplay.textContent =
                score;

            }
        );

        team
        .querySelector(".minus")
        .addEventListener(
            "click",
            ()=>{
                if (score === 0 )return;
                score -= 100;

                scoreDisplay.textContent =
                score;

                

            }
        );

    });

}

async function buildSharedBoard(
    shareSlug
) {
    const sharedBoard =
        await dbGetCategoryClashBoardBySlug(
            shareSlug
        );

    if (
        !sharedBoard ||
        sharedBoard.categories.length === 0
    ) {
        alert(
            "This shared board is unavailable."
        );

        return false;
    }

    renderBoard(
        sharedBoard.categories
    );

    return true;
}

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
        parameters.get("preset") ||
        "select";

    const shareSlug =
        parameters.get("share");

    document
        .getElementById(
            "team-count"
        )
        .value =
            parameters.get("teams") ||
            "2";

    let boardLoaded;

    if (shareSlug) {
        boardLoaded =
            await buildSharedBoard(
                shareSlug
            );
    } else {
        boardLoaded =
            await buildSelectedBoard(
                selectedBoardId
            );
    }

    if (!boardLoaded) {
        return;
    }

    buildScoreBoard();
}

async function buildSelectedBoard(
    selectedBoardId
) {
    let boardData;

    if (
        selectedBoardId === "select"
    ) {
        boardData =
            JSON.parse(
                localStorage.getItem(
                    "categoryClashBoard"
                )
            );
    } else {
        const savedBoard =
            await dbGetCategoryClashBoard(
                selectedBoardId
            );

        if (savedBoard) {
            boardData =
                savedBoard.categories;
        }
    }

    if (
        !boardData ||
        boardData.length === 0
    ) {
        alert(
            "The selected board could not be loaded."
        );

        return false;
    }

    renderBoard(boardData);

    return true;
}



initializePageMode();

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
                : `Free account: You can save up to ${freeSavedGameLimit} Category Clash boards.`;
    }

    saveBoardControls.classList.remove(
        "hidden"
    );

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

    saveBoardBtn.textContent =
        isLoggedIn
            ? "Save & Use Board"
            : "Use Board";
}

async function refreshAccountState() {
    await updateSaveBoardAccess();
    await loadBoardOptions();
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

db.auth.onAuthStateChange(
    () => {
        setTimeout(
            refreshAccountState,
            0
        );
    }
);

loadBoardOptions();
updateStartButton();
updateSaveBoardAccess();

