const roleSelectionView =
    document.getElementById(
        "role-selection-view"
    );

const teacherSetupView =
    document.getElementById(
        "teacher-setup-view"
    );

const joinGameView =
    document.getElementById(
        "join-game-view"
    );

const hostGameView =
    document.getElementById(
        "host-game-view"
    );

const playerGameView =
    document.getElementById(
        "player-game-view"
    );

const createGameBtn =
    document.getElementById(
        "create-game-btn"
    );

const showJoinBtn =
    document.getElementById(
        "show-join-btn"
    );

const backFromSetupBtn =
    document.getElementById(
        "back-from-setup-btn"
    );

const backFromJoinBtn =
    document.getElementById(
        "back-from-join-btn"
    );

const joinGameForm =
    document.getElementById(
        "join-game-form"
    );

const roomCodeInput =
    document.getElementById(
        "room-code-input"
    );

const playerNameInput =
    document.getElementById(
        "player-name-input"
    );

const pageMessage =
    document.getElementById(
        "page-message"
    );

const teacherSetupForm =
    document.getElementById(
        "teacher-setup-form"
    );

const savedBingoSetsControl =
    document.getElementById(
        "saved-bingo-sets-control"
    );

const deleteBingoSetBtn =
    document.getElementById(
        "delete-bingo-set-btn"
    );

const savedBingoSetChangeNote =
    document.getElementById(
        "saved-bingo-set-change-note"
    );

const shareBingoSetControls =
    document.getElementById(
        "share-bingo-set-controls"
    );

const createBingoShareLinkBtn =
    document.getElementById(
        "create-bingo-share-link-btn"
    );

const bingoShareLinkContainer =
    document.getElementById(
        "bingo-share-link-container"
    );

const bingoShareLinkInput =
    document.getElementById(
        "bingo-share-link"
    );

const copyBingoShareLinkBtn =
    document.getElementById(
        "copy-bingo-share-link-btn"
    );

const bingoShareMessage =
    document.getElementById(
        "bingo-share-message"
    );

const savedBingoSetSelect =
    document.getElementById(
        "saved-bingo-set-select"
    );

const bingoNameInput =
    document.getElementById(
        "bingo-name-input"
    );

const categorySelect =
    document.getElementById(
        "category-select"
    );

const tagsContainer =
    document.getElementById(
        "tags-container"
    );

const languageSelect =
    document.getElementById(
        "language-select"
    );

const teacherItemModeInputs =
    document.querySelectorAll(
        'input[name="teacherItemMode"]'
    );

const specificPoolControls =
    document.getElementById(
        "specific-pool-controls"
    );

const selectAllPoolItemsBtn =
    document.getElementById(
        "select-all-pool-items-btn"
    );

const clearPoolItemsBtn =
    document.getElementById(
        "clear-pool-items-btn"
    );

const availableItemsHeading =
    document.getElementById(
        "available-items-heading"
    );

const availableItemsCount =
    document.getElementById(
        "available-items-count"
    );

const availableItemsList =
    document.getElementById(
        "available-items-list"
    );

const freeCenterCheckbox =
    document.getElementById(
        "free-center-checkbox"
    );

const hostDisplayMode =
    document.getElementById(
        "host-display-mode"
    );

const playerDisplayMode =
    document.getElementById(
        "player-display-mode"
    );

const maxPlayersSelect =
    document.getElementById(
        "max-players-select"
    );

const createRoomBtn =
    document.getElementById(
        "create-room-btn"
    );

const saveBingoSetCheckbox =
    document.getElementById(
        "save-bingo-set-checkbox"
    );

const bingoSaveLimitMessage =
    document.getElementById(
        "bingo-save-limit-message"
    );

const gridSizeSelect =
    document.getElementById(
        "grid-size-select"
    );

const teacherPicker =
    document.getElementById(
        "teacher-picker"
    );

const teacherPickerItems =
    document.getElementById(
        "teacher-picker-items"
    );

const pickNextItemBtn =
    document.getElementById(
        "pick-next-item-btn"
    );

const pickerModal =
    document.getElementById(
        "picker-modal"
    );

const pickerModalItem =
    document.getElementById(
        "picker-modal-item"
    );

const pickerModalTitle =
    document.getElementById(
        "picker-modal-title"
    );

const closePickerModalBtn =
    document.getElementById(
        "close-picker-modal-btn"
    );

const hostLobby =
    document.getElementById(
        "host-lobby"
    );

const hostRoomCode =
    document.getElementById(
        "host-room-code"
    );

const hostQrContainer =
document.getElementById(
    "host-qr-container"
);

const hostRoomQr =
    document.getElementById(
        "host-room-qr"
    );

const hostQrInstruction =
    hostQrContainer.querySelector(
        ".host-qr-instruction"
    );

const hostPlayerCount =
    document.getElementById(
        "host-player-count"
    );

const hostReadyCount =
    document.getElementById(
        "host-ready-count"
    );

const startBingoGameBtn =
    document.getElementById(
        "start-bingo-game-btn"
    );

const playerRoomStatus =
    document.getElementById(
        "player-room-status"
    );

const playerCardBuilder =
    document.getElementById(
        "player-card-builder"
    );

const playerItemTray =
    document.getElementById(
        "player-item-tray"
    );

const playerItemTraySection =
    document.querySelector(
        ".player-item-tray-section"
    );

const playerBingoGrid =
    document.getElementById(
        "player-bingo-grid"
    );

const playerReadyBtn =
    document.getElementById(
        "player-ready-btn"
    );


const playerNotReadyBtn =
    document.getElementById(
        "player-not-ready-btn"
    );

const bingoCelebration =
    document.getElementById(
        "bingo-celebration"
    );

const bingoCelebrationMessage =
    document.getElementById(
        "bingo-celebration-message"
    );

const hostWinnersSection =
    document.getElementById(
        "host-winners-section"
    );

const hostWinnersList =
    document.getElementById(
        "host-winners-list"
    );

const hostWinnerCelebration =
    document.getElementById(
        "host-winner-celebration"
    );

const hostWinnerMessage =
    document.getElementById(
        "host-winner-message"
    );

const hostFinalResults =
    document.getElementById(
        "host-final-results"
    );

const hostFinalStandings =
    document.getElementById(
        "host-final-standings"
    );

const playBingoAgainBtn =
    document.getElementById(
        "play-bingo-again-btn"
    );

const hostLiveLeaders =
    document.getElementById(
        "host-live-leaders"
    );

const hostLiveLeadersList =
    document.getElementById(
        "host-live-leaders-list"
    );

const hostFinishControls =
    document.getElementById(
        "host-finish-controls"
    );

const finishBingoGameBtn =
    document.getElementById(
        "finish-bingo-game-btn"
    );

let teacherItemMode = "random";
let availableBingoItems = [];
let savedBingoSets = [];
let hostPickerItems = [];
let playerRoomItems = [];
let playerCardItems = [];
let savedPlayerCells = [];
let currentBingoSession = null;
let currentBingoPlayer = null;
let currentPlayerRoom = null;
let selectedTrayItemId = null;
let hostPlayersChannel = null;
let playerRoomChannel = null;
let playerCallsChannel = null;
let hostWinnersChannel = null;
let hostWinnerRefreshTimer = null;
let playerDraftSaveTimer = null;
let selectedSavedBingoSetId = null;

let playerDraftSaveChain =
    Promise.resolve();

const supportsPreciseDragging =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;

const seenHostWinIds =
    new Set();

const calledBingoItemIds =
    new Set();

const pickedHostItemIds =
    new Set();

const selectedPoolItemIds =
    new Set();

const winningPlayerPositions =
    new Set();

const allViews = [
    roleSelectionView,
    teacherSetupView,
    joinGameView,
    hostGameView,
    playerGameView
];


QrUtils.makeExpandable({
    container:
        hostQrContainer,

    instructionElement:
        hostQrInstruction
});

function showView(viewToShow) {
    allViews.forEach(view => {
        view.classList.toggle(
            "hidden",
            view !== viewToShow
        );
    });

    clearPageMessage();
}

