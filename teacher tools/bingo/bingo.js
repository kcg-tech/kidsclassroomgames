const categorySelect =
    document.getElementById(
        "categorySelect"
    );
const tagsContainer =
    document.getElementById(
        "tagsContainer"
    );
const languageSelect =
    document.getElementById(
        "languageSelect"
    );
const cardCount =
    document.getElementById(
        "cardCount"
    );
const selectedItemsList =
    document.getElementById(
        "selectedItemsList"
    );
const selectedItemsCount =
    document.getElementById(
        "selectedItemsCount"
    );
const bingoItemModeInputs =
    document.querySelectorAll(
        'input[name="bingoItemMode"]'
    );

let availableBingoItems = [];

let bingoItemMode = "all";

const selectedBingoItemIds =
    new Set();
const gridSize =
    document.getElementById(
        "gridSize"
    );

const generateBtn =
    document.getElementById(
        "generateBtn"
    );
const generatedCardsHeading =
    document.getElementById(
        "generatedCardsHeading"
    );
const downloadPdfBtn =
    document.getElementById(
        "downloadPdfBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

let generatedBingoCards = [];

function renderBingoItemsPreview() {
    selectedItemsList.innerHTML = "";

    const choosingSpecificItems =
        bingoItemMode === "specific";

    selectedItemsCount.textContent =
        choosingSpecificItems
            ? selectedBingoItemIds.size
            : availableBingoItems.length;

    availableBingoItems.forEach(item => {
        const card =
            document.createElement(
                choosingSpecificItems
                    ? "button"
                    : "div"
            );

        card.className =
            "preview-item";

        if (choosingSpecificItems) {
            card.type = "button";

            card.classList.add(
                "selectable-preview-item"
            );

            const isSelected =
                selectedBingoItemIds.has(
                    Number(item.id)
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
                    const itemId =
                        Number(item.id);

                    if (
                        selectedBingoItemIds.has(
                            itemId
                        )
                    ) {
                        selectedBingoItemIds.delete(
                            itemId
                        );
                    } else {
                        selectedBingoItemIds.add(
                            itemId
                        );
                    }

                    renderBingoItemsPreview();
                }
            );
        }

        const image =
            document.createElement(
                "img"
            );

        image.src = item.url;
        image.alt = item.name;

        const name =
            document.createElement(
                "div"
            );

        name.textContent =
            item.name;

        card.appendChild(image);
        card.appendChild(name);

        selectedItemsList.appendChild(
            card
        );
    });
}

async function updateBingoItemsPreview() {
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
                Number(checkbox.value)
        );

    const selectedLanguageId =
        Number(languageSelect.value);

    if (
        selectedCategoryId ===
            "browse-by-tag" &&
        selectedTagIds.length === 0
    ) {
        availableBingoItems = [];

        selectedBingoItemIds.clear();

        selectedItemsCount.textContent =
            "0";

        selectedItemsList.innerHTML = `
            <p class="item-filter-message">
                Select at least one tag to show items.
            </p>
        `;

        downloadPdfBtn.classList.add(
            "hidden"
        );

        generatedCardsHeading.classList.add(
            "hidden"
        );

        return;
    }

    availableBingoItems =
        await dbGetItems(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

    selectedBingoItemIds.clear();

    renderBingoItemsPreview();

    downloadPdfBtn.classList.add(
        "hidden"
    );

    generatedCardsHeading.classList.add(
        "hidden"
    );
}

categorySelect.addEventListener(
    "change",
    updateBingoItemsPreview
);

languageSelect.addEventListener(
    "change",
    updateBingoItemsPreview
);

bingoItemModeInputs.forEach(input => {
    input.addEventListener(
        "change",
        event => {
            bingoItemMode =
                event.target.value;

            selectedBingoItemIds.clear();

            renderBingoItemsPreview();
        }
    );
});

generateBtn.addEventListener(
  "click", generateBingo
);

downloadPdfBtn.addEventListener(
    "click",
    downloadPdf
);

resetBtn.addEventListener(
  "click", resetBingo

);

