const setupForm = document.getElementById("claimGridSetup");
const teamCountSelect = document.getElementById("teamCount");
const teamColorControls = document.getElementById("teamColorControls");
const setupMessage = document.getElementById("setupMessage");
const questionEditor = document.getElementById("questionEditor");
const questionEditorSummary = document.getElementById("questionEditorSummary");
const questionForm = document.getElementById("questionForm");
const questionList = document.getElementById("questionList");
const questionMessage = document.getElementById("questionMessage");
const saveClaimGridSetBtn = document.getElementById("saveClaimGridSetBtn");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const backToSetupBtn = document.getElementById("backToSetupBtn");
const libraryModal = document.getElementById("libraryModal");
const closeLibraryBtn = document.getElementById("closeLibraryBtn");
const libraryCategory = document.getElementById("libraryCategory");
const librarySearch = document.getElementById("librarySearch");
const libraryTags = document.getElementById("libraryTags");
const libraryItems = document.getElementById("libraryItems");
const libraryMessage = document.getElementById("libraryMessage");
const savedClaimGridSetSelect = document.getElementById("savedClaimGridSetSelect");
const savedSetsCount = document.getElementById("savedSetsCount");
const savedSetsMessage = document.getElementById("savedSetsMessage");
const editClaimGridSetBtn = document.getElementById("editClaimGridSetBtn");
const shareClaimGridSetBtn = document.getElementById("shareClaimGridSetBtn");
const deleteClaimGridSetBtn = document.getElementById("deleteClaimGridSetBtn");
const createClaimGridRoomBtn = document.getElementById("createClaimGridRoomBtn");
const continueBtn = document.getElementById("continueBtn");
const createSavedClaimGridRoomBtn = document.getElementById("createSavedClaimGridRoomBtn");
const claimGridEntryChoice = document.getElementById("claimGridEntryChoice");
const openClaimGridSetupBtn = document.getElementById("openClaimGridSetupBtn");
const savedSetsCard = document.getElementById("savedSetsCard");

const defaultTeamColors = ["#e53935", "#2474e8", "#18a957", "#f2a900"];
let questionSequence = 0;
let activeImageSlot = null;
let imageLibrary = [];
let libraryLoadRequest = 0;
let libraryVisibleItemCount = 10;
let savedClaimGridSets = [];
let editingClaimGridSetId = null;