function renderTeacherPicker() {

    const gameIsActive =
        currentBingoSession?.status ===
        "active";

    PickerUtils.renderItems({
        container:
            teacherPickerItems,

        items:
            hostPickerItems,

        pickedItemIds:
            [...pickedHostItemIds],

        displayMode:
            hostDisplayMode.value
    });

    teacherPicker.classList.toggle(
        "hidden",
        hostPickerItems.length === 0 ||
        !gameIsActive
    );

    pickNextItemBtn.disabled =
        !gameIsActive ||
        hostPickerItems.length === 0 ||
        pickedHostItemIds.size >=
            hostPickerItems.length;
}

async function refreshHostPlayers() {

    const sessionId =
        currentBingoSession?.id ||
        currentBingoSession?.session_id;

    if (!sessionId) {
        hostPlayerCount.textContent =
            "0";

        hostReadyCount.textContent =
            "0";

        return;
    }

    const result =
        await dbGetBingoPlayers(
            sessionId
        );

    if (result.error) {
        return;
    }

    hostPlayerCount.textContent =
        String(result.data.length);

    hostReadyCount.textContent =
        String(
            result.data.filter(
                player =>
                    player.is_ready ===
                    true
            ).length
        );
}

async function refreshHostWinners(
    celebrateNewWins = false
) {
    const sessionId =
        currentBingoSession?.id ||
        currentBingoSession?.session_id;

    if (!sessionId) {
        return;
    }

    const result =
        await dbGetBingoWins(
            sessionId
        );

    if (result.error) {
        return;
    }

    const newWins =
        result.data.filter(
            win =>
                !seenHostWinIds.has(
                    Number(win.id)
                )
        );

    result.data.forEach(win => {
        seenHostWinIds.add(
            Number(win.id)
        );
    });

    hostWinnersList.innerHTML = "";

    const winsByPlayer =
        new Map();

    result.data.forEach(win => {

        const playerKey =
            win.player_id;

        if (!winsByPlayer.has(playerKey)) {
            winsByPlayer.set(
                playerKey,
                {
                    displayName:
                        win.display_name,

                    bingoCount: 0,

                    firstBingoAt:
                        new Date(
                            win.detected_at
                        ).getTime()

                }
            );
        }

        winsByPlayer.get(
            playerKey
        ).bingoCount++;
    });

    [...winsByPlayer.values()]
        .forEach(player => {

            const entry =
                document.createElement(
                    "div"
                );

            entry.className =
                "host-winner-entry";

            entry.textContent =
                `${player.displayName} — ` +
                `${player.bingoCount} ` +
                (
                    player.bingoCount === 1
                        ? "Bingo"
                        : "Bingos"
                );

            hostWinnersList.appendChild(
                entry
            );
        });

    hostWinnersSection.classList.toggle(
        "hidden",
        result.data.length === 0
    );

    const liveLeaders =
        [...winsByPlayer.values()]
            .sort(
                (
                    firstPlayer,
                    secondPlayer
                ) => {
                    const countDifference =
                        secondPlayer.bingoCount -
                        firstPlayer.bingoCount;

                    if (countDifference !== 0) {
                        return countDifference;
                    }

                    return (
                        firstPlayer.firstBingoAt -
                        secondPlayer.firstBingoAt
                    );
                }
            )
            .slice(0, 3);

    hostLiveLeadersList.innerHTML = "";

    const livePlaceLabels = [
        "🥇 1st",
        "🥈 2nd",
        "🥉 3rd"
    ];

    liveLeaders.forEach(
        (player, index) => {
            const leader =
                document.createElement(
                    "div"
                );

            leader.className =
                `host-live-leader place-${index + 1}`;

            leader.textContent =
                `${livePlaceLabels[index]} — ` +
                `${player.displayName} — ` +
                `${player.bingoCount} ` +
                (
                    player.bingoCount === 1
                        ? "Bingo"
                        : "Bingos"
                );

            hostLiveLeadersList.appendChild(
                leader
            );
        }
    );

    hostLiveLeaders.classList.toggle(
        "hidden",
        liveLeaders.length === 0
    );

    if (
        celebrateNewWins &&
        newWins.length > 0
    ) {
   
        hostWinnerMessage.textContent =
            newWins.length > 1
                ? `${newWins.length} new Bingo lines were completed!`
                : "A new Bingo line was completed!";

        hostWinnerCelebration.classList.remove(
            "hidden"
        );
    }
}

async function showHostFinalResults() {

    const sessionId =
        currentBingoSession?.id ||
        currentBingoSession?.session_id;

    if (!sessionId) {
        return;
    }

    const result =
        await dbGetBingoWins(
            sessionId
        );

    if (result.error) {
        showPageMessage(
            "The final Bingo results could not be loaded.",
            "error"
        );

        return;
    }

    const standingsByPlayer =
        new Map();

    result.data.forEach(win => {

        if (
            !standingsByPlayer.has(
                win.player_id
            )
        ) {
            standingsByPlayer.set(
                win.player_id,
                {
                    displayName:
                        win.display_name,

                    bingoCount: 0,

                    firstBingoAt:
                        new Date(
                            win.detected_at
                        ).getTime()
                }
            );
        }

        standingsByPlayer.get(
            win.player_id
        ).bingoCount++;
    });

    const standings =
        [...standingsByPlayer.values()]
            .sort(
                (
                    firstPlayer,
                    secondPlayer
                ) => {
                    const countDifference =
                        secondPlayer
                            .bingoCount -
                        firstPlayer
                            .bingoCount;

                    if (countDifference !== 0) {
                        return countDifference;
                    }

                    return (
                        firstPlayer
                            .firstBingoAt -
                        secondPlayer
                            .firstBingoAt
                    );
                }
            )
            .slice(0, 3);

    hostFinalStandings.innerHTML = "";

    if (standings.length === 0) {
        const noWins =
            document.createElement(
                "div"
            );

        noWins.className =
            "final-standing no-wins";

        noWins.textContent =
            "No Bingo lines were completed.";

        hostFinalStandings.appendChild(
            noWins
        );
    } else {
        const placeLabels = [
            "🥇 1st Place",
            "🥈 2nd Place",
            "🥉 3rd Place"
        ];

        standings.forEach(
            (player, index) => {
                const standing =
                    document.createElement(
                        "div"
                    );

                standing.className =
                    `final-standing place-${index + 1}`;

                standing.textContent =
                    `${placeLabels[index]} — ` +
                    `${player.displayName} — ` +
                    `${player.bingoCount} ` +
                    (
                        player.bingoCount === 1
                            ? "Bingo"
                            : "Bingos"
                    );

                hostFinalStandings.appendChild(
                    standing
                );
            }
        );
    }

    teacherPicker.classList.add(
        "hidden"
    );

    hostWinnersSection.classList.add(
        "hidden"
    );

    hostFinishControls.classList.add(
        "hidden"
    );

    hostFinalResults.classList.remove(
        "hidden"
    );
}

function subscribeToHostPlayers() {

    const sessionId =
        currentBingoSession?.id ||
        currentBingoSession?.session_id;

    if (!sessionId) {
        return;
    }

    if (hostPlayersChannel) {
        db.removeChannel(
            hostPlayersChannel
        );
    }

    hostPlayersChannel =
        db
            .channel(
                `bingo-host-players-${sessionId}`
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table:
                        "bingo_players",
                    filter:
                        `session_id=eq.${sessionId}`
                },
                () => {
                    refreshHostPlayers();
                }
            )
            .subscribe();
}

function subscribeToHostWinners() {

    const sessionId =
        currentBingoSession?.id ||
        currentBingoSession?.session_id;

    if (!sessionId) {
        return;
    }

    if (hostWinnersChannel) {
        db.removeChannel(
            hostWinnersChannel
        );
    }

    hostWinnersChannel =
        db
            .channel(
                `bingo-host-winners-${sessionId}`
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table:
                        "bingo_wins",
                    filter:
                        `session_id=eq.${sessionId}`
                },
                () => {
                    clearTimeout(
                        hostWinnerRefreshTimer
                    );

                    hostWinnerRefreshTimer =
                        setTimeout(
                            () => {
                                refreshHostWinners(
                                    true
                                );
                            },
                            250
                        );
                }
            )
            .subscribe();
}