async function generateBingo() {

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

    const items =
        bingoItemMode === "specific"
            ? availableBingoItems.filter(
                item =>
                    selectedBingoItemIds.has(
                        Number(item.id)
                    )
            )
            : [...availableBingoItems];

    const gridSize =
        document.getElementById(
            "gridSize"
        ).value;

    const totalSquares =
        gridSize === "3x3"
            ? 9
            : 16;

    const numberOfCards =
      Number(cardCount.value);

    if (
        items.length <
        totalSquares
    ) {

        alert(
            `You need at least ${totalSquares} items.`
        );

        return;

    }
    const bingoCards =
        document.getElementById(
            "bingoCards"
        );

    bingoCards.innerHTML = "";
    generatedBingoCards = [];

    const usedLayouts =
      new Set();

      for (
          let cardIndex = 0;
          cardIndex < numberOfCards;
          cardIndex++
      ) {

          let bingoItems;

          let layoutKey;

          do {

              bingoItems =
                  shuffle(items)
                  .slice(
                      0,
                      totalSquares
                  );

              layoutKey =
                  bingoItems
                      .map(
                          item => item.name
                      )
                      .join("|");

          } while (
              usedLayouts.has(
                  layoutKey
              )
          );

          usedLayouts.add(
              layoutKey
          );

        generatedBingoCards.push({
            title:
                document.getElementById(
                    "bingoTitle"
                ).value.trim() ||
                "BINGO",

            gridSize:
                totalSquares === 9
                    ? 3
                    : 4,

            items:
                [...bingoItems]
        });

        const title =
            document.createElement(
                "h2"
            );

        title.className =
            "bingo-title";

        title.textContent =
            document.getElementById(
                "bingoTitle"
            ).value.trim() ||
            "BINGO";

        const cardWrapper =
            document.createElement(
                "div"
            );

        cardWrapper.className =
            "bingo-wrapper";

        const card =
            document.createElement(
                "div"
            );

        card.className =
            `bingo-card ${
                totalSquares === 9
                    ? "grid-3"
                    : "grid-4"
            }`;

        bingoItems.forEach(item => {

            const cell =
                document.createElement(
                    "div"
                );

            cell.className =
                "bingo-cell";

            cell.innerHTML = `
                <img
                    src="${item.url}"
                    alt="${item.name}"
                    crossorigin="anonymous"
                >

                <p>${item.name}</p>
            `;

            card.appendChild(
                cell
            );

        });

        cardWrapper.appendChild(
            title
        );

        cardWrapper.appendChild(
            card
        );

        bingoCards.appendChild(
            cardWrapper
        );

      }

    bingoCards.scrollIntoView({
       
        block: "start"
    })

    downloadPdfBtn.classList.remove(
    "hidden"
);

    downloadPdfBtn.classList.remove(
    "hidden"
);
}

async function addBingoJapaneseFont(
    pdf
) {
    const response =
        await fetch(
            "../flash card/fonts/NotoSansJP.ttf"
        );

    if (!response.ok) {
        throw new Error(
            "Could not load the Japanese font."
        );
    }

    const fontBuffer =
        await response.arrayBuffer();

    const fontBytes =
        new Uint8Array(
            fontBuffer
        );

    let binaryString = "";

    const chunkSize = 32768;

    for (
        let index = 0;
        index < fontBytes.length;
        index += chunkSize
    ) {
        const chunk =
            fontBytes.subarray(
                index,
                index + chunkSize
            );

        binaryString +=
            String.fromCharCode(
                ...chunk
            );
    }

    const fontBase64 =
        btoa(binaryString);

    pdf.addFileToVFS(
        "NotoSansJP.ttf",
        fontBase64
    );

    pdf.addFont(
        "NotoSansJP.ttf",
        "NotoSansJP",
        "normal"
    );
}

function bingoTextContainsJapanese(
    text
) {
    return /[\u3040-\u30ff\u3400-\u9fff]/
        .test(text);
}

function loadBingoPdfImage(
    url
) {
    return new Promise(
        (resolve, reject) => {
            const image =
                new Image();

            image.crossOrigin =
                "anonymous";

            image.onload =
                () => resolve(image);

            image.onerror =
                () => reject(
                    new Error(
                        "A Bingo image could not be loaded."
                    )
                );

            image.src = url;
        }
    );
}

