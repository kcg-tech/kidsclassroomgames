
// ! ! Add image upload function


const categorySelect = 
    document.getElementById("presetSelect");
const tagsContainer =
    document.getElementById("tagsContainer");
/*const imageUpload = 
    document.getElementById("image-upload");
 */
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

let revealMode = "manual";
const autoBtn = document.getElementById("auto-btn");
const manualBtn = document.getElementById("manual-btn");
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
const resetBtn = 
    document.getElementById("reset-btn");

let availableItems = [];

let quizItems = [];
let currentIndex = 0;
let revealInterval = null;
let score = 0;



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
startGame
);

async function startGame(){

    const selectedCategoryId =
        categorySelect.value;

    const selectedLanguageId =
    Number(
        languageSelect.value
    );

    const selectedTagIds =
        Array.from(
            document.querySelectorAll(
                '#tagsContainer input:checked'
            )
        )
        .map(
            checkbox =>
                Number(
                    checkbox.value
                )
        );


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

    const count=
    Number(itemCount.value);

    quizItems =
        shuffle(items)
        .slice(
            0,
            Math.min(
                count,
                items.length
            )
        );

    currentIndex=0;

    showQuestion();

    if (
        revealMode === "auto"
    ) {

        startAutoReveal();

    }

    score = 0;

    document
    .getElementById(
    "score-display"
    )
    .textContent =
    "Score: 0";

};

//SHOW QUESTION
function showQuestion(){

    const item =
    quizItems[currentIndex];

    document
    .getElementById(
    "quiz-image"
    )
    .src = item.url; 

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
        availableItems
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

        btn.textContent =
        choices.pop();

        btn.onclick =
        ()=>checkAnswer(
            btn,
            correctAnswer
        );

    });

}

//CHECK ANSWER
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

}else{

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

//COVER GRID
function buildCoverGrid(){

    const grid=
    document.getElementById(
    "cover-grid"
    );

    grid.innerHTML="";

    for(
    let i=0;
    i<36;
    i++
    ){

        const cell=
        document.createElement(
        "div"
        );

        cell.className=
        "cover-cell";

        cell.addEventListener(
        "click",
        ()=>{

            cell.classList
            .add("cover-hidden");

        });

        grid.appendChild(cell);
    }

}

//AUTO REVEAL

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

//MANUAL BUTTON
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

//FINAL SCORE
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

//RESET
resetBtn.addEventListener(
"click",
gameReset
);

async function playAgain(){

    clearInterval(
        revealInterval
    );

    score = 0;
    currentIndex = 0;

    const count =
        Number(
            itemCount.value
        );

    quizItems =
        shuffle(availableItems)
        .slice(
            0,
            Math.min(
                count,
                availableItems.length
            )
        );

    document
    .getElementById(
        "score-display"
    )
    .textContent =
    "Score: 0";

    document
    .getElementById(
        "image-wrapper"
    ).innerHTML =

    `
    <img id="quiz-image">

    <div id="cover-grid"></div>
    `;

    showQuestion();

}


function gameReset(){

    clearInterval(
        revealInterval
    );

    score=0;
    currentIndex=0;
    quizItems=[];

    document.getElementById(
        "image-wrapper"
        ).innerHTML =

        `
        <img id="quiz-image">

        <div id="cover-grid"></div>
        `;

    document.getElementById(
        "score-display"
        ).textContent=
        "Score: 0";

    document.querySelectorAll(
        ".answer-btn"
        ).forEach(btn=>{

        btn.textContent="";
        btn.onclick=null;

    });

    gameArea.classList.add("hidden");

    };


categorySelect.addEventListener(
    "change",
    () =>
        updateSelectedItemsPreview(
            dbGetGuessTheImageItems
        )
);

languageSelect.addEventListener(
    "change",
      () =>
        updateSelectedItemsPreview(
            dbGetGuessTheImageItems
        )
);

async function initialize() {

    populateItemCount(
        itemCount
    );

    await loadCategories(
        categorySelect
    );

    await loadTags(
        tagsContainer
    );

    await loadLanguages(
        languageSelect
    );

    await updateSelectedItemsPreview(
        dbGetGuessTheImageItems
    );

}

initialize();