function updatePlayerRoomStatus() {

    const gameIsActive =
        currentPlayerRoom?.status ===
        "active";

    const gameIsFinished =
        currentPlayerRoom?.status ===
        "finished";

    playerItemTraySection.classList.toggle(
        "hidden",
        gameIsActive ||
        gameIsFinished
    );

    playerReadyBtn.classList.toggle(
        "hidden",
        gameIsActive ||
        gameIsFinished ||
        currentBingoPlayer?.is_ready ===
            true
    );

    playerNotReadyBtn.classList.toggle(
        "hidden",
        gameIsActive ||
        gameIsFinished ||
        currentBingoPlayer?.is_ready !==
            true
    );

    if (gameIsActive) {
        playerRoomStatus.textContent =
            "The game has started! Mark items as they are called.";
    }

    if (gameIsFinished) {
        playerRoomStatus.textContent =
            "This Bingo game has finished.";
    }

    renderPlayerItemTray();
    renderPlayerBingoGrid();
}

async function reloadPlayerCardFromDatabase() {
    if (!currentBingoPlayer) {
        return;
    }

    const result =
        await dbGetBingoPlayerCells(
            currentBingoPlayer.id
        );

    if (result.error) {
        console.error(
            "Could not reload the Bingo card:",
            result.error
        );

        return;
    }

    savedPlayerCells =
        result.data || [];

    const gridSize =
        Number(currentPlayerRoom.grid_size);

    const totalCells =
        gridSize * gridSize;

    playerCardItems =
        Array(totalCells).fill(null);

    savedPlayerCells.forEach(cell => {
        if (
            !cell.is_free &&
            cell.item_id !== null
        ) {
            playerCardItems[
                Number(cell.position) - 1
            ] = Number(cell.item_id);
        }
    });

    currentBingoPlayer = {
        ...currentBingoPlayer,
        is_ready: true,
        card_locked: true
    };

    selectedTrayItemId = null;
}

function subscribeToPlayerRoom() {

    const sessionId =
        currentPlayerRoom?.id;

    if (!sessionId) {
        return;
    }

    if (playerRoomChannel) {
        db.removeChannel(
            playerRoomChannel
        );
    }

    playerRoomChannel =
        db
            .channel(
                `bingo-player-room-${sessionId}`
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table:
                        "bingo_sessions",
                    filter:
                        `id=eq.${sessionId}`
                },
            async payload => {
                currentPlayerRoom = {
                    ...currentPlayerRoom,
                    ...payload.new
                };

                if (payload.new.status === "active") {
                    await reloadPlayerCardFromDatabase();
                }

                updatePlayerRoomStatus();
            }
            )
            .subscribe();
}

async function subscribeToPlayerCalls() {

    const sessionId =
        currentPlayerRoom?.id;

    if (!sessionId) {
        return;
    }

    const existingCalls =
        await dbGetBingoCalls(
            sessionId
        );

    if (!existingCalls.error) {
        calledBingoItemIds.clear();

        existingCalls.data.forEach(
            call => {
                calledBingoItemIds.add(
                    Number(call.item_id)
                );
            }
        );
    }

    if (playerCallsChannel) {
        db.removeChannel(
            playerCallsChannel
        );
    }

    playerCallsChannel =
        db
            .channel(
                `bingo-player-calls-${sessionId}`
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table:
                        "bingo_calls",
                    filter:
                        `session_id=eq.${sessionId}`
                },
                payload => {
                    calledBingoItemIds.add(
                        Number(
                            payload.new.item_id
                        )
                    );

                    renderPlayerBingoGrid();
                }
            )
            .subscribe();

    renderPlayerBingoGrid();
}

function renderPlayerItemTray() {

    playerItemTray.innerHTML = "";

    const usedItemIds =
        new Set(
            playerCardItems
                .filter(Boolean)
                .map(Number)
        );

    const cardIsLocked =
        currentPlayerRoom?.status !==
            "lobby" ||
        currentBingoPlayer?.is_ready ===
            true;

    playerRoomItems.forEach(item => {

        const itemId =
            Number(item.id);

        const itemCard =
            document.createElement("button");

        itemCard.type = "button";
        itemCard.className =
            "player-tray-item";

        itemCard.dataset.itemId =
            String(itemId);

        const itemIsUsed =
            usedItemIds.has(itemId);

        itemCard.disabled =
            itemIsUsed ||
            cardIsLocked;

        itemCard.draggable =
            !itemIsUsed &&
            !cardIsLocked &&
            supportsPreciseDragging;

        if (itemIsUsed) {
            itemCard.classList.add(
                "used"
            );
        }

        if (
            selectedTrayItemId ===
            itemId
        ) {
            itemCard.classList.add(
                "selected"
            );
        }

        const displayMode =
            currentPlayerRoom
                ?.player_display_mode ||
            "image-text";

        if (
            displayMode !== "text" &&
            item.url
        ) {
            const image =
                document.createElement("img");

            image.src = item.url;
            image.alt = item.name || "";

            itemCard.appendChild(image);
        }

        if (displayMode !== "image") {
            const name =
                document.createElement("span");

            name.textContent =
                item.name || "(No name)";

            itemCard.appendChild(name);
        }

        itemCard.addEventListener(
            "click",
            () => {
                selectedTrayItemId =
                    itemId;

                renderPlayerItemTray();
            }
        );

        itemCard.addEventListener(
            "dragstart",
            event => {
                event.dataTransfer.setData(
                    "text/plain",
                    String(itemId)
                );
            }
        );

        playerItemTray.appendChild(
            itemCard
        );
    });
}

function renderPlayerBingoGrid() {

    if (!currentPlayerRoom) {
        playerBingoGrid.innerHTML = "";
        return;
    }

    const gridSize =
        Number(
            currentPlayerRoom.grid_size
        );

    const totalSquares =
        gridSize * gridSize;

    const freeCenterPosition =
        currentPlayerRoom.has_free_center &&
        gridSize !== 4
            ? Math.floor(
                totalSquares / 2
            )
            : -1;

    playerBingoGrid.innerHTML = "";

    playerBingoGrid.style.setProperty(
        "--bingo-grid-size",
        gridSize
    );

    if (
        playerCardItems.length !==
        totalSquares
    ) {
        playerCardItems =
            Array(totalSquares).fill(null);
    }

    for (
        let position = 0;
        position < totalSquares;
        position++
    ) {
        const cell =
            document.createElement("button");

        cell.type = "button";
        cell.className =
            "player-bingo-cell";

        cell.dataset.position =
            String(position + 1);

        if (
            position ===
            freeCenterPosition
        ) {
            cell.classList.add("free");
            cell.textContent = "FREE";
            cell.disabled = true;

            playerBingoGrid.appendChild(
                cell
            );

            continue;
        }

        const itemId =
            playerCardItems[position];

        const item =
            playerRoomItems.find(
                roomItem =>
                    Number(roomItem.id) ===
                    Number(itemId)
            );

        const savedCell =
            savedPlayerCells.find(
                saved =>
                    Number(saved.position) ===
                    position + 1
            );

        if (savedCell?.marked_at) {
            cell.classList.add("marked");
        }    
        
        if (
            winningPlayerPositions.has(
                position + 1
            )
        ) {
            cell.classList.add(
                "winning"
            );
        }

            cell.addEventListener(
                "click",
                () => {

                    if (
                        currentPlayerRoom.status ===
                        "active"
                    ) {
                        markPlayerBingoCell(
                            position + 1
                        );

                        return;
                    }

                    if (
                        currentPlayerRoom.status !==
                            "lobby" ||
                        currentBingoPlayer
                            ?.is_ready === true
                    ) {
                        return;
                    }

                    if (selectedTrayItemId) {
                        placePlayerItem(
                            selectedTrayItemId,
                            position + 1
                        );

                        return;
                    }

                    if (playerCardItems[position]) {
                        playerCardItems[position] =
                            null;

                        renderPlayerItemTray();
                        renderPlayerBingoGrid();
                    }
                }
            );

            cell.addEventListener(
                "dragover",
                event => {
                    if (
                        currentPlayerRoom.status ===
                        "lobby"
                    ) {
                        event.preventDefault();
                    }
                }
            );

            cell.addEventListener(
                "drop",
                event => {
                    event.preventDefault();

                    const droppedItemId =
                        event.dataTransfer.getData(
                            "text/plain"
                        );

                    if (droppedItemId) {
                        placePlayerItem(
                            droppedItemId,
                            position + 1
                        );
                    }
                }
            );

            if (
                item &&
                supportsPreciseDragging &&
                currentPlayerRoom.status ===
                    "lobby" &&
                currentBingoPlayer?.is_ready !==
                    true            
            ) {
                cell.draggable = true;

                cell.addEventListener(
                    "dragstart",
                    event => {
                        event.dataTransfer.setData(
                            "text/plain",
                            String(item.id)
                        );
                    }
                );
            }

        if (item) {
            const displayMode =
                currentPlayerRoom
                    .player_display_mode ||
                "image-text";

            if (
                displayMode !== "text" &&
                item.url
            ) {
                const image =
                    document.createElement(
                        "img"
                    );

                image.src = item.url;
                image.alt =
                    item.name || "";

                cell.appendChild(image);
            }

            if (displayMode !== "image") {
                const name =
                    document.createElement(
                        "span"
                    );

                name.textContent =
                    item.name ||
                    "(No name)";

                cell.appendChild(name);
            }
        }

        playerBingoGrid.appendChild(
            cell
        );
    }
}

