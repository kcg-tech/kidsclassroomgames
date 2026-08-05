// HTML ELEMENTS
const board = document.getElementById('board');
const userInputs = document.getElementById('user-inputs');
const createBtn = document.getElementById('create-btn');
const submitBtn = document.getElementById('submit');
const startGameBtn = document.getElementById("start-btn");
const presetSelect = document.getElementById("preset").value;
const columnContainer = document.getElementById("column-container")
const modal = document.getElementById("question-modal");
const modalContent = document.getElementById('question-content');


let currentQuestion = null;
let showingAnswer = null;
let currentScoreCell = null;


//DATA STRUCTURE
const savedData = [

{Name: 'countries', Items:[{category:"Asia", 
    questions:[{score:100, 
                question:"Largest land animal?", 
                answer:"Elephant",
                used: false
               }, 
               {score:200, 
                question:"King of jungle?", 
                answer:"Lion",
                used: false
               },
               {score:300, 
                question:"Long neck?", 
                answer:"Giraffe",
                used: false
               }
              ]
},
{category:"FARM",
    questions:[{score:100, 
                question:"black and white", 
                answer:"cow",
                used: false
               },
               {score:200, 
                question:"eggs", 
                answer:"chicken",
                used: false
               },
               {score:300, 
                question:"7 + 5", 
                answer:"12",
                used: false
               }
              ]
}]},
{Name: 'Animal', Items:[{category:" SAVANNA", 
    questions:[{score:100, 
                question:"Largest land animal?", 
                answer:"Elephant",
                used: false
               }, 
               {score:200, 
                question:"King of jungle?", 
                answer:"Lion",
                used: false
               },
               {score:300, 
                question:"Long neck?", 
                answer:"Giraffe",
                used: false
               }
              ]
},
{category:"FARM",
    questions:[{score:100, 
                question:"black and white", 
                answer:"cow",
                used: false
               },
               {score:200, 
                question:"eggs", 
                answer:"chicken",
                used: false
               },
               {score:300, 
                question:"7 + 5", 
                answer:"12",
                used: false
               }
              ]
}]}
];

// USER DATA INPUT
const userDataInput = [];

// CREATE BUTTON
createBtn.addEventListener("click", ()=> {
    userInputs.classList.toggle("hidden");

    if(userInputs.classList.contains("hidden")){
    createBtn.textContent = "Create Board";
    
    } else {
    createBtn.textContent = "Close Editor";
    createColumns();
    }
});

// CREATE USER INPUT

