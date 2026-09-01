const ids = id => document.getElementById(id);
const joinCard = ids("joinCard");
const joinClaimGridForm = ids("joinClaimGridForm");
const playerRoomCode = ids("playerRoomCode");
const playerNickname = ids("playerNickname");
const joinClaimGridBtn = ids("joinClaimGridBtn");
const joinMessage = ids("joinMessage");
const playerLobby = ids("playerLobby");
const playerGameName = ids("playerGameName");
const joinedPlayerName = ids("joinedPlayerName");
const joinedTeamNumber = ids("joinedTeamNumber");
const playerTeamBadge = ids("playerTeamBadge");
const playerLobbyMessage = ids("playerLobbyMessage");
const playerGame = ids("playerGame");
const playerQuestionNumber = ids("playerQuestionNumber");
const playerQuestionTimer = ids("playerQuestionTimer");
const playerQuestionContent = ids("playerQuestionContent");
const playerAnswerChoices = ids("playerAnswerChoices");
const playerGameMessage = ids("playerGameMessage");
const playerTerritory = ids("playerTerritory");
const playerTerritoryTimer = ids("playerTerritoryTimer");
const playerTerritoryInstructions = ids("playerTerritoryInstructions");
const playerTerritoryGrid = ids("playerTerritoryGrid");
const playerTerritoryMessage = ids("playerTerritoryMessage");

let currentPlayerId = null;
let currentGameData = null;
let currentBoard = null;
let answerInFlight = false;
let captureInFlight = false;
let nextRefreshAt = 0;

function showOnly(section) {
    [joinCard, playerLobby, playerGame, playerTerritory].forEach(element => {
        element.classList.toggle("hidden", element !== section);
    });
}

function formatTime(endTime) {
    const seconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function updateGameTimer() {
    const value = currentGameData?.session?.game_ends_at;
    const endTime = value ? new Date(value).getTime() : 0;
    const text = endTime ? formatTime(endTime) : "--";
    const ending = endTime && endTime - Date.now() <= 30000;
    [playerQuestionTimer, playerTerritoryTimer].forEach(timer => {
        timer.textContent = text;
        timer.classList.toggle("timer-ending", Boolean(ending));
    });
}

function addMedia(container, text, imageUrl, alt) {
    container.replaceChildren();
    if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = alt;
        image.className = "question-image";
        container.append(image);
    }
    if (text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        container.append(paragraph);
    }
}

function renderCorrectProgress(progress) {
    const completed = Math.max(0, Math.min(3, Number(progress) || 0));
    playerQuestionNumber.replaceChildren();
    playerQuestionNumber.setAttribute("aria-label", `${completed} of 3 correct answers`);

    for (let index = 0; index < 3; index += 1) {
        const check = document.createElement("span");
        check.className = "correct-progress-check";
        if (index < completed) check.classList.add("is-complete");
        check.textContent = "\u2713";
        check.setAttribute("aria-hidden", "true");
        playerQuestionNumber.append(check);
    }
}

function renderQuestion(data) {
    if (!data.question) return;
    showOnly(playerGame);
    renderCorrectProgress(data.player.correct_answer_progress);
    addMedia(
        playerQuestionContent,
        data.question.question_text,
        data.question.image_url,
        "Question"
    );
    playerAnswerChoices.replaceChildren();
    (data.choices || []).forEach((choice, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-choice";
        button.dataset.choiceId = choice.id;
        if (choice.image_url) {
            const image = document.createElement("img");
            image.src = choice.image_url;
            image.alt = choice.answer_text || `Answer choice ${index + 1}`;
            button.append(image);
        }
        const label = document.createElement("span");
        label.textContent = choice.answer_text || `Choice ${index + 1}`;
        button.append(label);
        playerAnswerChoices.append(button);
    });
    playerGameMessage.textContent = "Choose your answer.";
    updateGameTimer();
}