function placePlayerItem(
    itemId,
    position
) {
    if (
        currentPlayerRoom?.status !==
            "lobby" ||
        currentBingoPlayer?.is_ready ===
            true
    ) {
        return;
    }

    const itemNumber =
        Number(itemId);

    const positionIndex =
        Number(position) - 1;

    if (
        !playerRoomItems.some(
            item =>
                Number(item.id) ===
                itemNumber
        )
    ) {
        return;
    }

    const existingPosition =
        playerCardItems.findIndex(
            savedItemId =>
                Number(savedItemId) ===
                itemNumber
        );

    if (
        existingPosition !== -1 &&
        existingPosition !==
            positionIndex
    ) {
        playerCardItems[
            existingPosition
        ] = null;
    }

    playerCardItems[positionIndex] =
        itemNumber;

    selectedTrayItemId = null;

    renderPlayerItemTray();
    renderPlayerBingoGrid();
}

function schedulePlayerCardDraftSave() {

    clearTimeout(
        playerDraftSaveTimer
    );

    playerDraftSaveTimer =
        setTimeout(
            () => {

                if (
                    !currentBingoPlayer?.id ||
                    currentPlayerRoom?.status !==
                        "lobby" ||
                    currentBingoPlayer
                        ?.is_ready === true
                ) {
                    return;
                }

                const positions = [];
                const itemIds = [];

                playerCardItems.forEach(
                    (itemId, index) => {
                        if (itemId !== null) {
                            positions.push(
                                index + 1
                            );

                            itemIds.push(
                                Number(itemId)
                            );
                        }
                    }
                );

                playerDraftSaveChain =
                    playerDraftSaveChain
                        .then(
                            () =>
                                dbSaveBingoCardDraft(
                                    currentBingoPlayer.id,
                                    positions,
                                    itemIds
                                )
                        )
                        .then(result => {
                            if (result.error) {
                                showPageMessage(
                                    "Your card draft could not be saved.",
                                    "error"
                                );
                            }
                        })
                        .catch(error => {
                            console.error(
                                "Bingo draft save error:",
                                error
                            );
                        });

            },
            500
        );
}

async function markPlayerBingoCell(
    position
) {
    if (
        currentPlayerRoom?.status !==
        "active"
    ) {
        return;
    }

    const savedCell =
        savedPlayerCells.find(
            cell =>
                Number(cell.position) ===
                Number(position)
        );

    if (
        !savedCell ||
        savedCell.is_free ||
        savedCell.marked_at
    ) {
        return;
    }

    const itemId =
        Number(savedCell.item_id);

    if (
        !calledBingoItemIds.has(
            itemId
        )
    ) {
        return;
    }

    const result =
        await dbMarkBingoCell(
            savedCell.id
        );

    if (result.error) {
        showPageMessage(
            "This Bingo square could not be marked.",
            "error"
        );

        return;
    }

    savedCell.marked_at =
        new Date().toISOString();

    const newWins =
        result.data?.new_wins || [];

    if (newWins.length > 0) {

        newWins.forEach(win => {
            win.winning_positions
                .forEach(position => {
                    winningPlayerPositions.add(
                        Number(position)
                    );
                });
        });

        bingoCelebrationMessage.textContent =
            newWins.length > 1
                ? `Amazing! You completed ${newWins.length} new Bingo lines!`
                : "You completed a new Bingo line!";

        bingoCelebration.classList.remove(
            "hidden"
        );
    }

    renderPlayerBingoGrid();
    clearPageMessage();

}

function getCompletedPlayerCardItems() {

    if (!currentPlayerRoom) {
        return null;
    }

    const gridSize =
        Number(
            currentPlayerRoom.grid_size
        );

    const requiredItemCount =
        gridSize * gridSize -
        (
            currentPlayerRoom
                .has_free_center
                ? 1
                : 0
        );

    const completedItems =
        playerCardItems
            .filter(
                itemId =>
                    itemId !== null
            )
            .map(Number);

    if (
        completedItems.length !==
        requiredItemCount
    ) {
        return null;
    }

    const uniqueItemIds =
        new Set(completedItems);

    if (
        uniqueItemIds.size !==
        completedItems.length
    ) {
        return null;
    }

    return completedItems;
}

closePickerModalBtn.addEventListener(
    "click",
    () => {
        PickerUtils.closeSelectedItem(
            pickerModal
        );
    }
);

pickerModal.addEventListener(
    "click",
    event => {
        if (event.target === pickerModal) {
            PickerUtils.closeSelectedItem(
                pickerModal
            );
        }
    }
);

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            !pickerModal.classList.contains(
                "hidden"
            )
        ) {
            PickerUtils.closeSelectedItem(
                pickerModal
            );
        }
    }
);

function showPageMessage(
    message,
    type = ""
) {
    pageMessage.textContent =
        message;

    pageMessage.className =
        "page-message";

    if (type) {
        pageMessage.classList.add(
            type
        );
    }
}

function clearPageMessage() {
    showPageMessage("");
}

async function ensureBingoAuthSession() {

    const sessionResult =
        await db.auth.getSession();

    if (sessionResult.error) {
        console.error(
            "Could not check Bingo session:",
            sessionResult.error
        );

        return null;
    }

    if (sessionResult.data.session) {
        return sessionResult.data.session;
    }

    const signInResult =
        await db.auth.signInAnonymously();

    if (signInResult.error) {
        console.error(
            "Could not start anonymous Bingo session:",
            signInResult.error
        );

        return null;
    }

    return signInResult.data.session;
}

function getChosenBingoPool() {

    if (teacherItemMode === "specific") {
        return availableBingoItems.filter(
            item =>
                selectedPoolItemIds.has(
                    item.id
                )
        );
    }

    return PickerUtils
        .createShuffledItems(
            availableBingoItems
        )
        .slice(0, 50);
}

function validateBingoSetup(itemPool) {

    const gridSize =
        Number(gridSizeSelect.value);

    const requiredItemCount =
        gridSize * gridSize -
        (
            freeCenterCheckbox.checked
                ? 1
                : 0
        );

    if (!bingoNameInput.value.trim()) {
        return "Please enter a game name.";
    }

    if (itemPool.length < requiredItemCount) {
        return (
            `This ${gridSize} × ${gridSize} game ` +
            `needs at least ${requiredItemCount} items. ` +
            `Only ${itemPool.length} are currently selected.`
        );
    }

    if (itemPool.length > 50) {
        return (
            "A Bingo item pool can contain at most 50 items."
        );
    }

    return "";
}

teacherSetupForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();
        clearPageMessage();

        const itemPool =
            getChosenBingoPool();

        const validationMessage =
            validateBingoSetup(
                itemPool
            );

        if (validationMessage) {
            showPageMessage(
                validationMessage,
                "error"
            );

            return;
        }

        createRoomBtn.disabled = true;
        createRoomBtn.textContent =
            "Creating Room...";

        try {
            const session =
                await ensureBingoAuthSession();

            if (!session) {
                showPageMessage(
                    "The Bingo room could not be started. Please try again.",
                    "error"
                );

                return;
            }

            let savedSetId =
                selectedSavedBingoSetId;

            if (saveBingoSetCheckbox.checked) {
                if (session.user?.is_anonymous) {
                    showPageMessage(
                        "Please log in with a regular account to save this Bingo Game.",
                        "error"
                    );

                    return;
                }

                const saveResult =
                    await dbSaveBingoSet({
                        name:
                            bingoNameInput.value.trim(),

                        languageId:
                            Number(
                                languageSelect.value
                            ),

                        gridSize:
                            Number(
                                gridSizeSelect.value
                            ),

                        hasFreeCenter:
                            freeCenterCheckbox.checked,

                        hostDisplayMode:
                            hostDisplayMode.value,

                        playerDisplayMode:
                            playerDisplayMode.value,

                        itemIds:
                            itemPool.map(
                                item =>
                                    Number(item.id)
                            )
                    });

                if (saveResult.error) {
                    const errorMessage =
                        saveResult.error.message || "";

                    const duplicateName =
                        errorMessage.includes(
                            "already have a Bingo set"
                        );

                    const reachedFreeLimit =
                        errorMessage.includes(
                            "Free accounts can save up to 5"
                        );

                    let message =
                        "The Bingo setup could not be saved.";

                    if (duplicateName) {
                        message =
                            "You already have a Bingo game with this name.";
                    } else if (reachedFreeLimit) {
                        message =
                            "You have reached the free limit of 5 saved Bingo games. Delete one or upgrade to Premium.";
                    }

                    showPageMessage(
                        message,
                        "error"
                    );

                    return;
                }

                const savedSet =
                    Array.isArray(saveResult.data)
                        ? saveResult.data[0]
                        : saveResult.data;

                savedSetId =
                    savedSet?.id || null;
            }

            const result =
                await dbCreateBingoSession({
                    name:
                        bingoNameInput.value.trim(),

                    languageId:
                        Number(
                            languageSelect.value
                        ),

                    gridSize:
                        Number(
                            gridSizeSelect.value
                        ),

                    hasFreeCenter:
                        freeCenterCheckbox.checked,

                    hostDisplayMode:
                        hostDisplayMode.value,

                    playerDisplayMode:
                        playerDisplayMode.value,

                    maxPlayers:
                        Number(
                            maxPlayersSelect.value
                        ),

                    itemIds:
                        itemPool.map(
                            item =>
                                Number(item.id)
                        ),

                    setId: savedSetId
                });

            if (result.error) {
                showPageMessage(
                    "The Bingo room could not be created.",
                    "error"
                );

                return;
            }

            currentBingoSession =
                Array.isArray(result.data)
                    ? result.data[0]
                    : result.data;

            const roomCode =
                currentBingoSession?.room_code ||
                currentBingoSession?.code ||
                "";

            hostRoomCode.textContent =
                roomCode || "------";

            const studentJoinUrl =
                new URL(window.location.href);

            studentJoinUrl.search = "";
            studentJoinUrl.hash = "";

            studentJoinUrl.searchParams.set(
                "room",
                roomCode
            );

            QrUtils.create({
                qrElement:
                    hostRoomQr,

                text:
                    studentJoinUrl.toString(),

                size: 160
            });

            hostPlayerCount.textContent =
                "0";

            hostReadyCount.textContent =
                "0";

            await refreshHostPlayers();
            subscribeToHostPlayers();
            seenHostWinIds.clear();
            await refreshHostWinners(false);
            subscribeToHostWinners();

            hostPickerItems =
                [...itemPool];

            pickedHostItemIds.clear();

            hostFinalResults.classList.add(
                "hidden"
            );

            hostFinishControls.classList.add(
                "hidden"
            );

            startBingoGameBtn.classList.remove(
                "hidden"
            );

            startBingoGameBtn.disabled = false;
            startBingoGameBtn.textContent =
                "Start Game";

            showView(hostGameView);
            renderTeacherPicker();

            showPageMessage(
                "Bingo room created successfully.",
                "success"
            );

        } catch (error) {
            console.error(
                "Create Bingo room error:",
                error
            );

            showPageMessage(
                "The Bingo room could not be created.",
                "error"
            );

        } finally {
            createRoomBtn.disabled = false;
            createRoomBtn.textContent =
                "Create Bingo Room";

            playBingoAgainBtn.disabled = false;
            playBingoAgainBtn.textContent =
                "Play Again";

        }
    }
);

joinGameForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();
        clearPageMessage();

        const roomCode =
            roomCodeInput.value
                .trim()
                .toUpperCase();

        const displayName =
            playerNameInput.value.trim();

        if (displayName.length > 15) {
            showPageMessage(
                "Player names can contain no more than 15 characters.",
                "error"
            );

            return;
        }

        if (
            roomCode.length !== 6 ||
            !displayName
        ) {
            showPageMessage(
                "Enter the six-character room code and your name.",
                "error"
            );

            return;
        }

        const submitButton =
            joinGameForm.querySelector(
                'button[type="submit"]'
            );

        submitButton.disabled = true;
        submitButton.textContent =
            "Joining...";

        try {
            const session =
                await ensureBingoAuthSession();

            if (!session) {
                showPageMessage(
                    "The Bingo game could not be joined. Please try again.",
                    "error"
                );

                return;
            }

            const result =
                await dbJoinBingoRoom(
                    roomCode,
                    displayName
                );

            if (result.error) {
                showPageMessage(
                    result.error.message ||
                    "The Bingo game could not be joined.",
                    "error"
                );

                return;
            }

            currentBingoPlayer =
                Array.isArray(result.data)
                    ? result.data[0]
                    : result.data;

            const roomResult =
                await dbGetBingoPlayerRoom(
                    currentBingoPlayer.session_id
                );

            if (roomResult.error) {
                showPageMessage(
                    "The Bingo room data could not be loaded.",
                    "error"
                );

                return;
            }

            currentPlayerRoom =
                roomResult.session;

            playerRoomItems =
                roomResult.items;

            selectedTrayItemId = null;

            const totalSquares =
                Number(
                    currentPlayerRoom.grid_size
                ) ** 2;

            playerCardItems =
                Array(totalSquares).fill(null);

            const savedCellsResult =
                await dbGetBingoPlayerCells(
                    currentBingoPlayer.id
                );

            if (savedCellsResult.error) {
                showPageMessage(
                    "Your saved Bingo card could not be restored.",
                    "error"
                );

                return;
            }

            savedPlayerCells =
                savedCellsResult.data;

            savedPlayerCells.forEach(cell => {
                if (
                    !cell.is_free &&
                    cell.item_id !== null
                ) {
                    playerCardItems[
                        Number(cell.position) - 1
                    ] =
                        Number(cell.item_id);
                }
            });

            showView(playerGameView);

            renderPlayerItemTray();
            renderPlayerBingoGrid();
            subscribeToPlayerRoom();

            await subscribeToPlayerCalls();

            updatePlayerRoomStatus();

            showPageMessage(
                `Welcome, ${displayName}! Build your Bingo card.`,
                "success"
            );

        } catch (error) {
            console.error(
                "Join Bingo room error:",
                error
            );

            showPageMessage(
                "The Bingo game could not be joined.",
                "error"
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent =
                "Join Game";
        }
    }
);

playerReadyBtn.addEventListener(
    "click",
    async () => {

        clearTimeout(
            playerDraftSaveTimer
        );

        playerDraftSaveTimer = null;

        await playerDraftSaveChain;

        const completedItems =
            getCompletedPlayerCardItems();

        if (!completedItems) {
            showPageMessage(
                "Fill every Bingo square before selecting Ready.",
                "error"
            );

            return;
        }

        const playerId =
            currentBingoPlayer?.id;

        if (!playerId) {
            showPageMessage(
                "Your player information is missing.",
                "error"
            );

            return;
        }

        playerReadyBtn.disabled = true;
        playerReadyBtn.textContent =
            "Saving...";

        try {
            const saveResult =
                await dbSaveBingoPlayerCard(
                    playerId,
                    completedItems
                );

            if (saveResult.error) {
                showPageMessage(
                    "Your Bingo card could not be saved.",
                    "error"
                );

                return;
            }

            const readyResult =
                await dbSetBingoPlayerReady(
                    playerId,
                    true
                );

            if (readyResult.error) {
                showPageMessage(
                    "Your Bingo card was saved, but Ready could not be set.",
                    "error"
                );

                return;
            }

            const cellsResult =
                await dbGetBingoPlayerCells(
                    playerId
                );

            if (cellsResult.error) {
                showPageMessage(
                    "Your card was saved, but its squares could not be loaded.",
                    "error"
                );

                return;
            }

            savedPlayerCells =
                cellsResult.data;

            currentBingoPlayer = {
                ...currentBingoPlayer,
                is_ready: true
            };

            playerRoomStatus.textContent =
                "Ready! Waiting for the teacher to start.";

            playerReadyBtn.classList.add(
                "hidden"
            );

            playerNotReadyBtn.classList.remove(
                "hidden"
            );

            renderPlayerItemTray();
            renderPlayerBingoGrid();

            showPageMessage(
                "Your Bingo card is ready.",
                "success"
            );

        } catch (error) {
            console.error(
                "Ready Bingo player error:",
                error
            );

            showPageMessage(
                "Your Bingo card could not be saved.",
                "error"
            );

        } finally {
            playerReadyBtn.disabled =
                false;

            playerReadyBtn.textContent =
                "Ready";
        }
    }
);

