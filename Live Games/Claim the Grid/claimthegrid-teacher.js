const teacherGameName = document.getElementById("teacherGameName");
const claimGridRoomCode = document.getElementById("claimGridRoomCode");
const claimGridQrContainer = document.getElementById("claimGridQrContainer");
const claimGridRoomQr = document.getElementById("claimGridRoomQr");
const claimGridQrInstruction = document.getElementById("claimGridQrInstruction");
const claimGridTeamRosters = document.getElementById("claimGridTeamRosters");
const claimGridLobbyMessage = document.getElementById("claimGridLobbyMessage");
const startClaimGridGameBtn = document.getElementById("startClaimGridGameBtn");
const teacherLobby = document.getElementById("teacherLobby");
const teacherGame = document.getElementById("teacherGame");
const teacherQuestionNumber = document.getElementById("teacherQuestionNumber");
const teacherQuestionTimer = document.getElementById("teacherQuestionTimer");
const teacherQuestionContent = document.getElementById("teacherQuestionContent");
const teacherAnswerChoices = document.getElementById("teacherAnswerChoices");
const teacherGameMessage = document.getElementById("teacherGameMessage");
const teacherTerritory = document.getElementById("teacherTerritory");
const teacherTerritoryTimer = document.getElementById("teacherTerritoryTimer");
const teacherTerritoryGrid = document.getElementById("teacherTerritoryGrid");
const teacherTerritoryMessage = document.getElementById("teacherTerritoryMessage");
const finishClaimGridGameBtn = document.getElementById("finishClaimGridGameBtn");
const activeClaimGridRoomCode = document.getElementById("activeClaimGridRoomCode");
const claimGridResultsModal = document.getElementById("claimGridResultsModal");
const closeClaimGridResultsBtn = document.getElementById("closeClaimGridResultsBtn");
const returnToClaimGridBtn = document.getElementById("returnToClaimGridBtn");
const playClaimGridAgainBtn = document.getElementById("playClaimGridAgainBtn");
const claimGridReplayMessage = document.getElementById("claimGridReplayMessage");
const claimGridWinnerList = document.getElementById("claimGridWinnerList");

QrUtils.makeExpandable({
    container: claimGridQrContainer,
    instructionElement: claimGridQrInstruction
});

function renderTeamRosters(teams, players) {
    claimGridTeamRosters.innerHTML = teams.map(team => {
        const teamPlayers = players.filter(
            player => Number(player.team_number) === Number(team.team_number)
        );
        const playerList = teamPlayers.length
            ? `<ul>${teamPlayers.map(player => `<li>${escapeHtml(player.display_name)}</li>`).join("")}</ul>`
            : '<p class="empty-team">Waiting for students...</p>';

        return `
            <article class="team-roster" style="--team-color: ${team.color}">
                <h2>Team ${team.team_number}</h2>
                ${playerList}
            </article>
        `;
    }).join("");
}

function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value || "";
    return element.innerHTML;
}

const sessionId = new URLSearchParams(window.location.search).get("session");
let lobbyInitialized = false;
let questionStartedAt = null;
let questionDuration = 0;
let teacherTimeExpired = false;
let territoryTransitionRequested = false;
let territoryStartedAt = null;
let gameEndsAt = null;
let currentTeacherQuestionId = null;
let earlyEndRequestedQuestionId = null;
let finishGameRequested = false;
let finalResultsShown = false;
let latestTeacherBoard = null;

function ordinal(value) {
    if (value === 1) return "1st";
    if (value === 2) return "2nd";
    if (value === 3) return "3rd";
    return `${value}th`;
}