function showTeacherSetup() {
    claimGridEntryChoice.classList.add("hidden");
    savedSetsCard.classList.remove("hidden");
    setupForm.classList.remove("hidden");
    savedSetsCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTeamColorControls() {
    const teamCount = Number(teamCountSelect.value);
    const existing = Array.from(
        teamColorControls.querySelectorAll('input[type="color"]')
    ).map(input => input.value);

    teamColorControls.innerHTML = "";
    for (let index = 0; index < teamCount; index += 1) {
        const label = document.createElement("label");
        label.className = "team-color-control";
        label.textContent = `Team ${index + 1}`;
        const input = document.createElement("input");
        input.type = "color";
        input.value = existing[index] || defaultTeamColors[index];
        input.defaultValue = input.value;
        input.setAttribute("aria-label", `Team ${index + 1} color`);
        label.appendChild(input);
        teamColorControls.appendChild(label);
    }
}

function teamColorsAreUnique() {
    const colors = Array.from(
        teamColorControls.querySelectorAll('input[type="color"]')
    ).map(input => input.value.toLowerCase());
    return new Set(colors).size === colors.length;
}

function imageSlotMarkup(label) {
    return `
        <div class="library-image-slot" data-item-id="">
            <span class="image-slot-label">${label}</span>
            <div class="selected-library-image hidden">
                <img alt="Selected library image">
                <span></span>
            </div>
            <div class="image-slot-actions">
                <button class="choose-library-button" type="button">Choose from Library</button>
                <button class="remove-library-image hidden" type="button">Remove Image</button>
            </div>
        </div>
    `;
}

function answerMarkup(answerNumber) {
    return `
        <div class="answer-choice">
            <div class="answer-choice-heading">
                <label class="correct-answer-control">
                    <input type="radio" value="${answerNumber}" required>
                    <span>Answer ${answerNumber} is correct</span>
                </label>
                <button class="remove-answer-button" type="button">Remove Answer Choice</button>
            </div>
            <div class="answer-fields">
                <div class="form-control answer-text-control">
                    <label>Answer Text</label>
                    <input type="text" maxlength="180" placeholder="Enter an answer choice">
                </div>
                ${imageSlotMarkup("Answer Image (optional)")}
            </div>
        </div>
    `;
}

function questionMarkup(questionId) {
    return `
        <article class="question-card" data-question-id="${questionId}">
            <div class="question-card-heading">
                <h3>Question</h3>
                <button class="delete-question-button" type="button">Delete Question</button>
            </div>
            <div class="question-fields">
                <div class="form-control question-text-control">
                    <label>Question Text</label>
                    <input type="text" maxlength="300" placeholder="Enter the question">
                </div>
                ${imageSlotMarkup("Question Image (optional)")}
            </div>
            <h4>Answer Choices</h4>
            <div class="answers-list">
                ${answerMarkup(1)}
                ${answerMarkup(2)}
            </div>
            <button class="add-answer-button" type="button">+ Add Answer Choice</button>
        </article>
    `;
}

function renumberEditor() {
    const cards = questionList.querySelectorAll(".question-card");
    cards.forEach((card, questionIndex) => {
        const questionNumber = questionIndex + 1;
        card.querySelector("h3").textContent = `Question ${questionNumber}`;
        const choices = card.querySelectorAll(".answer-choice");
        choices.forEach((choice, answerIndex) => {
            const answerNumber = answerIndex + 1;
            const radio = choice.querySelector('input[type="radio"]');
            radio.name = `question-${card.dataset.questionId}-correct-answer`;
            radio.value = String(answerNumber);
            choice.querySelector(".correct-answer-control span").textContent =
                `Answer ${answerNumber} is correct`;
        });
        card.querySelectorAll(".remove-answer-button").forEach(button => {
            button.disabled = choices.length <= 2;
        });
        card.querySelector(".add-answer-button").disabled = choices.length >= 4;
    });

    questionList.querySelectorAll(".delete-question-button").forEach(button => {
        button.disabled = cards.length <= 1;
    });
    addQuestionBtn.disabled = cards.length >= 50;
    questionEditorSummary.textContent =
        `${cards.length} ${cards.length === 1 ? "question" : "questions"}. ` +
        "Each question and answer needs text, an image, or both.";
}

function addQuestion() {
    if (questionList.children.length >= 50) return;
    questionSequence += 1;
    questionList.insertAdjacentHTML("beforeend", questionMarkup(questionSequence));
    renumberEditor();
}

function selectedTagIds() {
    return Array.from(libraryTags.querySelectorAll("input:checked"))
        .map(input => Number(input.value));
}

function renderLibraryItems() {
    const search = librarySearch.value.trim().toLowerCase();
    const filtered = imageLibrary.filter(item => {
        const searchMatches = !search || item.name.toLowerCase().includes(search);
        return searchMatches;
    });

    libraryItems.innerHTML = "";
    libraryMessage.textContent = filtered.length ? "" : "No matching library images found.";
    filtered
        .slice(0, libraryVisibleItemCount)
        .forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "library-item";
        button.innerHTML = `<img src="${item.thumbnailUrl || item.imageUrl}" alt="" loading="lazy"><span></span>`;
        button.querySelector("img").alt = item.name;
        button.querySelector("span").textContent = item.name;
        button.addEventListener("click", () => selectLibraryImage(item));
        libraryItems.appendChild(button);
    });

    if (filtered.length > libraryVisibleItemCount) {
        const showMoreButton = document.createElement("button");
        showMoreButton.type = "button";
        showMoreButton.className = "show-more-items-button";
        showMoreButton.textContent = "Show 10 More";
        showMoreButton.addEventListener("click", () => {
            libraryVisibleItemCount += 10;
            renderLibraryItems();
        });
        libraryItems.appendChild(showMoreButton);
    }
}

async function refreshLibraryItems() {
    libraryVisibleItemCount = 10;
    const categoryId = libraryCategory.value;
    const tagIds = selectedTagIds();
    const requestId = ++libraryLoadRequest;

    if (
        categoryId === "browse-by-tag" &&
        tagIds.length === 0
    ) {
        imageLibrary = [];
        libraryItems.innerHTML = "";
        libraryMessage.textContent = "Select at least one tag to show images.";
        return;
    }

    libraryMessage.textContent = "Loading images...";
    libraryItems.innerHTML = "";

    const items = await dbGetImageLibraryItems(categoryId, tagIds);
    if (requestId !== libraryLoadRequest) return;

    imageLibrary = items;
    renderLibraryItems();
}