playerNotReadyBtn.addEventListener(
    "click",
    async () => {

        if (
            currentPlayerRoom?.status !==
            "lobby"
        ) {
            showPageMessage(
                "The game has already started. Your card can no longer be changed.",
                "error"
            );

            return;
        }

        const playerId =
            currentBingoPlayer?.id;

        if (!playerId) {
            showPageMessage(
                "Your player information is missing.",
                "error"
            );

            return;
        }

        playerNotReadyBtn.disabled = true;
        playerNotReadyBtn.textContent =
            "Unlocking...";

        try {
            const result =
                await dbSetBingoPlayerReady(
                    playerId,
                    false
                );

            if (result.error) {
                showPageMessage(
                    "Your Bingo card could not be unlocked.",
                    "error"
                );

                return;
            }

            currentBingoPlayer = {
                ...currentBingoPlayer,
                is_ready: false
            };

            playerRoomStatus.textContent =
                "Build your card, then select Ready.";

            playerNotReadyBtn.classList.add(
                "hidden"
            );

            playerReadyBtn.classList.remove(
                "hidden"
            );

            renderPlayerItemTray();
            renderPlayerBingoGrid();

            showPageMessage(
                "Your card is unlocked. You can edit it again.",
                "success"
            );

        } catch (error) {
            console.error(
                "Not Ready Bingo player error:",
                error
            );

            showPageMessage(
                "Your Bingo card could not be unlocked.",
                "error"
            );

        } finally {
            playerNotReadyBtn.disabled =
                false;

            playerNotReadyBtn.textContent =
                "Not Ready";
        }
    }
);

pickNextItemBtn.addEventListener(
    "click",
    async () => {

        await PickerUtils.prepareAudio();

        const sessionId =
            currentBingoSession?.id ||
            currentBingoSession?.session_id;

        if (!sessionId) {
            showPageMessage(
                "The Bingo room information is missing.",
                "error"
            );

            return;
        }

        pickNextItemBtn.disabled = true;
        pickNextItemBtn.textContent =
            "Picking...";

        try {
            const result =
                await dbCallNextBingoItem(
                    sessionId
                );

            if (result.error) {
                showPageMessage(
                    "The next item could not be selected.",
                    "error"
                );

                return;
            }

            const call =
                Array.isArray(result.data)
                    ? result.data[0]
                    : result.data;

            if (!call) {
                showPageMessage(
                    "All Bingo items have been selected.",
                    "success"
                );

                return;
            }

            const calledItemId =
                Number(
                    call.item_id ??
                    call.called_item_id ??
                    call
                );

            const selectedItem =
                hostPickerItems.find(
                    item =>
                        Number(item.id) ===
                        calledItemId
                );

            if (!selectedItem) {
                console.error(
                    "Called Bingo item was not found:",
                    call
                );

                showPageMessage(
                    "The selected item could not be displayed.",
                    "error"
                );

                return;
            }

            await PickerUtils.animateSelection({
                container:
                    teacherPickerItems,

                selectedItemId:
                    calledItemId,

                duration:
                    1000
            });

            pickedHostItemIds.add(
                calledItemId
            );

            renderTeacherPicker();

            PickerUtils.showSelectedItem({
                modal:
                    pickerModal,

                itemContainer:
                    pickerModalItem,

                titleElement:
                    pickerModalTitle,

                item:
                    selectedItem,

                displayMode:
                    hostDisplayMode.value
            });

            if (
                pickedHostItemIds.size >=
                hostPickerItems.length
            ) {
                showPageMessage(
                    "All items have been selected. Finish the game when everyone is ready.",
                    "success"
                );
            } else {
                clearPageMessage();
            }

        } catch (error) {
            console.error(
                "Pick next Bingo item error:",
                error
            );

            showPageMessage(
                "The next item could not be selected.",
                "error"
            );

        } finally {
            pickNextItemBtn.textContent =
                "Pick Next";

            renderTeacherPicker();
        }
    }
);

createGameBtn.addEventListener(
    "click",
    () => {
        showView(teacherSetupView);
    }
);

startBingoGameBtn.addEventListener(
    "click",
    async () => {

        const sessionId =
            currentBingoSession?.id ||
            currentBingoSession?.session_id;

        if (!sessionId) {
            showPageMessage(
                "The Bingo room information is missing.",
                "error"
            );

            return;
        }

        startBingoGameBtn.disabled = true;
        startBingoGameBtn.textContent =
            "Starting...";

        try {
            const result =
                await dbStartBingoSession(
                    sessionId
                );

            if (result.error) {
                showPageMessage(
                    "The Bingo game could not be started.",
                    "error"
                );

                return;
            }

            currentBingoSession = {
                ...currentBingoSession,
                status: "active"
            };

            startBingoGameBtn.classList.add(
                "hidden"
            );

            hostFinishControls.classList.remove(
                "hidden"
            );

            renderTeacherPicker();

            showPageMessage(
                "The Bingo game has started. Pick the first item!",
                "success"
            );

        } catch (error) {
            console.error(
                "Start Bingo game error:",
                error
            );

            showPageMessage(
                "The Bingo game could not be started.",
                "error"
            );

        } finally {
            startBingoGameBtn.disabled =
                false;

            startBingoGameBtn.textContent =
                "Start Game";
        }
    }
);

finishBingoGameBtn.addEventListener(
    "click",
    async () => {

        const sessionId =
            currentBingoSession?.id ||
            currentBingoSession?.session_id;

        if (!sessionId) {
            showPageMessage(
                "The Bingo room information is missing.",
                "error"
            );

            return;
        }

        finishBingoGameBtn.disabled = true;
        finishBingoGameBtn.textContent =
            "Finishing...";

        try {
            await showHostFinalResults();

            const result =
                await dbFinishBingoSession(
                    sessionId
                );

            if (result.error) {
                hostFinalResults.classList.add(
                    "hidden"
                );

                teacherPicker.classList.remove(
                    "hidden"
                );

                hostFinishControls.classList.remove(
                    "hidden"
                );

                showPageMessage(
                    "The Bingo game could not be finished.",
                    "error"
                );

                return;
            }

            currentBingoSession = {
                ...currentBingoSession,
                status: "finished"
            };

            showPageMessage(
                "The Bingo game has finished.",
                "success"
            );

        } catch (error) {
            console.error(
                "Finish Bingo game error:",
                error
            );

            showPageMessage(
                "The Bingo game could not be finished.",
                "error"
            );

        } finally {
            finishBingoGameBtn.disabled =
                false;

            finishBingoGameBtn.textContent =
                "Finish Game";
        }
    }
);

playBingoAgainBtn.addEventListener(
    "click",
    () => {

        playBingoAgainBtn.disabled = true;
        playBingoAgainBtn.textContent =
            "Creating Room...";

        availableBingoItems = [
            ...hostPickerItems
        ];

        teacherItemMode = "specific";

        teacherItemModeInputs.forEach(
            input => {
                input.checked =
                    input.value ===
                    "specific";
            }
        );

        selectedPoolItemIds.clear();

        availableBingoItems.forEach(
            item => {
                selectedPoolItemIds.add(
                    Number(item.id)
                );
            }
        );

        categorySelect.required = false;
        saveBingoSetCheckbox.checked = false;

        teacherSetupForm.requestSubmit();
    }
);

showJoinBtn.addEventListener(
    "click",
    () => {
        showView(joinGameView);
        roomCodeInput.focus();
    }
);

backFromSetupBtn.addEventListener(
    "click",
    () => {
        showView(roleSelectionView);
    }
);

backFromJoinBtn.addEventListener(
    "click",
    () => {
        showView(roleSelectionView);
    }
);

roomCodeInput.addEventListener(
    "input",
    () => {
        roomCodeInput.value =
            roomCodeInput.value
                .toUpperCase()
                .replace(
                    /[^A-Z0-9]/g,
                    ""
                )
                .slice(0, 6);
    }
);

