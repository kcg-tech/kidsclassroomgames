
const categorySelect = 
    document.getElementById("presetSelect");

const tagsContainer =
    document.getElementById("tagsContainer");

const itemCount = 
    document.getElementById("item-count");
const selectedItemsList =
    document.getElementById(
        "selectedItemsList"
    );

const selectedItemsCount =
    document.getElementById(
        "selectedItemsCount"
    );

const itemSelectionModeInputs =
    document.querySelectorAll(
        'input[name="itemSelectionMode"]'
    );

const randomItemCountControl =
    document.getElementById(
        "random-item-count-control"
    );

const specificSelectionControls =
    document.getElementById(
        "specific-selection-controls"
    );

const itemListHeading =
    document.getElementById(
        "item-list-heading"
    );

const selectAllItemsBtn =
    document.getElementById(
        "select-all-items-btn"
    );

const clearSelectedItemsBtn =
    document.getElementById(
        "clear-selected-items-btn"
    );

const setupPage =
    document.getElementById("setup-page");

const startPlayBtn =
    document.getElementById("start-play-btn");

const closeGameBtn =
    document.getElementById(
        "close-game-btn"
    );

let revealMode = "manual";
let savedGameSetup = null;

const autoBtn = 
    document.getElementById("auto-btn");
const manualBtn = 
    document.getElementById("manual-btn");
const languageSelect =
    document.getElementById(
        "languageSelect"
    );
const gameArea =
    document.getElementById(
        "game-area"
    );
const startBtn = 
    document.getElementById("start-btn");

let availableItems = [];
let quizItems = [];
let itemSelectionMode = "random";

const selectedSpecificItemIds =
    new Set();
let currentIndex = 0;
let revealInterval = null;
let score = 0;

function renderGuessItemsPreview() {
    selectedItemsList.innerHTML = "";

    const displayedCount =
        itemSelectionMode === "specific"
            ? selectedSpecificItemIds.size
            : availableItems.length;

    selectedItemsCount.textContent =
        displayedCount;

    availableItems.forEach(item => {
        const card =
            document.createElement(
                itemSelectionMode === "specific"
                    ? "button"
                    : "div"
            );

        card.className =
            "preview-item";

        if (
            itemSelectionMode ===
            "specific"
        ) {
            card.type = "button";

            card.classList.add(
                "selectable-preview-item"
            );

            const isSelected =
                selectedSpecificItemIds.has(
                    item.id
                );

            card.classList.toggle(
                "selected-item",
                isSelected
            );

            card.setAttribute(
                "aria-pressed",
                String(isSelected)
            );

            card.addEventListener(
                "click",
                () => {
                    if (
                        selectedSpecificItemIds
                            .has(item.id)
                    ) {
                        selectedSpecificItemIds
                            .delete(item.id);
                    } else {
                        selectedSpecificItemIds
                            .add(item.id);
                    }

                    renderGuessItemsPreview();
                }
            );
        }

        const image =
            document.createElement("img");

        image.src = item.url;
        image.alt = item.name;

        image.addEventListener(
            "error",
            () => {
                image.remove();
            }
        );

        const name =
            document.createElement("div");

        name.textContent =
            item.name;

        card.appendChild(image);
        card.appendChild(name);

        selectedItemsList.appendChild(
            card
        );
    });
}

