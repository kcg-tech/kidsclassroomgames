const board = document.getElementById('board');
const userInputs = document.getElementById('user-inputs');
const createBtn = document.getElementById('create-btn');
const submitBtn = document.getElementById('submit');
const startGameBtn = document.getElementById("start-btn");
const columnContainer = document.getElementById("column-container")
const modal = document.getElementById("question-modal");
const modalContent = document.getElementById('question-content');


let currentQuestion = null;
let showingAnswer = null;
let currentquizCell = null;
let showingReward = false;




//CHECK THE IMAGES!! NOT SHOWING
const rewardList = [

{
type:"score",
value:100,
text:"+100"
},

{
type:"score",
value:200,
text:"+200"
},

{
type:"tornado",
text:"TORNADO",
value:"tornado",
img:"../../images/tornado-game/tornado.png"
},

{
type:"double",
text:"DOUBLE",
value:"double",
img:"../../images/tornado-game/doublepoints.png"
},

{
type:"switch",
text:"SWITCH",
value:"switch",
img:"../../images/tornado-game/switch.jpg"
}

];

// USER DATA INPUT
const userDataInput = [];


// CREATE BUTTON
createBtn.addEventListener("click", ()=> {
    console.log("create");
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

    for (let col= 1; col <= 5; col++){
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
           const sLabel = document.createElement("label");
           sLabel.textContent = "score";
           const sText = document.createElement("select");
            sText.id = `score-${col}-${row}`;

            rewardList.forEach(reward=>{
                const option =
                document.createElement("option");

                option.value = reward.value ?? reward.type;
                //?? means if there is no value use type
                option.textContent = reward.text;
                
                sText.appendChild(option);
            });

            column.appendChild(sLabel);
            column.appendChild(sText);
        }

    columnContainer.appendChild(column)    
    }
    
};

// GET USER DATA
submitBtn.addEventListener("click", getUserInput);

async function getUserInput(e){
    
        e.preventDefault();
        userDataInput.length = 0;
        
        for (let col = 1;col <=5; col++){

            const category = {
            category: document.getElementById(`category-${col}`).value,
            questions: []
            };

        

            for (let row = 1; row <=5; row++){

                const question = 
                document.getElementById(`question-${col}-${row}`).value;
                const answer = 
                document.getElementById(`answer-${col}-${row}`).value;
                const selectedReward = 
                document.getElementById(`score-${col}-${row}`).value;
               
                const reward = rewardList.find(item => {
                const itemValue = item.value !== undefined 
                ? item.value.toString() : item.type;
                return itemValue === selectedReward;
                });

                const qImgFile = 
                document.getElementById(`question-${col}-${row}-img`).files[0];
                
                let qImg = null;
                if (qImgFile) {
                    qImg = await fileToBase64(qImgFile)
                }

                const aImgFile = 
                document.getElementById(`answer-${col}-${row}-img`).files[0];
                
                let aImg = null;
                if (aImgFile) {
                    aImg = await fileToBase64(aImgFile)
                }

                category.questions.push({
                    reward: reward,
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


//BUILD BOARD
startGameBtn.addEventListener("click", () => {

    buildBoard();
    // A D D F U N C T I O N L A T E R ! ! !
   // buildScoreBoard(); 

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
        console.log('data', boardData);
        console.log('length', boardData.length);

    });

   
 // C H E C K ! ! ! !   
    for(let row=0; row<5; row++){

        boardData.forEach(category=>{

            const question =
            category.questions[row];

            const quizCell =
            document.createElement("div");
            
            quizCell.className =
            "quiz-cell";
            
            quizCell.textContent =
            row + 1;
            
            quizCell.addEventListener(
            "click", ()=>{
                if(question.used) return;

                 currentquizCell = quizCell;

                showQuestion(question);

            
                }   
            
            );          

            board.appendChild(quizCell);

        });

    }

};




function showQuestion(question) {
    currentQuestion = question;
    showingAnswer = false;
    showingReward = false;

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
    };

}

function showReward(question){

    const reward = 
    question.reward;

    if(reward.img){
        modalContent.innerHTML =
        `<figure class="reward-container">
        <img src="${reward.img}" class="reward-img">
        <figcaption class="reward-text">${reward.text}</figcaption>  
        </figure>
        `;
    } else {
        modalContent.innerHTML =
        `<h2 class="reward-text">${reward.text}</h2>  `
    }
};

// !! C H E C K 
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

    }

});