gridSizeSelect.addEventListener(
    "change",
    updateGridSettings
);

categorySelect.addEventListener(
    "change",
    updateBingoItemsPreview
);

languageSelect.addEventListener(
    "change",
    updateBingoItemsPreview
);

teacherItemModeInputs.forEach(input => {
    input.addEventListener(
        "change",
        event => {
            teacherItemMode =
                event.target.value;

            const choosingSpecificItems =
                teacherItemMode ===
                "specific";

            specificPoolControls
                .classList.toggle(
                    "hidden",
                    !choosingSpecificItems
                );

            selectedPoolItemIds.clear();

            renderAvailableBingoItems();
        }
    );
});

savedBingoSetSelect.addEventListener(
    "change",
    async () => {
        const setId =
            Number(
                savedBingoSetSelect.value
            );

        if (!setId) {
            selectedSavedBingoSetId =
                null;

            categorySelect.required =
                true;

            deleteBingoSetBtn.classList.add(
                "hidden"
            );

            savedBingoSetChangeNote.classList.add(
                "hidden"
            );

            updateBingoSetShareControls(
                null
            );

            return;
        }

        const selectedSet =
            savedBingoSets.find(
                set =>
                    Number(set.id) ===
                    setId
            );

        if (!selectedSet) {
            return;
        }

        savedBingoSetSelect.disabled =
            true;

        try {
            const result =
                await dbGetBingoSetItems(
                    setId,
                    Number(
                        selectedSet.language_id
                    )
                );

            if (
                result.error ||
                result.data.length === 0
            ) {
                showPageMessage(
                    "The saved Bingo set could not be loaded.",
                    "error"
                );

                return;
            }

            selectedSavedBingoSetId =
                setId;

            deleteBingoSetBtn.classList.remove(
                "hidden"
            );

            savedBingoSetChangeNote.classList.remove(
                "hidden"
            );

            updateBingoSetShareControls(
                selectedSet
            );

            bingoNameInput.value =
                selectedSet.name;

            languageSelect.value =
                String(
                    selectedSet.language_id
                );

            gridSizeSelect.value =
                String(
                    selectedSet.grid_size
                );

            freeCenterCheckbox.checked =
                Boolean(
                    selectedSet.has_free_center
                );

            hostDisplayMode.value =
                selectedSet.host_display_mode;

            playerDisplayMode.value =
                selectedSet.player_display_mode;

            updateGridSettings();

            teacherItemMode =
                "specific";

            teacherItemModeInputs.forEach(
                input => {
                    input.checked =
                        input.value ===
                        "specific";
                }
            );

            specificPoolControls.classList.remove(
                "hidden"
            );

            availableBingoItems =
                result.data;

            selectedPoolItemIds.clear();

            availableBingoItems.forEach(
                item => {
                    selectedPoolItemIds.add(
                        Number(item.id)
                    );
                }
            );

            categorySelect.required =
                false;

            saveBingoSetCheckbox.checked =
                false;

            renderAvailableBingoItems();

            showPageMessage(
                `"${selectedSet.name}" was loaded.`,
                "success"
            );

        } finally {
            savedBingoSetSelect.disabled =
                false;
        }
    }
);

deleteBingoSetBtn.addEventListener(
    "click",
    async () => {
        const setId =
            selectedSavedBingoSetId;

        if (!setId) {
            return;
        }

        const selectedSet =
            savedBingoSets.find(
                set =>
                    Number(set.id) ===
                    Number(setId)
            );

        const confirmed =
            window.confirm(
                `Permanently delete "${selectedSet?.name || "this Bingo set"}"? ` +
                "This cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        deleteBingoSetBtn.disabled =
            true;

        deleteBingoSetBtn.textContent =
            "Deleting...";

        try {
            const result =
                await dbDeleteBingoSet(
                    setId
                );

            if (result.error) {
                showPageMessage(
                    "The saved Bingo set could not be deleted.",
                    "error"
                );

                return;
            }

            selectedSavedBingoSetId =
                null;

            savedBingoSetSelect.value =
                "";

            deleteBingoSetBtn.classList.add(
                "hidden"
            );

            savedBingoSetChangeNote.classList.add(
                "hidden"
            );

            await loadSavedBingoSets();

            showPageMessage(
                `"${selectedSet?.name || "The Bingo set"}" was permanently deleted. ` +
                "The currently loaded setup can still be used for this game.",
                "success"
            );

        } finally {
            deleteBingoSetBtn.disabled =
                false;

            deleteBingoSetBtn.textContent =
                "Delete Saved Set";
        }
    }
);

createBingoShareLinkBtn.addEventListener(
    "click",
    async () => {
        const selectedSet =
            savedBingoSets.find(
                set =>
                    Number(set.id) ===
                    Number(
                        selectedSavedBingoSetId
                    )
            );

        if (!selectedSet) {
            return;
        }

        createBingoShareLinkBtn.disabled =
            true;

        createBingoShareLinkBtn.textContent =
            "Creating Link...";

        try {
            const slug =
                selectedSet.slug ||
                crypto.randomUUID();

            const result =
                await dbEnableBingoSetSharing(
                    selectedSet.id,
                    slug
                );

            if (result.error) {
                bingoShareMessage.textContent =
                    "The teacher share link could not be created.";

                return;
            }

            Object.assign(
                selectedSet,
                result.data
            );

            updateBingoSetShareControls(
                selectedSet
            );

            bingoShareMessage.textContent =
                "Teacher share link created.";

        } finally {
            createBingoShareLinkBtn.disabled =
                false;

            createBingoShareLinkBtn.textContent =
                "Create Teacher Share Link";
        }
    }
);

copyBingoShareLinkBtn.addEventListener(
    "click",
    async () => {
        try {
            await navigator.clipboard.writeText(
                bingoShareLinkInput.value
            );

            bingoShareMessage.textContent =
                "Teacher share link copied.";

        } catch (error) {
            console.error(
                "Could not copy Bingo share link:",
                error
            );

            bingoShareLinkInput.select();

            bingoShareMessage.textContent =
                "Copy the selected link manually.";
        }
    }
);

selectAllPoolItemsBtn.addEventListener(
    "click",
    () => {
        selectedPoolItemIds.clear();

        availableBingoItems
            .slice(0, 50)
            .forEach(item => {
                selectedPoolItemIds.add(
                    item.id
                );
            });

        renderAvailableBingoItems();

        if (
            availableBingoItems.length > 50
        ) {
            showPageMessage(
                "The first 50 items were selected because 50 is the maximum.",
                "success"
            );
        }
    }
);

clearPoolItemsBtn.addEventListener(
    "click",
    () => {
        selectedPoolItemIds.clear();
        clearPageMessage();
        renderAvailableBingoItems();
    }
);

bingoCelebration.addEventListener(
    "click",
    () => {
        bingoCelebration.classList.add(
            "hidden"
        );
    }
);

hostWinnerCelebration.addEventListener(
    "click",
    () => {
        hostWinnerCelebration.classList.add(
            "hidden"
        );
    }
);

function createBingoSetShareUrl(
    slug
) {
    const shareUrl =
        new URL(
            window.location.href
        );

    shareUrl.search = "";
    shareUrl.hash = "";

    shareUrl.searchParams.set(
        "set",
        slug
    );

    return shareUrl.toString();
}

function updateBingoSetShareControls(
    selectedSet = null
) {
    shareBingoSetControls.classList.toggle(
        "hidden",
        !selectedSet
    );

    bingoShareMessage.textContent =
        "";

    if (!selectedSet) {
        bingoShareLinkInput.value =
            "";

        bingoShareLinkContainer.classList.add(
            "hidden"
        );

        return;
    }

    if (
        selectedSet.is_public &&
        selectedSet.slug
    ) {
        bingoShareLinkInput.value =
            createBingoSetShareUrl(
                selectedSet.slug
            );

        bingoShareLinkContainer.classList.remove(
            "hidden"
        );

        createBingoShareLinkBtn.classList.add(
            "hidden"
        );
    } else {
        bingoShareLinkInput.value =
            "";

        bingoShareLinkContainer.classList.add(
            "hidden"
        );

        createBingoShareLinkBtn.classList.remove(
            "hidden"
        );
    }
}

async function loadSavedBingoSets() {
    const result =
        await dbGetMyBingoSets();

    savedBingoSets =
        result.data || [];

    savedBingoSetSelect.innerHTML = "";

    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";
    defaultOption.textContent =
        "Choose a saved Bingo set";

    savedBingoSetSelect.appendChild(
        defaultOption
    );

    savedBingoSets.forEach(set => {
        const option =
            document.createElement(
                "option"
            );

        option.value =
            String(set.id);

        option.textContent =
            set.name;

        savedBingoSetSelect.appendChild(
            option
        );
    });

    savedBingoSetsControl.classList.toggle(
        "hidden",
        savedBingoSets.length === 0
    );
}

async function loadSharedBingoSet(
    slug
) {
    const session =
        await ensureBingoAuthSession();

    if (!session) {
        showPageMessage(
            "The shared Bingo set could not be opened.",
            "error"
        );

        return false;
    }

    const setResult =
        await dbGetSharedBingoSet(
            slug
        );

    const sharedSet =
        setResult.data;

    if (
        setResult.error ||
        !sharedSet
    ) {
        showView(teacherSetupView);

        showPageMessage(
            "This shared Bingo set is no longer available.",
            "error"
        );

        return false;
    }

    const itemsResult =
        await dbGetBingoSetItems(
            sharedSet.id,
            Number(
                sharedSet.language_id
            )
        );

    if (
        itemsResult.error ||
        itemsResult.data.length === 0
    ) {
        showView(teacherSetupView);

        showPageMessage(
            "The shared Bingo items could not be loaded.",
            "error"
        );

        return false;
    }

    selectedSavedBingoSetId =
        sharedSet.id;

    bingoNameInput.value =
        sharedSet.name;

    languageSelect.value =
        String(
            sharedSet.language_id
        );

    gridSizeSelect.value =
        String(
            sharedSet.grid_size
        );

    freeCenterCheckbox.checked =
        Boolean(
            sharedSet.has_free_center
        );

    hostDisplayMode.value =
        sharedSet.host_display_mode;

    playerDisplayMode.value =
        sharedSet.player_display_mode;

    updateGridSettings();

    teacherItemMode =
        "specific";

    teacherItemModeInputs.forEach(
        input => {
            input.checked =
                input.value ===
                "specific";
        }
    );

    specificPoolControls.classList.remove(
        "hidden"
    );

    availableBingoItems =
        itemsResult.data;

    selectedPoolItemIds.clear();

    availableBingoItems.forEach(
        item => {
            selectedPoolItemIds.add(
                Number(item.id)
            );
        }
    );

    categorySelect.required =
        false;

    saveBingoSetCheckbox.checked =
        false;

    renderAvailableBingoItems();
    showView(teacherSetupView);

    showPageMessage(
        `"${sharedSet.name}" was shared with you. ` +
        "You may use it for a game or save your own copy.",
        "success"
    );

    return true;
}

async function updateBingoSaveAccessMessage() {
    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check Bingo save access:",
            error
        );

        return;
    }

    const user =
        data.session?.user;

    const hasRegularAccount =
        Boolean(
            user &&
            !user.is_anonymous
        );

    bingoSaveLimitMessage.classList.toggle(
        "hidden",
        !hasRegularAccount
    );

    if (!hasRegularAccount) {
        return;
    }

    const hasPremium =
        await dbUserHasPremium();

    bingoSaveLimitMessage.textContent =
        hasPremium
            ? "Premium account: Unlimited saved Bingo games."
            : "Free account: You can save up to 5 Bingo games.";
}