function selectLibraryImage(item) {
    if (!activeImageSlot) return;
    activeImageSlot.dataset.itemId = String(item.id);
    const selected = activeImageSlot.querySelector(".selected-library-image");
    selected.querySelector("img").src = item.imageUrl;
    selected.querySelector("img").alt = item.name;
    selected.querySelector("span").textContent = item.name;
    selected.classList.remove("hidden");
    activeImageSlot.querySelector(".remove-library-image").classList.remove("hidden");
    closeLibrary();
}

function displayImageInSlot(slot, item) {
    if (!item) return;
    slot.dataset.itemId = String(item.id);
    const selected = slot.querySelector(".selected-library-image");
    selected.querySelector("img").src = item.imageUrl;
    selected.querySelector("img").alt = item.name;
    selected.querySelector("span").textContent = item.name;
    selected.classList.remove("hidden");
    slot.querySelector(".remove-library-image").classList.remove("hidden");
}

function openLibrary(slot) {
    activeImageSlot = slot;
    libraryModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    librarySearch.focus();
}

function closeLibrary() {
    libraryModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    activeImageSlot = null;
}

function removeImage(slot) {
    slot.dataset.itemId = "";
    slot.querySelector(".selected-library-image").classList.add("hidden");
    const image = slot.querySelector("img");
    image.removeAttribute("src");
    slot.querySelector(".selected-library-image span").textContent = "";
    slot.querySelector(".remove-library-image").classList.add("hidden");
}

function validateQuestionContent() {
    let valid = true;
    questionList.querySelectorAll(".question-card").forEach(card => {
        const questionInput = card.querySelector(".question-text-control input");
        const questionHasImage = Boolean(
            card.querySelector(".question-fields .library-image-slot").dataset.itemId
        );
        questionInput.setCustomValidity(
            questionInput.value.trim() || questionHasImage
                ? ""
                : "Enter question text or choose a question image."
        );
        if (!questionInput.checkValidity()) valid = false;

        card.querySelectorAll(".answer-choice").forEach(choice => {
            const answerInput = choice.querySelector(".answer-text-control input");
            const answerHasImage = Boolean(choice.querySelector(".library-image-slot").dataset.itemId);
            answerInput.setCustomValidity(
                answerInput.value.trim() || answerHasImage
                    ? ""
                    : "Enter answer text or choose an answer image."
            );
            if (!answerInput.checkValidity()) valid = false;
        });
    });
    return valid;
}

function collectQuestions() {
    return Array.from(
        questionList.querySelectorAll(".question-card")
    ).map(card => ({
        question_text:
            card.querySelector(".question-text-control input").value.trim() || null,
        question_item_id:
            Number(
                card.querySelector(".question-fields .library-image-slot")
                    .dataset.itemId
            ) || null,
        choices: Array.from(
            card.querySelectorAll(".answer-choice")
        ).map(choice => ({
            answer_text:
                choice.querySelector(".answer-text-control input").value.trim() || null,
            answer_item_id:
                Number(choice.querySelector(".library-image-slot").dataset.itemId) || null,
            is_correct:
                choice.querySelector('input[type="radio"]').checked
        }))
    }));
}

async function getRegularUser() {
    const { data, error } = await db.auth.getSession();
    const user = data?.session?.user;
    if (error || !user || user.is_anonymous) return null;
    return user;
}

async function initializeLibrary() {
    await loadCategories(libraryCategory);
    libraryCategory.querySelector('option[value=""]')?.remove();
    libraryCategory.innerHTML = `
        <option value="browse-by-tag">
            All Categories (Filter by Tags)
        </option>
    ` + libraryCategory.innerHTML;
    await loadTags(libraryTags, refreshLibraryItems);
    await refreshLibraryItems();
}

function renderSavedSets() {
    savedClaimGridSetSelect.innerHTML =
        '<option value="">Choose a saved set</option>';

    savedClaimGridSets.forEach(set => {
        const option = document.createElement("option");
        option.value = String(set.id);
        option.textContent = set.name;
        savedClaimGridSetSelect.appendChild(option);
    });

    editClaimGridSetBtn.disabled = true;
    shareClaimGridSetBtn.disabled = true;
    deleteClaimGridSetBtn.disabled = true;
}