function renderFinalResults(board) {
    const cells = board.cells || [];
    const results = (board.teams || []).map(team => ({
        teamNumber: Number(team.team_number),
        color: team.color,
        count: cells.filter(cell =>
            !cell.is_base && Number(cell.owner_team_number) === Number(team.team_number)
        ).length
    })).sort((a, b) => b.count - a.count || a.teamNumber - b.teamNumber);

    const counts = [...new Set(results.map(result => result.count))];
    claimGridWinnerList.replaceChildren();
    results.forEach(result => {
        const place = counts.indexOf(result.count) + 1;
        if (place > 3) return;
        const tied = results.filter(item => item.count === result.count).length > 1;
        const card = document.createElement("article");
        card.className = "winner-card";
        card.style.setProperty("--team-color", result.color);
        card.textContent = `${tied ? "Tied " : ""}${ordinal(place)} Place — Team ${result.teamNumber} — ${result.count} ${result.count === 1 ? "square" : "squares"}`;
        claimGridWinnerList.append(card);
    });
}

function showFinalResults(board) {
    renderFinalResults(board);
    claimGridResultsModal.classList.remove("hidden");
    finalResultsShown = true;
}

function closeFinalResults() {
    claimGridResultsModal.classList.add("hidden");
}

async function finishGame() {
    if (finishGameRequested) return;
    finishGameRequested = true;
    finishClaimGridGameBtn.disabled = true;
    finishClaimGridGameBtn.textContent = "Ending Game...";
    const result = await dbFinishClaimGridSession(sessionId);
    if (result.error) {
        teacherTerritoryMessage.textContent = result.error.message || "The game could not be ended.";
        finishGameRequested = false;
        finishClaimGridGameBtn.disabled = false;
        finishClaimGridGameBtn.textContent = "End Game";
        return;
    }
    await refreshTeacherLobby();
}

async function beginTerritoryPhase() {
    if (territoryTransitionRequested) return;
    territoryTransitionRequested = true;
    window.setTimeout(async () => {
        const result = await dbBeginClaimGridTerritoryPhase(sessionId);
        if (result.error) {
            teacherGameMessage.textContent =
                result.error.message || "Territory selection could not begin.";
            territoryTransitionRequested = false;
            return;
        }
        await refreshTeacherLobby();
    }, 2500);
}

function updateQuestionTimer() {
    if (!questionStartedAt || !questionDuration) {
        teacherQuestionTimer.textContent = "--";
        return;
    }

    const elapsedSeconds = (Date.now() - questionStartedAt) / 1000;
    const secondsRemaining = Math.max(0, Math.ceil(questionDuration - elapsedSeconds));
    teacherQuestionTimer.textContent = secondsRemaining === 0
        ? "Time's up!"
        : secondsRemaining;
    teacherQuestionTimer.classList.toggle("timer-ending", secondsRemaining <= 5);

    const timeExpired = secondsRemaining === 0;
    if (timeExpired !== teacherTimeExpired) {
        teacherTimeExpired = timeExpired;
        teacherAnswerChoices.classList.toggle("show-correct-answer", timeExpired);
        teacherGameMessage.textContent = timeExpired
            ? "Time is up! The correct answer is shown."
            : "Students are answering now.";
    }
    if (timeExpired) beginTerritoryPhase();
}

function updateTerritoryTimer() {
    if (!gameEndsAt) return;
    const secondsRemaining = Math.max(0, Math.ceil((gameEndsAt - Date.now()) / 1000));
    const minutes = Math.floor(secondsRemaining / 60);
    teacherTerritoryTimer.textContent = secondsRemaining === 0
        ? "Time's up!"
        : `${minutes}:${String(secondsRemaining % 60).padStart(2, "0")}`;
    teacherTerritoryTimer.classList.toggle("timer-ending", secondsRemaining <= 30);
    if (secondsRemaining === 0) {
        teacherTerritoryMessage.textContent = "The game has finished.";
        finishGame();
    }
}

function renderTerritoryGrid(container, board) {
    const teamColors = new Map(
        (board.teams || []).map(team => [Number(team.team_number), team.color])
    );
    container.style.setProperty("--grid-size", board.session.grid_size);
    container.replaceChildren();
    (board.cells || []).forEach(cell => {
        const square = document.createElement("div");
        square.className = `territory-cell${cell.is_base ? " is-base" : ""}`;
        if (cell.owner_team_number) {
            square.style.setProperty("--cell-color", teamColors.get(Number(cell.owner_team_number)));
        }
        square.textContent = cell.is_base ? "★" : "";
        square.title = cell.owner_team_number
            ? `Team ${cell.owner_team_number}${cell.is_base ? " base" : " territory"}`
            : "Unclaimed territory";
        container.append(square);
    });
}