async function updateGuessItemsPreview() {
   
    const selectedCategoryId =
        categorySelect.value;

    const selectedTagIds =
        Array.from(
            document.querySelectorAll(
                "#tagsContainer input:checked"
            )
        )
        .map(
            checkbox =>
                Number(
                    checkbox.value
                )
        );

    const selectedLanguageId =
        Number(
            languageSelect.value
        );

        if (!selectedCategoryId) {
            availableItems = [];
            selectedSpecificItemIds.clear();

            selectedItemsCount.textContent = "0";
            selectedItemsList.innerHTML =
                "<p>Please choose a category.</p>";

            return;
        }

        if (
            selectedCategoryId === "browse-by-tag" &&
            selectedTagIds.length === 0
        ) {
            availableItems = [];
            selectedSpecificItemIds.clear();

            selectedItemsCount.textContent = "0";
            selectedItemsList.innerHTML =
                "<p>Select at least one tag to show items.</p>";

            return;
        }        

    availableItems =
        await dbGetGuessTheImageItems(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

    selectedSpecificItemIds.clear();

    renderGuessItemsPreview();
}

autoBtn.addEventListener(
    "click",
    () => {

        revealMode = "auto";
        autoBtn.classList.add(
            "selected"
        );

        manualBtn.classList.remove(
            "selected"
        );

    }
);

manualBtn.addEventListener(
    "click",
    () => {

        revealMode = "manual";

        manualBtn.classList.add(
            "selected"
        );

        autoBtn.classList.remove(
            "selected"
        );


        clearInterval(
            revealInterval
        );

    }
);

startBtn.addEventListener(
    "click",
    openGameWindow
);

function openGameWindow() {
    const selectedCategoryId =
        categorySelect.value;

    const selectedLanguageId =
        Number(languageSelect.value);

    const selectedTagIds =
        Array.from(
            document.querySelectorAll(
                "#tagsContainer input:checked"
            )
        )
        .map(checkbox =>
            Number(checkbox.value)
        );

    if (!selectedCategoryId) {
        alert("Please choose a category.");
        return;
    }

    if (
        selectedCategoryId === "browse-by-tag" &&
        selectedTagIds.length === 0
    ) {
        alert("Please select at least one tag.");
        return;
    }

    if (availableItems.length < 3) {
        alert(
            "At least three items are required to play."
        );
        return;
    }

    if (
        itemSelectionMode === "specific" &&
        selectedSpecificItemIds.size < 3
    ) {
        alert(
            "Please select at least three items."
        );
        return;
    }

    const setupId =
        `guess-image-${Date.now()}`;

    const gameSetup = {
        categoryId: selectedCategoryId,
        languageId: selectedLanguageId,
        tagIds: selectedTagIds,
        selectionMode: itemSelectionMode,
        itemCount: Number(itemCount.value),
        selectedItemIds:
            Array.from(selectedSpecificItemIds)
    };

    localStorage.setItem(
        setupId,
        JSON.stringify(gameSetup)
    );

    const gameUrl =
        `${window.location.pathname}` +
        `?mode=play&setup=${encodeURIComponent(setupId)}`;

    window.open(gameUrl, "_blank");
}

async function startGame(){

    if (!savedGameSetup) {
        alert(
            "The game setup could not be found."
        );
        return;
    }

    const selectedCategoryId =
        savedGameSetup.categoryId;

    const selectedLanguageId =
        Number(savedGameSetup.languageId);

    const selectedTagIds =
        savedGameSetup.tagIds || [];

    score = 0;
    currentIndex = 0;
   
    const items =
        await dbGetGuessTheImageItems(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

    availableItems = items;

    if (items.length === 0) {

    alert(
        "No items matched the selected filters."
    );

    return;

    }

    gameArea.classList.remove("hidden");

    gameArea.scrollIntoView({
        
        block: "start"
    });

     document.getElementById(
        "image-wrapper"
        ).innerHTML =

        `
        <img id="quiz-image">

        <div id="cover-grid"></div>
        `;

        let playableItems = items;

        if (
            savedGameSetup.selectionMode ===
            "specific"
        ) {
            const selectedIds =
                new Set(
                    savedGameSetup.selectedItemIds.map(
                        id => String(id)
                    )
                );

            playableItems =
                items.filter(item =>
                    selectedIds.has(
                        String(item.id)
                    )
                );
        }

        const uniquePlayableItems =
            playableItems.filter(
                (item, index, allItems) => {
                    if (
                        !item.name ||
                        item.name ===
                            "(No Translation)"
                    ) {
                        return false;
                    }

                    return (
                        allItems.findIndex(
                            otherItem =>
                                otherItem.name ===
                                item.name
                        ) === index
                    );
                }
            );

        if (uniquePlayableItems.length < 3) {
            alert(
                "This game needs at least three items with different answers."
            );

            return;
        }

        const count =
            savedGameSetup.selectionMode ===
            "specific"
                ? uniquePlayableItems.length
                : Number(savedGameSetup.itemCount);

        quizItems =
            shuffle(uniquePlayableItems)
                .slice(
                    0,
                    Math.min(
                        count,
                        playableItems.length
                    )
                );

    currentIndex=0;

    showQuestion();

    startPlayBtn.textContent =
        "RESET GAME";

    startPlayBtn.classList.add(
        "reset-game"
    );

    score = 0;

    document
    .getElementById(
    "score-display"
    )
    .textContent =
    "Score: 0";

};

function showQuestion(){

    const item =
    quizItems[currentIndex];

    const quizImage =
        document.getElementById(
            "quiz-image"
        );

    quizImage.alt =
        "Image to guess";

    quizImage.addEventListener(
        "error",
        () => {
            clearInterval(revealInterval);

            const imageWrapper =
                document.getElementById(
                    "image-wrapper"
                );

            imageWrapper.innerHTML = `
                <div class="image-error-message">
                    <h2>Image unavailable</h2>
                    <p>
                        This image could not be loaded.
                        You may choose an answer or reset the game.
                    </p>
                </div>
            `;

            enableAnswerButtons();
        },
        { once: true }
    );

    quizImage.src = item.url;

    buildCoverGrid();

    buildAnswerButtons(
        item.name
    );

    if (
        revealMode === "auto"
    ) {

        startAutoReveal();

    }

};

//ANSWER CHOICES
function buildAnswerButtons(correctAnswer){

    const buttons =
    document.querySelectorAll(
    ".answer-btn"
    );

    const wrongAnswers =
    shuffle(
        quizItems
        .filter(
            item =>
            item.name !==
            correctAnswer
        )
    )
    .slice(0,2)
    .map(
        item=>item.name
    );

    const choices =
    shuffle([
        correctAnswer,
        ...wrongAnswers
    ]);



    buttons.forEach(
    btn=>{

        btn.classList.remove(
        "correct",
        "wrong"
        );

        btn.disabled = true;
        btn.textContent =
        choices.pop();

        btn.onclick =
        ()=>checkAnswer(
            btn,
            correctAnswer
        );

    });

}

function checkAnswer(
    button,
    correctAnswer
){

    const chosen =
    button.textContent;

    const allButtons =
    document.querySelectorAll(
    ".answer-btn"
    );

    if (button.disabled) {
        return;
    }

    allButtons.forEach(btn => {
        btn.disabled = true;
    });

    if(
        quizItems.length === 0
    )return;

    if(
        chosen === correctAnswer
    ){

        score++;


        document
        .getElementById(
        "score-display"
        )
        .innerHTML =
        `Score: ${score}`;

        button.classList
        .add(
        "correct"
        );

    } else{

        button.classList
        .add(
        "wrong"
        );

        allButtons.forEach(
        btn=>{

            if(
            btn.textContent
            === correctAnswer
            ){

            btn.classList
            .add(
            "correct");

            }

        });

    }


    setTimeout(()=>{

        currentIndex++;

        if(
        currentIndex
        <
        quizItems.length
        ){

        showQuestion();

        }else{

        showFinalScore();

        }

    },1000);

}

function enableAnswerButtons() {
    document
        .querySelectorAll(".answer-btn")
        .forEach(button => {
            button.disabled = false;
        });
}

function buildCoverGrid(){

    const grid=
    document.getElementById(
    "cover-grid"
    );

    grid.innerHTML="";

    for(
    let i=0; i<36; i++
    ){

        const cell =
            document.createElement(
                "button"
            );

        cell.type = "button";
        cell.setAttribute(
            "aria-label",
            `Reveal image section ${i + 1}`
        );

        cell.className=
        "cover-cell";

        cell.addEventListener(
        "click",
        ()=>{

            cell.classList
            .add("cover-hidden");
            enableAnswerButtons();
        });

        grid.appendChild(cell);
    }

}

document
.getElementById(
"auto-btn"
)
.addEventListener(
"click",
startAutoReveal
);

function startAutoReveal(){

    clearInterval(
    revealInterval
    );

    revealInterval=
    setInterval(()=>{

        const cells=
        document.querySelectorAll(
        ".cover-cell:not(.cover-hidden)"
        );

        enableAnswerButtons()

        if(
        cells.length===0
        ){

            clearInterval(
            revealInterval
            );

            return;
        }

        const random=
        cells[
        Math.floor(
        Math.random()
        *
        cells.length
        )
        ];

        random.classList
        .add(
        "cover-hidden"
        );

    },1000);

}

document
.getElementById(
"manual-btn"
)
.addEventListener(
"click",
()=>{

clearInterval(
revealInterval
);

});

function showFinalScore(){

    const wrapper =
    document.getElementById(
        "image-wrapper"
    );

    wrapper.innerHTML =

    `
    <h1>GAME OVER</h1>

    <h2>
        Score:
        ${score}
        /
        ${quizItems.length}
    </h2>

    <button id="play-again-btn">
        Play Again
    </button>
    `;

    // Disable answer buttons
    document
    .querySelectorAll(".answer-btn")
    .forEach(btn => {

        btn.textContent = "";

        btn.onclick = null;

        btn.classList.remove(
            "correct",
            "wrong"
        );

    });

    document
    .getElementById(
        "play-again-btn"
    )
    .addEventListener(
        "click",
        playAgain
    );

}

function playAgain() {
    clearInterval(revealInterval);

    score = 0;
    currentIndex = 0;
    quizItems = [];

    startPlayBtn.textContent =
        "START GAME";

    startPlayBtn.classList.remove(
        "reset-game"
    );

    document.getElementById(
        "score-display"
    ).textContent = "Score: 0";

    document.getElementById(
        "image-wrapper"
    ).innerHTML = `
        <div class="start-game-message">
            <h2>Ready to play again?</h2>
            <p>Click START GAME to begin.</p>
        </div>
    `;

    document
        .querySelectorAll(".answer-btn")
        .forEach(button => {
            button.textContent = "";
            button.disabled = true;

            button.classList.remove(
                "correct",
                "wrong"
            );
        });
}

categorySelect.addEventListener(
    "change",
    updateGuessItemsPreview
);

languageSelect.addEventListener(
    "change",
    updateGuessItemsPreview
);

itemSelectionModeInputs.forEach(input => {
    input.addEventListener("change", event => {
        itemSelectionMode =
            event.target.value;

        const choosingSpecificItems =
            itemSelectionMode === "specific";

        randomItemCountControl.classList.toggle(
            "hidden",
            choosingSpecificItems
        );

        specificSelectionControls.classList.toggle(
            "hidden",
            !choosingSpecificItems
        );

        itemListHeading.textContent =
            choosingSpecificItems
                ? "Selected Items"
                : "Available Items";

        selectedSpecificItemIds.clear();
        renderGuessItemsPreview();
    });
});

selectAllItemsBtn.addEventListener(
    "click",
    () => {
        availableItems.forEach(item => {
            selectedSpecificItemIds.add(item.id);
        });

        renderGuessItemsPreview();
    }
);

clearSelectedItemsBtn.addEventListener(
    "click",
    () => {
        selectedSpecificItemIds.clear();
        renderGuessItemsPreview();
    }
);

startPlayBtn.addEventListener(
    "click",
    startGame
);

closeGameBtn.addEventListener(
    "click",
    () => {
        window.close();

        setTimeout(() => {
            if (!window.closed) {
                window.location.href =
                    window.location.pathname;
            }
        }, 200);
    }
);

function initializePlayPage() {
    const params =
        new URLSearchParams(
            window.location.search
        );

    if (params.get("mode") !== "play") {
        return false;
    }

    const setupId =
        params.get("setup");

    const savedSetup =
        setupId
            ? localStorage.getItem(setupId)
            : null;

    if (!savedSetup) {
        alert(
            "This game setup could not be found. Please return to the setup page."
        );

        return true;
    }

    try {
        savedGameSetup =
            JSON.parse(savedSetup);
    } catch (error) {
        console.error(
            "Could not read game setup:",
            error
        );

        alert(
            "This game setup could not be opened."
        );

        return true;
    }

    document.body.classList.add("play-mode");


    setupPage.classList.add("hidden");
    gameArea.classList.remove("hidden");

    document.getElementById(
        "image-wrapper"
    ).innerHTML = `
        <div class="start-game-message">
            <h2>Ready to play?</h2>
            <p>Select a reveal mode, then click START GAME.</p>
        </div>
    `;

    document
        .querySelectorAll(".answer-btn")
        .forEach(button => {
            button.textContent = "";
            button.disabled = true;
        });

    return true;
}

async function initialize() {

    if (initializePlayPage()) {
        return;
    }

    populateItemCount(
        itemCount
    );

    await loadCategories(
        categorySelect
    );

    const oldAllCategoriesOption =
        categorySelect.querySelector(
            'option[value=""]'
        );

    if (oldAllCategoriesOption) {
        oldAllCategoriesOption.remove();
    }

    categorySelect.innerHTML = `
        <option value="" selected disabled>
            Choose a Category
        </option>

        <option value="browse-by-tag">
            Browse by Tag (All Categories)
        </option>
    ` + categorySelect.innerHTML;

    await loadTags(
        tagsContainer,
        updateGuessItemsPreview
    );

    await loadLanguages(
        languageSelect
    );

    await updateGuessItemsPreview();

}

initialize();