async function loadSavedSets() {
    savedSetsMessage.textContent = "";

    if (!(await getRegularUser())) {
        savedClaimGridSets = [];
        renderSavedSets();
        savedSetsCount.textContent = "Log in to view and save sets.";
        savedClaimGridSetSelect.disabled = true;
        return;
    }

    savedClaimGridSetSelect.disabled = false;
    const [setResult, freeLimit, isPremium] = await Promise.all([
        dbGetMyClaimGridSets(),
        dbGetFreeSavedGameLimit(),
        dbUserHasPremium()
    ]);

    if (setResult.error) {
        savedSetsMessage.textContent = "Saved sets could not be loaded.";
        return;
    }

    savedClaimGridSets = setResult.data;
    renderSavedSets();
    savedSetsCount.textContent = isPremium
        ? `${savedClaimGridSets.length} saved — Premium has no set limit.`
        : `${savedClaimGridSets.length} of ${freeLimit} saved`;
}

async function loadSelectedSet() {
    savedSetsMessage.textContent = "";
    const set = savedClaimGridSets.find(
        row => String(row.id) === savedClaimGridSetSelect.value
    );
    if (!set) return;

    editingClaimGridSetId = null;

    savedClaimGridSetSelect.disabled = true;
    savedSetsMessage.textContent = "Loading saved set...";
    const result = await dbGetClaimGridSetDetails(set.id);
    savedClaimGridSetSelect.disabled = false;

    if (result.error || !result.data) {
        savedSetsMessage.textContent = "The saved set could not be loaded.";
        return;
    }

    document.getElementById("gameName").value = set.name;
    teamCountSelect.value = String(set.team_count);
    document.getElementById("gameDuration").value = String(
        set.game_duration_minutes || 10
    );
    renderTeamColorControls();
    Array.from(teamColorControls.querySelectorAll('input[type="color"]'))
        .forEach((input, index) => {
            input.value = set.team_colors[index] || defaultTeamColors[index];
            input.defaultValue = input.value;
        });

    questionList.innerHTML = "";
    questionSequence = 0;
    const imageMap = new Map(
        result.data.imageItems.map(item => [Number(item.id), item])
    );

    result.data.questions.forEach(question => {
        questionSequence += 1;
        questionList.insertAdjacentHTML("beforeend", questionMarkup(questionSequence));
        const card = questionList.lastElementChild;
        card.querySelector(".question-text-control input").value =
            question.question_text || "";
        if (question.question_item_id) {
            displayImageInSlot(
                card.querySelector(".question-fields .library-image-slot"),
                imageMap.get(Number(question.question_item_id))
            );
        }

        const choices = result.data.choices.filter(
            choice => choice.question_id === question.id
        );
        const answers = card.querySelector(".answers-list");
        answers.innerHTML = choices
            .map((choice, index) => answerMarkup(index + 1))
            .join("");

        choices.forEach((choice, index) => {
            const choiceElement = answers.children[index];
            choiceElement.querySelector(".answer-text-control input").value =
                choice.answer_text || "";
            choiceElement.querySelector('input[type="radio"]').checked =
                choice.is_correct === true;
            if (choice.answer_item_id) {
                displayImageInSlot(
                    choiceElement.querySelector(".library-image-slot"),
                    imageMap.get(Number(choice.answer_item_id))
                );
            }
        });
    });

    renumberEditor();
    questionEditor.classList.add("hidden");
    continueBtn.textContent = "Show Questions";
    createSavedClaimGridRoomBtn.classList.remove("hidden");
    savedSetsMessage.textContent = `Loaded “${set.name}”.`;
    setupForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectedSavedSet() {
    return savedClaimGridSets.find(
        row => String(row.id) === savedClaimGridSetSelect.value
    );
}

function editSelectedSet() {
    const set = selectedSavedSet();
    if (!set) return;

    editingClaimGridSetId = Number(set.id);
    editClaimGridSetBtn.disabled = true;
    questionEditor.classList.remove("hidden");
    savedSetsMessage.textContent =
        "Make your changes, then click Save Claim the Grid Set.";
    setupForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function shareSelectedSet() {
    const set = selectedSavedSet();
    if (!set) return;

    shareClaimGridSetBtn.disabled = true;
    shareClaimGridSetBtn.textContent = "Creating Link...";
    const result = await dbEnableClaimGridSetSharing(set.id);
    shareClaimGridSetBtn.disabled = false;
    shareClaimGridSetBtn.textContent = "Create Share Link";

    if (result.error || !result.data) {
        savedSetsMessage.textContent =
            result.error?.message || "The share link could not be created.";
        return;
    }

    const shareUrl = new URL(window.location.href);
    shareUrl.search = "";
    shareUrl.hash = "";
    shareUrl.searchParams.set("set", result.data);

    try {
        await navigator.clipboard.writeText(shareUrl.toString());
        savedSetsMessage.textContent = "Share link copied.";
    } catch (error) {
        window.prompt("Copy this Claim the Grid link:", shareUrl.toString());
        savedSetsMessage.textContent = "Share link created.";
    }
}

async function deleteSelectedSet() {
    const set = selectedSavedSet();
    if (!set || !window.confirm(`Delete “${set.name}”?`)) return;

    deleteClaimGridSetBtn.disabled = true;
    const result = await dbDeleteClaimGridSet(set.id);
    if (result.error) {
        savedSetsMessage.textContent =
            result.error.message || "The saved set could not be deleted.";
        deleteClaimGridSetBtn.disabled = false;
        return;
    }

    editingClaimGridSetId = null;
    setupForm.reset();
    savedSetsMessage.textContent = "Claim the Grid Set deleted.";
    await loadSavedSets();
}

async function loadSharedSet() {
    const slug = new URLSearchParams(window.location.search).get("set");
    if (!slug) return;

    const result = await dbGetSharedClaimGridSet(slug);
    if (result.error || !result.data) {
        savedSetsMessage.textContent = "This shared Claim the Grid Set is unavailable.";
        return;
    }

    savedClaimGridSets = [result.data.set];
    renderSavedSets();
    savedClaimGridSetSelect.value = String(result.data.set.id);
    await loadSelectedSet();
    editClaimGridSetBtn.disabled = true;
    shareClaimGridSetBtn.disabled = true;
    deleteClaimGridSetBtn.disabled = true;
    savedSetsMessage.textContent = `Shared set “${result.data.set.name}” loaded.`;
}

function currentGameValues() {
    return {
        name: document.getElementById("gameName").value.trim(),
        teamCount: Number(teamCountSelect.value),
        gameDurationMinutes: Number(document.getElementById("gameDuration").value),
        teamColors: Array.from(
            teamColorControls.querySelectorAll('input[type="color"]')
        ).map(input => input.value),
        questions: collectQuestions(),
        setId: selectedSavedSet()?.id || null
    };
}

async function createGameRoom() {
    questionMessage.textContent = "";
    if (!setupForm.reportValidity()) {
        setupForm.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }
    if (!teamColorsAreUnique()) {
        questionMessage.textContent = "Choose a different color for each team.";
        return;
    }
    if (questionList.children.length < 3) {
        questionMessage.textContent =
            "Add at least 3 questions before creating a game room.";
        return;
    }
    if (!validateQuestionContent() || !questionForm.reportValidity()) return;
    if (!(await getRegularUser())) {
        questionMessage.textContent =
            "Log in or create a free account to create a game room.";
        return;
    }

    const roomButtons = [createClaimGridRoomBtn, createSavedClaimGridRoomBtn];
    roomButtons.forEach(button => {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = "Creating Room...";
    });
    const values = currentGameValues();
    const result = await dbCreateClaimGridSession(values);
    roomButtons.forEach(button => {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
    });

    if (result.error || !result.data) {
        questionMessage.textContent =
            result.error?.message || "The Claim the Grid room could not be created.";
        return;
    }

    const session = Array.isArray(result.data) ? result.data[0] : result.data;
    const lobbyUrl = new URL("claimthegrid-teacher.html", window.location.href);
    lobbyUrl.searchParams.set("session", session.id);
    window.location.href = lobbyUrl.toString();
}

setupForm.addEventListener("submit", event => {
    event.preventDefault();
    setupMessage.textContent = "";
    if (!setupForm.reportValidity()) return;
    if (!teamColorsAreUnique()) {
        setupMessage.textContent = "Choose a different color for each team.";
        return;
    }
    while (questionList.children.length < 3) addQuestion();
    questionEditor.classList.remove("hidden");
    questionEditor.scrollIntoView({ behavior: "smooth", block: "start" });
});

setupForm.addEventListener("reset", () => {
    editingClaimGridSetId = null;
    window.setTimeout(() => {
        setupMessage.textContent = "";
        questionMessage.textContent = "";
        questionEditor.classList.add("hidden");
        questionList.innerHTML = "";
        questionSequence = 0;
        continueBtn.textContent = "Continue to Questions";
        createSavedClaimGridRoomBtn.classList.add("hidden");
        renderTeamColorControls();
    }, 0);
});

questionList.addEventListener("click", event => {
    const card = event.target.closest(".question-card");
    if (!card) return;
    if (event.target.classList.contains("add-answer-button")) {
        const answers = card.querySelector(".answers-list");
        if (answers.children.length < 4) {
            answers.insertAdjacentHTML("beforeend", answerMarkup(answers.children.length + 1));
            renumberEditor();
        }
    } else if (event.target.classList.contains("remove-answer-button")) {
        const answers = card.querySelector(".answers-list");
        if (answers.children.length > 2) event.target.closest(".answer-choice").remove();
        renumberEditor();
    } else if (event.target.classList.contains("delete-question-button")) {
        if (questionList.children.length > 1) card.remove();
        renumberEditor();
    } else if (event.target.classList.contains("choose-library-button")) {
        openLibrary(event.target.closest(".library-image-slot"));
    } else if (event.target.classList.contains("remove-library-image")) {
        removeImage(event.target.closest(".library-image-slot"));
    }
});

questionList.addEventListener("input", event => event.target.setCustomValidity?.(""));
addQuestionBtn.addEventListener("click", addQuestion);
teamCountSelect.addEventListener("change", renderTeamColorControls);
backToSetupBtn.addEventListener("click", () => setupForm.scrollIntoView({ behavior: "smooth" }));
closeLibraryBtn.addEventListener("click", closeLibrary);
libraryModal.addEventListener("click", event => {
    if (event.target === libraryModal) closeLibrary();
});
libraryCategory.addEventListener("change", refreshLibraryItems);
librarySearch.addEventListener("input", () => {
    libraryVisibleItemCount = 10;
    renderLibraryItems();
});

questionForm.addEventListener("submit", async event => {
    event.preventDefault();
    questionMessage.textContent = "";
    questionMessage.classList.remove("success-message");

    if (!setupForm.reportValidity()) {
        setupForm.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    if (!teamColorsAreUnique()) {
        questionMessage.textContent = "Choose a different color for each team.";
        setupForm.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    if (questionList.children.length < 3) {
        questionMessage.textContent =
            "Add at least 3 questions before saving this set.";
        return;
    }
    if (!validateQuestionContent() || !questionForm.reportValidity()) return;

    if (!(await getRegularUser())) {
        questionMessage.textContent =
            "Log in or create a free account to save Claim the Grid Sets.";
        return;
    }

    saveClaimGridSetBtn.disabled = true;
    saveClaimGridSetBtn.textContent = "Saving...";

    const updatingExistingSet = editingClaimGridSetId !== null;
    const result = await dbSaveClaimGridSet({
        setId: editingClaimGridSetId,
        name: document.getElementById("gameName").value.trim(),
        teamCount: Number(teamCountSelect.value),
        gameDurationMinutes: Number(document.getElementById("gameDuration").value),
        teamColors: Array.from(
            teamColorControls.querySelectorAll('input[type="color"]')
        ).map(input => input.value),
        questions: collectQuestions()
    });

    saveClaimGridSetBtn.disabled = false;
    saveClaimGridSetBtn.textContent = "Save Claim the Grid Set";

    if (result.error) {
        questionMessage.textContent =
            result.error.message || "The Claim the Grid Set could not be saved.";
        return;
    }

    questionMessage.classList.add("success-message");
    questionMessage.textContent = updatingExistingSet
        ? "Claim the Grid Set updated successfully."
        : "Claim the Grid Set saved successfully.";
    editingClaimGridSetId = null;
    await loadSavedSets();
});

savedClaimGridSetSelect.addEventListener("change", async () => {
    const hasSelection = Boolean(savedClaimGridSetSelect.value);
    editClaimGridSetBtn.disabled = !hasSelection;
    shareClaimGridSetBtn.disabled = !hasSelection;
    deleteClaimGridSetBtn.disabled = !hasSelection;
    if (hasSelection) {
        await loadSelectedSet();
    } else {
        setupForm.reset();
    }
});
editClaimGridSetBtn.addEventListener("click", editSelectedSet);
shareClaimGridSetBtn.addEventListener("click", shareSelectedSet);
deleteClaimGridSetBtn.addEventListener("click", deleteSelectedSet);
createClaimGridRoomBtn.addEventListener("click", createGameRoom);
createSavedClaimGridRoomBtn.addEventListener("click", createGameRoom);
openClaimGridSetupBtn.addEventListener("click", showTeacherSetup);

async function initializePage() {
    renderTeamColorControls();
    await Promise.all([
        initializeLibrary(),
        loadSavedSets()
    ]);
    const hasSharedSet = new URLSearchParams(window.location.search).has("set");
    if (hasSharedSet) showTeacherSetup();
    await loadSharedSet();
}

initializePage();
