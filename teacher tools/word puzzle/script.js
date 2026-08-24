// HTML ELEMENTS
const puzzleType = document.getElementById("puzzle-type");
const puzzleItems = document.getElementById("puzzle-items");
const caseSelect = document.getElementById("case-select");
const generateBtn = document.getElementById("generate-btn");
const puzzleContainer = document.getElementById("puzzle-container");


// GENERATE BUTTON
generateBtn.addEventListener("click", generatePuzzle);

// GENERATE PUZZLE
function generatePuzzle() {

      // GET WORDS
  let words = puzzleItems.value
    .split(/,|\n/) // split by comma OR enter
    .map(word => word.trim())
    .filter(word => word !== "");

  if (words.length === 0) {
    alert("Please enter some words.");
    return;
  }

  if (words.length > 15){
    alert("Maximun of 15 words only");
    return;
  }
  if (
      puzzleType.value ===
          "word-search" &&
      words.some(
          word =>
              word.length > 12
      )
  ) {
      alert(
          "Word Search words must be 12 characters or fewer."
      );

      return;
  }
  

  // UPPERCASE / LOWERCASE
  const letterCase = caseSelect.value;

  if (letterCase === "upper") {
    words = words.map(word => word.toUpperCase());
  } else {
    words = words.map(word => word.toLowerCase());
  }

  // CHECK PUZZLE TYPE
  if (puzzleType.value === "select") {
    alert("Please select a puzzle type.");
    return;
  }
  // WORD SEARCH
  if (puzzleType.value === "word-search"){
    generateWordSearch(words, letterCase);
  }

  else if (puzzleType.value === "word-scramble"){
    generateScramble(words, letterCase);
  }
}

function generateWordSearch(words,letterCase) {

    // CLEAR OLD PUZZLE
  puzzleContainer.innerHTML = "";

      // GRID SIZE
  const gridSize = 12; // 

  // CREATE EMPTY GRID
  const grid = [];

  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];

    for (let col = 0; col < gridSize; col++) {
      grid[row][col] = "";
    }
  }

  // PLACE WORDS HORIZONTALLY
  words.forEach(word => {

    let placed = false;

    while (!placed) {

      const row = Math.floor(Math.random() * gridSize);

      const maxStart = gridSize - word.length;

      const col = Math.floor(Math.random() * (maxStart + 1));

      let canPlace = true;

      // CHECK SPACE
      for (let i = 0; i < word.length; i++) {

        if (
          grid[row][col + i] !== "" &&
          grid[row][col + i] !== word[i]
        ) {
          canPlace = false;
          break;
        }
      }

      // PLACE WORD
      if (canPlace) {

        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i];
        }

        placed = true;
      }
    }
  });

  // FILL EMPTY CELLS
  const letters =
    letterCase === "upper"
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : "abcdefghijklmnopqrstuvwxyz";

  for (let row = 0; row < gridSize; row++) {

    for (let col = 0; col < gridSize; col++) {

      if (grid[row][col] === "") {

        const randomLetter =
          letters[Math.floor(Math.random() * letters.length)];

        grid[row][col] = randomLetter;
      }
    }
  }

  // DISPLAY GRID
  puzzleContainer.innerHTML = "";

  puzzleContainer.style.display = "grid";
  puzzleContainer.style.border = "2px solid black";
  puzzleContainer.style.gridTemplateColumns =
    `repeat(${gridSize}, 40px)`;

  grid.forEach(row => {

    row.forEach(letter => {

      const cell = document.createElement("div");

      cell.className = "cell";
      cell.textContent = letter;

      puzzleContainer.appendChild(cell);
    });
  });
 }

function generateScramble(words, letterCase) {


    puzzleContainer.innerHTML = "";
    puzzleContainer.style.display = "block";

    words.forEach(word => {

        const original = word;

        // SCRAMBLE
        const scrambled =
            original
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        // RANDOM HINT LETTER
        const hintIndex =
            Math.floor(Math.random() * original.length);

        let blanks = "";

        for (let i = 0; i < original.length; i++) {

            if (i === hintIndex) {
                blanks += original[i] + " ";
            }

            else {
                blanks += "_ ";
            }
        }

        // ROW
        const row = document.createElement("div");
        row.className = "scramble-row";

        row.innerHTML =
        `
       <span class="scrambled">${scrambled}</span>

        <span class="answer">
            ${blanks}
        </span>
        `;

        puzzleContainer.appendChild(row);

    });
}