function isEligible(cell, cells, teamNumber) {
    if (cell.is_base || Number(cell.owner_team_number) === teamNumber) return false;
    return cells.some(owned =>
        Number(owned.owner_team_number) === teamNumber &&
        Math.abs(Number(owned.row_number) - Number(cell.row_number)) <= 1 &&
        Math.abs(Number(owned.column_number) - Number(cell.column_number)) <= 1 &&
        (Number(owned.row_number) !== Number(cell.row_number) ||
         Number(owned.column_number) !== Number(cell.column_number))
    );
}

function renderTerritoryGrid() {
    if (!currentBoard || !currentGameData) return;
    const cells = currentBoard.cells || [];
    const teamNumber = Number(currentGameData.player.team_number);
    const colors = new Map((currentBoard.teams || []).map(
        team => [Number(team.team_number), team.color]
    ));
    playerTerritoryGrid.style.setProperty("--grid-size", currentBoard.session.grid_size);
    playerTerritoryGrid.replaceChildren();
    cells.forEach(cell => {
        const eligible = isEligible(cell, cells, teamNumber);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `territory-cell${cell.is_base ? " is-base" : ""}${eligible ? " eligible" : ""}`;
        button.dataset.cellId = cell.id;
        button.disabled = !eligible || captureInFlight;
        if (cell.owner_team_number) {
            button.style.setProperty("--cell-color", colors.get(Number(cell.owner_team_number)));
        }
        button.textContent = cell.is_base ? "★" : "";
        button.title = cell.is_base ? "Protected team base" :
            eligible ? "Claim this territory" : "Unavailable territory";
        playerTerritoryGrid.append(button);
    });
}

async function renderTerritory(data) {
    const boardResult = await dbGetClaimGridBoard(data.session.id);
    if (boardResult.error || !boardResult.data) return;
    currentBoard = boardResult.data;
    showOnly(playerTerritory);
    const captures = Number(data.player.available_captures || 0);
    playerTerritoryInstructions.textContent = "Tap any highlighted square. Every tap is final.";
    playerTerritoryMessage.textContent = `${captures} ${captures === 1 ? "capture" : "captures"} left.`;
    renderTerritoryGrid();
    updateGameTimer();
}

function showLobby(data) {
    showOnly(playerLobby);
    playerGameName.textContent = data.session.name;
    joinedPlayerName.textContent = data.player.display_name;
    joinedTeamNumber.textContent = data.player.team_number;
    playerTeamBadge.style.setProperty("--team-color", data.team.color);
    playerLobbyMessage.textContent = data.session.status === "finished"
        ? "The game has finished. Great job!"
        : "Waiting for the teacher to start.";
}

async function refreshPlayerGame(force = false) {
    if (!currentPlayerId || (!force && Date.now() < nextRefreshAt)) return;
    nextRefreshAt = Date.now() + 2500;
    const result = await dbGetClaimGridPlayerGame(currentPlayerId);
    if (result.error || !result.data) return;
    currentGameData = result.data;
    if (result.data.session.status !== "active") showLobby(result.data);
    else if (Number(result.data.player.available_captures) > 0) await renderTerritory(result.data);
    else renderQuestion(result.data);
}

playerAnswerChoices.addEventListener("click", async event => {
    const button = event.target.closest("button[data-choice-id]");
    if (!button || button.disabled || answerInFlight) return;
    answerInFlight = true;
    playerAnswerChoices.querySelectorAll("button").forEach(item => { item.disabled = true; });
    playerGameMessage.textContent = "Checking your answer...";
    const result = await dbSubmitClaimGridSelfPacedAnswer(
        currentPlayerId, Number(button.dataset.choiceId)
    );
    if (result.error || !result.data) {
        playerGameMessage.textContent = result.error?.message || "Your answer could not be checked.";
        playerAnswerChoices.querySelectorAll("button").forEach(item => { item.disabled = false; });
        answerInFlight = false;
        return;
    }
    playerAnswerChoices.querySelectorAll("button").forEach(item => {
        if (item.dataset.choiceId === String(result.data.correct_choice_id)) {
            item.classList.add("answer-correct");
        }
    });
    if (!result.data.is_correct) button.classList.add("answer-incorrect");
    renderCorrectProgress(result.data.correct_answer_progress);
    playerGameMessage.textContent = result.data.is_correct
        ? Number(result.data.available_captures) > 0
            ? "Three correct! Claim three territories."
            : "Correct! Keep going!"
        : "Not this time. Try the next question!";
    window.setTimeout(async () => {
        answerInFlight = false;
        await refreshPlayerGame(true);
    }, 900);
});