async function renderTeacherTerritory(session) {
    const result = await dbGetClaimGridBoard(session.id);
    if (result.error || !result.data) return;
    latestTeacherBoard = result.data;
    teacherLobby.classList.add("hidden");
    teacherGame.classList.add("hidden");
    teacherTerritory.classList.remove("hidden");
    renderTerritoryGrid(teacherTerritoryGrid, result.data);
    gameEndsAt = new Date(session.game_ends_at).getTime();
    teacherTerritoryMessage.textContent = "Students are answering and claiming territory.";
    const finished = session.status === "finished";
    finishClaimGridGameBtn.classList.toggle("hidden", finished);
    if (finished) {
        finishGameRequested = true;
        gameEndsAt = session.ended_at ? new Date(session.ended_at).getTime() : Date.now();
        teacherTerritoryTimer.textContent = "Finished";
        teacherTerritoryMessage.textContent = "The game has finished. This is the final board.";
        if (!finalResultsShown) showFinalResults(result.data);
        return;
    }
    updateTerritoryTimer();
}

function addQuestionMedia(container, text, imageUrl, imageAlt) {
    container.replaceChildren();

    if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = imageAlt;
        image.className = "question-image";
        container.append(image);
    }

    if (text) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        container.append(paragraph);
    }
}

function renderTeacherGame(data) {
    const { session, question, choices = [] } = data;
    if (!question) return;

    teacherLobby.classList.add("hidden");
    teacherGame.classList.remove("hidden");
    teacherTerritory.classList.add("hidden");
    currentTeacherQuestionId = question.id;
    teacherQuestionNumber.textContent = `Question ${question.position}`;
    addQuestionMedia(
        teacherQuestionContent,
        question.question_text,
        question.image_url,
        "Question"
    );

    teacherAnswerChoices.replaceChildren();
    choices.forEach((choice, index) => {
        const card = document.createElement("article");
        card.className = `answer-choice${choice.is_correct ? " correct-choice" : ""}`;

        if (choice.image_url) {
            const image = document.createElement("img");
            image.src = choice.image_url;
            image.alt = choice.answer_text || `Answer choice ${index + 1}`;
            card.append(image);
        }

        const label = document.createElement("p");
        label.textContent = choice.answer_text || `Choice ${index + 1}`;
        card.append(label);
        teacherAnswerChoices.append(card);
    });

    questionStartedAt = new Date(session.question_started_at).getTime();
    questionDuration = Number(session.question_timer);
    teacherTimeExpired = false;
    teacherAnswerChoices.classList.remove("show-correct-answer");
    teacherGameMessage.textContent = "Students are answering now.";
    updateQuestionTimer();
}

async function updateTeacherAnswerProgress() {
    const result = await dbGetClaimGridAnswerProgress(sessionId);
    if (result.error || !result.data) return;

    const answeredCount = Number(result.data.answered_count || 0);
    const playerCount = Number(result.data.player_count || 0);
    teacherGameMessage.textContent = teacherTimeExpired
        ? `Time is up! ${answeredCount} of ${playerCount} students answered. The correct answer is shown.`
        : `${answeredCount} of ${playerCount} students answered.`;

    if (
        !teacherTimeExpired &&
        playerCount > 0 &&
        answeredCount >= playerCount &&
        String(earlyEndRequestedQuestionId) !== String(currentTeacherQuestionId)
    ) {
        earlyEndRequestedQuestionId = currentTeacherQuestionId;
        const endResult = await dbEndClaimGridQuestionEarly(sessionId);
        if (endResult.error) {
            earlyEndRequestedQuestionId = null;
            return;
        }
        await refreshTeacherLobby();
    }
}