function setBingoPdfFont(
    pdf,
    text,
    useBold = false
) {
    if (
        bingoTextContainsJapanese(
            text
        )
    ) {
        pdf.setFont(
            "NotoSansJP",
            "normal"
        );

        return;
    }

    pdf.setFont(
        "helvetica",
        useBold
            ? "bold"
            : "normal"
    );
}

function drawCenteredBingoText(
    pdf,
    text,
    centerX,
    centerY,
    maxWidth,
    startingFontSize,
    useBold = false
) {
    setBingoPdfFont(
        pdf,
        text,
        useBold
    );

    let fontSize =
        startingFontSize;

    pdf.setFontSize(
        fontSize
    );

    while (
        fontSize > 6 &&
        pdf.getTextWidth(text) >
            maxWidth
    ) {
        fontSize -= 1;

        pdf.setFontSize(
            fontSize
        );
    }

    const lines =
        pdf.splitTextToSize(
            text,
            maxWidth
        );

    const lineHeight =
        fontSize * 0.38;

    const totalHeight =
        lineHeight *
        lines.length;

    const startY =
        centerY -
        totalHeight / 2 +
        lineHeight * 0.8;

    pdf.text(
        lines,
        centerX,
        startY,
        {
            align: "center"
        }
    );

    if (
        bingoTextContainsJapanese(
            text
        )
    ) {
        const boldOffset =
            0.1;

        pdf.text(
            lines,
            centerX - boldOffset,
            startY,
            {
                align: "center"
            }
        );

        pdf.text(
            lines,
            centerX + boldOffset,
            startY,
            {
                align: "center"
            }
        );
    }
}

async function drawBingoPdfCard(
    pdf,
    cardData,
    areaX,
    areaY,
    areaWidth,
    areaHeight
) {
    const titleHeight =
        14;

    const boardSize =
        Math.min(
            areaWidth,
            areaHeight -
                titleHeight
        );

    const boardX =
        areaX +
        (
            areaWidth -
            boardSize
        ) / 2;

    const totalCardHeight =
        titleHeight +
        boardSize;

    const cardTop =
        areaY +
        (
            areaHeight -
            totalCardHeight
        ) / 2;

    drawCenteredBingoText(
        pdf,
        cardData.title,
        areaX + areaWidth / 2,
        cardTop + titleHeight / 2,
        areaWidth - 6,
        18,
        true
    );

    const boardY =
        cardTop +
        titleHeight;

    const cellSize =
        boardSize /
        cardData.gridSize;

    pdf.setDrawColor(
        20,
        20,
        20
    );

    pdf.setLineWidth(
        0.5
    );

    for (
        let index = 0;
        index <
            cardData.items.length;
        index++
    ) {
        const item =
            cardData.items[index];

        const column =
            index %
            cardData.gridSize;

        const row =
            Math.floor(
                index /
                cardData.gridSize
            );

        const cellX =
            boardX +
            column * cellSize;

        const cellY =
            boardY +
            row * cellSize;

        pdf.rect(
            cellX,
            cellY,
            cellSize,
            cellSize
        );

        const image =
            await loadBingoPdfImage(
                item.url
            );

        const imageAreaHeight =
            cellSize * 0.67;

        const imageMaxWidth =
            cellSize * 0.82;

        const imageMaxHeight =
            imageAreaHeight * 0.82;

        const imageRatio =
            image.naturalWidth /
            image.naturalHeight;

        let drawWidth =
            imageMaxWidth;

        let drawHeight =
            drawWidth /
            imageRatio;

        if (
            drawHeight >
            imageMaxHeight
        ) {
            drawHeight =
                imageMaxHeight;

            drawWidth =
                drawHeight *
                imageRatio;
        }

        const imageX =
            cellX +
            (
                cellSize -
                drawWidth
            ) / 2;

        const imageY =
            cellY +
            (
                imageAreaHeight -
                drawHeight
            ) / 2;

        const imageFormat =
            /\.(jpe?g)(\?|$)/i.test(
                item.url
            )
                ? "JPEG"
                : "PNG";

        pdf.addImage(
            image,
            imageFormat,
            imageX,
            imageY,
            drawWidth,
            drawHeight
        );

        const textAreaY =
            cellY +
            imageAreaHeight;

        const textAreaHeight =
            cellSize -
            imageAreaHeight;

        drawCenteredBingoText(
            pdf,
            item.name,
            cellX + cellSize / 2,
            textAreaY +
                textAreaHeight / 2,
            cellSize - 3,
            cardData.gridSize === 3
                ? 12
                : 9,
            true
        );
    }
}