playerTerritoryGrid.addEventListener("click", async event => {
    const button = event.target.closest("button[data-cell-id]");
    if (!button || button.disabled || captureInFlight) return;
    captureInFlight = true;
    renderTerritoryGrid();
    playerTerritoryMessage.textContent = "Claiming territory...";
    const result = await dbClaimClaimGridTerritory(
        currentPlayerId, Number(button.dataset.cellId)
    );
    if (result.error || !result.data) {
        playerTerritoryMessage.textContent = result.error?.message || "That territory could not be claimed.";
        captureInFlight = false;
        renderTerritoryGrid();
        return;
    }
    const remaining = Number(result.data.available_captures || 0);
    playerTerritoryMessage.textContent = result.data.changed_owner
        ? `${remaining} ${remaining === 1 ? "capture" : "captures"} left.`
        : `Your teammate already captured it. ${remaining} ${remaining === 1 ? "capture" : "captures"} left.`;
    captureInFlight = false;
    await refreshPlayerGame(true);
});

async function ensurePlayerAuth() {
    const { data } = await db.auth.getSession();
    if (data?.session?.user) return true;
    const { error } = await db.auth.signInAnonymously();
    if (error) console.error("Could not create Claim the Grid player session:", error);
    return !error;
}

joinClaimGridForm.addEventListener("submit", async event => {
    event.preventDefault();
    joinMessage.textContent = "";
    if (!joinClaimGridForm.reportValidity() || !(await ensurePlayerAuth())) return;
    joinClaimGridBtn.disabled = true;
    joinClaimGridBtn.textContent = "Joining...";
    const roomCode = playerRoomCode.value.trim().toUpperCase();
    const result = await dbJoinClaimGridRoom(roomCode, playerNickname.value.trim());
    joinClaimGridBtn.disabled = false;
    joinClaimGridBtn.textContent = "Join Game";
    if (result.error || !result.data) {
        joinMessage.textContent = result.error?.message || "The room could not be joined.";
        return;
    }
    const player = Array.isArray(result.data) ? result.data[0] : result.data;
    currentPlayerId = player.id;
    localStorage.setItem(`claimGridPlayer:${roomCode}`, currentPlayerId);
    localStorage.setItem("claimGridLastRoom", roomCode);
    localStorage.setItem(`claimGridNickname:${roomCode}`, playerNickname.value.trim());
    await refreshPlayerGame(true);
});

async function initializePlayerPage() {
    const requestedRoom = new URLSearchParams(window.location.search).get("room")?.toUpperCase();
    const roomCode = requestedRoom || localStorage.getItem("claimGridLastRoom") || "";
    playerRoomCode.value = roomCode;
    playerNickname.value = localStorage.getItem(`claimGridNickname:${roomCode}`) || "";
    if (!(await ensurePlayerAuth()) || !roomCode) return;
    currentPlayerId = localStorage.getItem(`claimGridPlayer:${roomCode}`);
    if (!currentPlayerId) return;
    const result = await dbGetClaimGridPlayerGame(currentPlayerId);
    if (result.error || !result.data) {
        currentPlayerId = null;
        localStorage.removeItem(`claimGridPlayer:${roomCode}`);
        return;
    }
    if (result.data.session?.status === "finished") {
        currentPlayerId = null;
        localStorage.removeItem(`claimGridPlayer:${roomCode}`);
        if (localStorage.getItem("claimGridLastRoom") === roomCode) {
            localStorage.removeItem("claimGridLastRoom");
        }
        showOnly(joinCard);
        joinMessage.textContent = "This game has finished. Ask the teacher for the new room code.";
        return;
    }
    currentGameData = result.data;
    await refreshPlayerGame(true);
}

initializePlayerPage();
window.setInterval(() => refreshPlayerGame(), 3000);
window.setInterval(updateGameTimer, 500);