async function initializeBingoPage() {
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
        <option
            value=""
            selected
            disabled
        >
            Choose a Category
        </option>

        <option value="browse-by-tag">
            All Categories — Select a Tag
        </option>
    ` + categorySelect.innerHTML;

    await loadTags(
        tagsContainer,
        () => {}
    );

    await updateBingoSaveAccessMessage();

    await loadLanguages(
        languageSelect
    );

    await loadSavedBingoSets();

    updateGridSettings();

    const sharedRoomCode =
        new URLSearchParams(
            window.location.search
        )
            .get("room")
            ?.trim()
            .toUpperCase();

    const sharedSetSlug =
        new URLSearchParams(
            window.location.search
        )
            .get("set")
            ?.trim();

    if (sharedRoomCode) {
        roomCodeInput.value =
            sharedRoomCode
                .replace(
                    /[^A-Z0-9]/g,
                    ""
                )
                .slice(0, 6);

        showView(joinGameView);
        playerNameInput.focus();

    } else if (sharedSetSlug) {
        await loadSharedBingoSet(
            sharedSetSlug
        );
    }

}

function updateGridSettings() {
    const gridSize =
        Number(gridSizeSelect.value);

    if (gridSize === 4) {
        freeCenterCheckbox.checked =
            false;

        freeCenterCheckbox.disabled =
            true;
    } else {
        freeCenterCheckbox.disabled =
            false;
    }

}

function getSelectedBingoTagIds() {
    return Array.from(
        document.querySelectorAll(
            "#tags-container input:checked"
        )
    ).map(
        checkbox =>
            Number(checkbox.value)
    );
}

function showAvailableItemsMessage(
    message
) {
    availableItemsList.innerHTML = "";

    const messageElement =
        document.createElement("p");

    messageElement.textContent =
        message;

    availableItemsList.appendChild(
        messageElement
    );

    availableItemsCount.textContent =
        "0";
}

function renderAvailableBingoItems() {
    availableItemsList.innerHTML = "";

    const displayedCount =
        teacherItemMode === "specific"
            ? selectedPoolItemIds.size
            : availableBingoItems.length;

    availableItemsCount.textContent =
        displayedCount;

    availableItemsHeading.textContent =
        teacherItemMode === "specific"
            ? "Selected Items"
            : "Available Items";

    availableBingoItems.forEach(item => {
        const card =
            document.createElement(
                teacherItemMode === "specific"
                    ? "button"
                    : "div"
            );

        card.className =
            "bingo-item-preview";

        if (teacherItemMode === "specific") {
            card.type = "button";

            card.classList.add(
                "selectable"
            );

            const isSelected =
                selectedPoolItemIds.has(
                    item.id
                );

            card.classList.toggle(
                "selected",
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
                        selectedPoolItemIds.has(
                            item.id
                        )
                    ) {
                        selectedPoolItemIds.delete(
                            item.id
                        );
                    } else {
                        if (
                            selectedPoolItemIds.size >=
                            50
                        ) {
                            showPageMessage(
                                "A Bingo item pool can contain at most 50 items.",
                                "error"
                            );

                            return;
                        }

                        selectedPoolItemIds.add(
                            item.id
                        );
                    }

                    clearPageMessage();
                    renderAvailableBingoItems();
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
            },
            { once: true }
        );

        const name =
            document.createElement("span");

        name.textContent = item.name;

        card.appendChild(image);
        card.appendChild(name);

        availableItemsList.appendChild(
            card
        );
    });
}

async function updateBingoItemsPreview() {
    const selectedCategoryId =
        categorySelect.value;

    const selectedTagIds =
        getSelectedBingoTagIds();

    const selectedLanguageId =
        Number(languageSelect.value);

    selectedPoolItemIds.clear();

    if (!selectedCategoryId) {
        availableBingoItems = [];

        showAvailableItemsMessage(
            "Please choose a category."
        );

        return;
    }

    if (
        selectedCategoryId ===
            "browse-by-tag" &&
        selectedTagIds.length === 0
    ) {
        availableBingoItems = [];

        showAvailableItemsMessage(
            "Select at least one tag to show items."
        );

        return;
    }

    showAvailableItemsMessage(
        "Loading items..."
    );

    availableBingoItems =
        await dbGetBingoItems(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

    if (
        availableBingoItems.length === 0
    ) {
        showAvailableItemsMessage(
            "No items matched these filters."
        );

        return;
    }

    renderAvailableBingoItems();
}

async function refreshBingoAccountState() {
    await updateBingoSaveAccessMessage();
    await loadSavedBingoSets();
}

window.addEventListener(
    "focus",
    refreshBingoAccountState
);

document.addEventListener(
    "visibilitychange",
    () => {
        if (!document.hidden) {
            refreshBingoAccountState();
        }
    }
);

db.auth.onAuthStateChange(
    () => {
        setTimeout(
            refreshBingoAccountState,
            0
        );
    }
);

initializeBingoPage();