function createColumns (){
    columnContainer.innerHTML = "";

    for (let col= 1; col <= 6; col++){
        const column = document.createElement("div");
        column.className = "column";
        
        //CATEGORIES
        
        const categoryLabel = document.createElement("label");
        categoryLabel.textContent = `Category ${col}`;

        const categoryInput = document.createElement("input");
        categoryInput.type = "text";
        categoryInput.id = `category-${col}`;

        column.appendChild(categoryLabel);
        column.appendChild(categoryInput);

        for (let row=1; row<=5; row ++){

            //QUESTIONS

            const qLabel = document.createElement("label");
            qLabel.textContent = `Question ${row}`;
            
            const qImg = document.createElement("input");
            qImg.type = "file";
            qImg.id = `question-${col}-${row}-img`;

            const qText = document.createElement("input");
            qText.type = "text";
            qText.id = `question-${col}-${row}`;

            column.appendChild(qLabel);
            column.appendChild(qImg);
            column.appendChild(qText);

            //ANSWERS

            const aLabel = document.createElement("label");
            aLabel.textContent = `Answer ${row}`;
            
            const aImg = document.createElement("input");
            aImg.type = "file";
            aImg.id = `answer-${col}-${row}-img`;

            const aText = document.createElement("input");
            aText.type = "text";
            aText.id = `answer-${col}-${row}`;

            column.appendChild(aLabel);
            column.appendChild(aImg);
            column.appendChild(aText);

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

// GET USER DATA
submitBtn.addEventListener("click", getUserInput);

async function getUserInput(){
    

        userDataInput.length = 0;
        
        for (let col = 1;col <=6; col++){

            const category = {
            category: document.getElementById(`category-${col}`).value,
            questions: []
            };

        

            for (let row = 1; row <=5; row++){

                const question = document.getElementById(`question-${col}-${row}`).value;
                const answer = document.getElementById(`answer-${col}-${row}`).value;
                const score = document.getElementById(`score-${col}-${row}`).value;

                const qImgFile = document.getElementById(`question-${col}-${row}-img`).files[0];
                let qImg = null;
                if (qImgFile) {
                    qImg = await fileToBase64(qImgFile)
                }

                const aImgFile = document.getElementById(`answer-${col}-${row}-img`).files[0];
                let aImg = null;
                if (aImgFile) {
                    aImg = await fileToBase64(aImgFile)
                }

                category.questions.push({
                    score: score,
                    question: question,
                    questionImg: qImg,
                    answer: answer,
                    answerImg: aImg,
                    used: false
                })
                
            };
            
        userDataInput.push(category);
        
        };
    localStorage.setItem(
            "categoryClashBoard",
            JSON.stringify(userDataInput)
        );    
   console.log(userDataInput); //REMOVE AFTER DEBUG
   alert("Data has been saved\n click start button to show the board.")
   //open in a new tab???
   // data should not be deleted when the submit button is clicked
   //create delete button so that data can be deleted all at once
};

//TO BE ABLE TO SAVE IMAGES LOCALLY
//CONVERT FILE FIRST

function fileToBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();

        reader.onload = () =>
            resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);
    })
};


//check!!!!!
startGameBtn.addEventListener("click", () => {

    buildBoard();
    buildScoreBoard();

})

function buildBoard() {

    let boardData;

    const selectedPreset =
    document.getElementById("preset").value;

    if (selectedPreset === "select") {

        // use user-created board
        boardData = JSON.parse(
            localStorage.getItem("categoryClashBoard")
        ) || userDataInput;

    } else {

        const found =
        savedData.find(
            item =>
            item.Name.toLowerCase() ===
            selectedPreset.toLowerCase()
        );

        if (!found) {
            alert("Board not found");
            return;
        }

        boardData = found.Items;
    }

    renderBoard(boardData);
};
// ADD CODE TO
// OPEN THE BOARD ON A NEW TAB
// MAYBE BIGGER BOARD? EASIER TO SEE???
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

            scoreCell.addEventListener(
            "click", ()=>{
                if(question.used) return;

                 currentScoreCell = scoreCell;

                showQuestion(question);

    }
);

            board.appendChild(scoreCell);

        });

    }

};




function showQuestion(question) {
    currentQuestion = question;
    showingAnswer = false;

    const content = document.getElementById("question-content");
    modal.classList.remove("hidden");

    if(question.questionImg){

    modalContent.innerHTML = `
        <img src="${question.questionImg}">
        <p>${question.question}</p>
    `;

    }else{

    modalContent.innerHTML = `
        <p>${question.question}</p>
    `;

}
}


modal.addEventListener("click", () => {
   
    if(!currentQuestion) return;

    const content =
    document.getElementById("question-content");

    // First click after opening
    if(!showingAnswer){

        showingAnswer = true;

        if(currentQuestion.answerImg){

    modalContent.innerHTML = `
        <img src="${currentQuestion.answerImg}">
        <p>${currentQuestion.answer}</p>
    `;

    }else{

    modalContent.innerHTML = `
        <p>${currentQuestion.answer}</p>
    `;

}

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

    }

});

// add scores manually to teams
function buildScoreBoard(){

    const scoreboard =
    document.getElementById("scoreboard");

    scoreboard.innerHTML = "";

    const teamCount =
    Number(
    document.getElementById("team-count").value
    );

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