async function downloadPdf() {
    if (
        generatedBingoCards.length === 0
    ) {
        alert(
            "Generate at least one Bingo card first."
        );

        return;
    }

    downloadPdfBtn.disabled = true;

    downloadPdfBtn.classList.add(
        "downloading"
    );

    downloadPdfBtn.textContent =
        "Generating PDF...";

    try {
        const {
            jsPDF
        } = window.jspdf;

        const pdfLayout =
            document.getElementById(
                "pdfLayout"
            ).value;

        const cardsPerPage =
            pdfLayout === "1"
                ? 1
                : 2;

        const orientation =
            cardsPerPage === 1
                ? "portrait"
                : "landscape";

        const pdf =
            new jsPDF({
                orientation,
                unit: "mm",
                format: "a4"
            });

        await addBingoJapaneseFont(
            pdf
        );

        const pageWidth =
            pdf.internal.pageSize
                .getWidth();

        const pageHeight =
            pdf.internal.pageSize
                .getHeight();

        const margin =
            8;

        const gap =
            8;

        for (
            let index = 0;
            index <
                generatedBingoCards.length;
            index++
        ) {
            const positionOnPage =
                index %
                cardsPerPage;

            if (
                index > 0 &&
                positionOnPage === 0
            ) {
                pdf.addPage(
                    "a4",
                    orientation
                );
            }

            let areaX =
                margin;

            let areaY =
                margin;

            let areaWidth =
                pageWidth -
                margin * 2;

            const areaHeight =
                pageHeight -
                margin * 2;

            if (
                cardsPerPage === 2
            ) {
                areaWidth =
                    (
                        pageWidth -
                        margin * 2 -
                        gap
                    ) / 2;

                areaX =
                    margin +
                    positionOnPage *
                    (
                        areaWidth +
                        gap
                    );
            }

            await drawBingoPdfCard(
                pdf,
                generatedBingoCards[
                    index
                ],
                areaX,
                areaY,
                areaWidth,
                areaHeight
            );
        }

        const enteredTitle =
            document.getElementById(
                "bingoTitle"
            ).value.trim();

        const fileName =
            enteredTitle ||
            "Bingo";

        pdf.save(
            `${fileName}.pdf`
        );
    } catch (error) {
        console.error(
            "Could not create Bingo PDF:",
            error
        );

        alert(
            "The Bingo PDF could not be created. Check the browser console for details."
        );
    } finally {
        downloadPdfBtn.disabled =
            false;

        downloadPdfBtn.classList.remove(
            "downloading"
        );

        downloadPdfBtn.textContent =
            "DOWNLOAD PDF";
    }
}

function resetBingo (){

    generatedCardsHeading.classList.add(
    "hidden"
);
  
    downloadPdfBtn.classList.add(
    "hidden"
);
}

async function initialize() {

    populateCardCount(
        cardCount
    );

    await loadCategories(
        categorySelect
    );

    categorySelect.querySelector(
        'option[value=""]'
    )?.remove();

    categorySelect.innerHTML = `
        <option value="browse-by-tag">
            All Categories (Filter by Tags)
        </option>
    ` + categorySelect.innerHTML;


    await loadTags(
        tagsContainer,
        updateBingoItemsPreview
    );

    await loadLanguages(
        languageSelect
    );

    await updateBingoItemsPreview(
        dbGetItems,
        categorySelect,
        tagsContainer,
        languageSelect,
        selectedItemsList,
        selectedItemsCount
    );

}

initialize();