function createStudentJoinUrl(roomCode) {
    const isLocalAddress = ["localhost", "127.0.0.1"].includes(
        window.location.hostname
    );
    const joinUrl = isLocalAddress
        ? new URL(
            "https://www.kidsclassroomgames.com/Live%20Games/Claim%20the%20Grid/claimthegrid-player.html"
        )
        : new URL("claimthegrid-player.html", window.location.href);

    joinUrl.search = "";
    joinUrl.hash = "";
    joinUrl.searchParams.set("room", roomCode);
    return joinUrl;
}

async function refreshTeacherLobby() {
    if (!sessionId) {
        claimGridLobbyMessage.textContent = "This game room link is incomplete.";
        return;
    }

    const result = await dbGetClaimGridHostLobby(sessionId);
    if (result.error || !result.data?.session) {
        claimGridLobbyMessage.textContent =
            result.error?.message || "This game room could not be loaded.";
        return;
    }

    const { session, teams, players } = result.data;
    if (!lobbyInitialized) {
        teacherGameName.textContent = session.name;
        claimGridRoomCode.textContent = session.room_code;
        activeClaimGridRoomCode.textContent = session.room_code;

        const joinUrl = createStudentJoinUrl(session.room_code);
        QrUtils.create({ qrElement: claimGridRoomQr, text: joinUrl.toString(), size: 160 });
        lobbyInitialized = true;
    }

    if (session.status === "active" && session.round_phase === "self_paced") {
        await renderTeacherTerritory(session);
        return;
    }

    if (session.status === "finished") {
        await renderTeacherTerritory(session);
        return;
    }

    if (session.status === "active" && session.round_phase === "territory") {
        await renderTeacherTerritory(session);
        return;
    }

    if (session.status === "active" && result.data.question) {
        renderTeacherGame(result.data);
        await updateTeacherAnswerProgress();
        return;
    }

    teacherLobby.classList.remove("hidden");
    teacherGame.classList.add("hidden");
    renderTeamRosters(teams || [], players || []);

    claimGridLobbyMessage.textContent = players?.length
        ? `${players.length} student${players.length === 1 ? "" : "s"} joined.`
        : "Waiting for students to join.";
    startClaimGridGameBtn.disabled = !players?.length;
}

startClaimGridGameBtn.addEventListener("click", async () => {
    startClaimGridGameBtn.disabled = true;
    startClaimGridGameBtn.textContent = "Starting...";
    claimGridLobbyMessage.textContent = "Starting the game...";

    const result = await dbStartClaimGridSession(sessionId);
    if (result.error) {
        claimGridLobbyMessage.textContent =
            result.error.message || "The game could not be started.";
        startClaimGridGameBtn.disabled = false;
        startClaimGridGameBtn.textContent = "Start Game";
        return;
    }

    await refreshTeacherLobby();
});

finishClaimGridGameBtn.addEventListener("click", () => {
    if (!window.confirm("End this Claim the Grid game now? Students will no longer be able to answer or claim territories.")) return;
    finishGame();
});
closeClaimGridResultsBtn.addEventListener("click", closeFinalResults);
returnToClaimGridBtn.addEventListener("click", closeFinalResults);
playClaimGridAgainBtn.addEventListener("click", async () => {
    playClaimGridAgainBtn.disabled = true;
    playClaimGridAgainBtn.textContent = "Creating New Room...";
    claimGridReplayMessage.textContent = "";
    const result = await dbReplayClaimGridSession(sessionId);
    if (result.error || !result.data) {
        claimGridReplayMessage.textContent =
            result.error?.message || "A new room could not be created.";
        playClaimGridAgainBtn.disabled = false;
        playClaimGridAgainBtn.textContent = "Play Again";
        return;
    }
    const session = Array.isArray(result.data) ? result.data[0] : result.data;
    const lobbyUrl = new URL("claimthegrid-teacher.html", window.location.href);
    lobbyUrl.search = "";
    lobbyUrl.searchParams.set("session", session.id);
    window.location.href = lobbyUrl.toString();
});
claimGridResultsModal.addEventListener("click", event => {
    if (event.target === claimGridResultsModal) closeFinalResults();
});

refreshTeacherLobby();
window.setInterval(refreshTeacherLobby, 3000);
window.setInterval(() => {
    updateQuestionTimer();
    updateTerritoryTimer();
}, 250);
