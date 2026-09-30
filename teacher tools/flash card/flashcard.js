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
const cardsPerPage =
    document.getElementById(
        "cardsPerPage"
    );
const orientation =
    document.getElementById(
        "orientation"
    );
const selectedItemsList =
    document.getElementById(
        "selectedItemsList"
    );
const selectedItemsCount =
    document.getElementById(
        "selectedItemsCount"
    );
const displayMode =
    document.getElementById(
        "displayMode"
    );
const cardSides =
    document.getElementById(
        "cardSides"
    );
const twoSidedOption =
    document.getElementById(
        "twoSidedOption"
    );
const twoSidedLoginMessage =
    document.getElementById(
        "twoSidedLoginMessage"
    );
const flashcardLoginLink =
    document.getElementById(
        "flashcardLoginLink"
    );
const backLanguageControl =
    document.getElementById(
        "backLanguageControl"
    );
const duplexPrintInstructions =
    document.getElementById(
        "duplexPrintInstructions"
    );

const backLanguageSelect =
    document.getElementById(
        "backLanguageSelect"
    );
const generateBtn =
    document.getElementById(
        "generateBtn"
    );
const downloadPdfBtn =
    document.getElementById(
        "downloadPdfBtn"
    );
const generatedCardsContainer =
    document.getElementById(
        "generatedCardsContainer"
    );
const resetBtn =
    document.getElementById(
        "resetBtn"
    );
const previewPages =
    document.getElementById(
        "previewPages"
    );


let generatedItems = [];
let generatedBackItems = [];
let isFlashcardUserLoggedIn = false;

const PDF_FONT_SIZES = Object.freeze({
    1: 64,
    2: 50,
    4: 36,
    8: 28,
    16: 20
});

const IMAGE_TEXT_AREA_RATIO = 0.30;

flashcardLoginLink.addEventListener(
    "click",
    () => {
        const flashcardState = {
            category:
                categorySelect.value,

            tagIds:
                Array.from(
                    tagsContainer.querySelectorAll(
                        "input:checked"
                    )
                ).map(
                    checkbox =>
                        checkbox.value
                ),

            frontLanguage:
                languageSelect.value,

            cardsPerPage:
                cardsPerPage.value,

            orientation:
                orientation.value,

            cardSides:
                cardSides.value,

            displayMode:
                displayMode.value,

            backLanguage:
                backLanguageSelect.value
        };

        sessionStorage.setItem(
            "flashcardReturnState",
            JSON.stringify(
                flashcardState
            )
        );

        const accountUrl =
            new URL(
                flashcardLoginLink.href,
                window.location.href
            );

        accountUrl.searchParams.set(
            "returnTo",
            window.location.pathname +
                window.location.search
        );

        flashcardLoginLink.href =
            accountUrl.href;
    }
);

async function updateFlashcardLoginAccess() {
    const { data, error } =
        await db.auth.getSession();

    if (error) {
        console.error(
            "Could not check flashcard login:",
            error
        );

        isFlashcardUserLoggedIn = false;
    } else {
        const user =
            data.session?.user;

        isFlashcardUserLoggedIn =
            Boolean(
                user &&
                !user.is_anonymous
            );
    }

    twoSidedOption.disabled =
        !isFlashcardUserLoggedIn;

    twoSidedOption.textContent =
        isFlashcardUserLoggedIn
            ? "Two-sided"
            : "Two-sided — Login required";

    twoSidedLoginMessage.classList.toggle(
        "hidden",
        isFlashcardUserLoggedIn
    );

    if (
        !isFlashcardUserLoggedIn &&
        cardSides.value === "two-sided"
    ) {
        cardSides.value =
            "one-sided";

        backLanguageControl.classList.add(
            "hidden"
        );

        duplexPrintInstructions.classList.add(
            "hidden"
        );
    }
}

cardSides.addEventListener("change", () => {
    const isTwoSided =
        cardSides.value === "two-sided";

    backLanguageControl.classList.toggle(
        "hidden",
        !isTwoSided
    );

    duplexPrintInstructions.classList.toggle(
        "hidden",
        !isTwoSided
    );
});

categorySelect.addEventListener(
    "change",
    () => {
        updateSelectedItemsPreview(
            dbGetItems,
            categorySelect,
            tagsContainer,
            languageSelect,
            selectedItemsList,
            selectedItemsCount
        );
        downloadPdfBtn.classList.add(
            "hidden"
        );
    }
);

languageSelect.addEventListener(
    "change",
    () => {
        updateSelectedItemsPreview(
            dbGetItems,
            categorySelect,
            tagsContainer,
            languageSelect,
            selectedItemsList,
            selectedItemsCount
        );
        downloadPdfBtn.classList.add(
            "hidden"
        );
    }

);

generateBtn.addEventListener(
    "click", generateFlashCards
);

downloadPdfBtn.addEventListener(
    "click",
    downloadPdf
);

[
    cardsPerPage,
    orientation,
    cardSides,
    displayMode,
    backLanguageSelect,
    tagsContainer
].forEach(control => {
    control.addEventListener(
        "change",
        () => {
            downloadPdfBtn.classList.add(
                "hidden"
            );
        }
    );
});

resetBtn.addEventListener(
    "click", reset

);

function createPreviewPage(
    cardsPerPage,
    side = "front") {
    const pageGroup =
        document.createElement("div");

    pageGroup.className =
        "preview-page-group";

    const pageLabel =
        document.createElement("p");

    pageLabel.className =
        "preview-page-label";

    pageLabel.textContent =
        side === "back" ? "Back" : "Front";

    const page =
        document.createElement("div");

    page.className =
        `preview-page preview-side-${side} ${orientation.value} layout-${cardsPerPage}`;

    pageGroup.appendChild(pageLabel);
    pageGroup.appendChild(page);
    previewPages.appendChild(pageGroup);

    return page;
}

function createFlashCard(
    item,
    mode = displayMode.value) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "flash-card";

    if (
        mode === "image-text"
    ) {

        card.innerHTML = `
            <img
                src="${item.url}"
                alt="${item.name}"
            >

            <p>${item.name}</p>
        `;

    }

    else if (
        mode === "image"
    ) {

        card.innerHTML = `
            <img
                src="${item.url}"
                alt="${item.name}"
            >
        `;

    }

    else {

        card.classList.add(
            "text-only"
        );

        card.innerHTML = `
            <p>${item.name}</p>
        `;

    }

    return card;

}

function fitPreviewCardText(card) {
    const text =
        card.querySelector("p");

    if (!text) {
        return;
    }

    const page =
        card.closest(".preview-page");

    const layoutClass = page
        ? Array.from(page.classList)
            .find(className =>
                className.startsWith("layout-")
            )
        : "";

    const cardsOnPage =
        Number(layoutClass?.split("-")[1]);

    const pageWidthMm =
        page?.classList.contains("landscape")
            ? 297
            : 210;

    const previewPixelsPerMm = page
        ? page.getBoundingClientRect().width /
            pageWidthMm
        : 1;

    const startingSize =
        PDF_FONT_SIZES[cardsOnPage]
            ? PDF_FONT_SIZES[cardsOnPage] *
                (25.4 / 72) *
                previewPixelsPerMm
            : Number.parseFloat(
                getComputedStyle(text).fontSize
            );

    if (!Number.isFinite(startingSize)) {
        return;
    }

    const minimumSize =
        Math.max(
            6,
            startingSize * 0.35
        );

    const isTextOnly =
        card.classList.contains("text-only");

    const maximumTextHeight =
        card.clientHeight *
        (isTextOnly
            ? 0.9
            : IMAGE_TEXT_AREA_RATIO);

    const measurement =
        text.cloneNode(true);

    const textStyle =
        getComputedStyle(text);

    Object.assign(
        measurement.style,
        {
            position: "fixed",
            left: "-10000px",
            top: "0",
            visibility: "hidden",
            pointerEvents: "none",
            display: "block",
            width: `${text.clientWidth}px`,
            minHeight: "0",
            maxHeight: "none",
            height: "auto",
            boxSizing: "border-box",
            whiteSpace: "normal",
            overflow: "visible",
            overflowWrap: "anywhere",
            fontFamily: textStyle.fontFamily,
            fontWeight: textStyle.fontWeight,
            lineHeight: "1.1",
            padding: textStyle.padding,
            border: "none"
        }
    );

    document.body.appendChild(measurement);

    let fontSize = startingSize;

    text.style.fontSize =
        `${fontSize}px`;

    measurement.style.fontSize =
        `${fontSize}px`;

    while (
        fontSize > minimumSize &&
        (
            measurement.scrollWidth >
                measurement.clientWidth + 1 ||
            measurement.scrollHeight >
                maximumTextHeight + 1
        )
    ) {
        fontSize -= 0.5;

        measurement.style.fontSize =
            `${fontSize}px`;
    }

    text.style.fontSize =
        `${fontSize}px`;

    measurement.remove();
}

function fitAllPreviewCardText() {
    previewPages
        .querySelectorAll(".flash-card")
        .forEach(fitPreviewCardText);
}

function schedulePreviewTextFit() {
    requestAnimationFrame(() => {
        requestAnimationFrame(
            fitAllPreviewCardText
        );
    });
}

function createPreviewSide(
    items,
    cardsPerSheet,
    mode,
    side
) {
    let currentPage =
        createPreviewPage(
            cardsPerSheet,
            side
        );

    items.forEach((item, index) => {
        const card =
            createFlashCard(
                item,
                mode
            );

        currentPage.appendChild(card);

        if (
            currentPage.children.length === cardsPerSheet &&
            index < items.length - 1
        ) {
            currentPage =
                createPreviewPage(
                    cardsPerSheet,
                    side
                );
        }
    });
}

function createTwoSidedPreview(
    frontItems,
    backItems,
    cardsPerSheet,
    frontMode
) {
    for (
        let pageStart = 0;
        pageStart < frontItems.length;
        pageStart += cardsPerSheet
    ) {
        const frontPage =
            createPreviewPage(
                cardsPerSheet,
                "front"
            );

        const backPage =
            createPreviewPage(
                cardsPerSheet,
                "back"
            );

        const pageEnd =
            Math.min(
                pageStart + cardsPerSheet,
                frontItems.length
            );

        for (
            let index = pageStart;
            index < pageEnd;
            index++
        ) {
            const frontCard =
                createFlashCard(
                    frontItems[index],
                    frontMode
                );

            const backCard =
                createFlashCard(
                    backItems[index],
                    "text"
                );

            frontPage.appendChild(frontCard);
            backPage.appendChild(backCard);
        }
    }
}

async function generateFlashCards() {

    const requestedTwoSided =
        cardSides.value === "two-sided";

    if (requestedTwoSided) {
        await updateFlashcardLoginAccess();

        if (!isFlashcardUserLoggedIn) {
            alert(
                "Please log in or create a free account to generate two-sided flashcards."
            );

            return;
        }
    }

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

    if (
        selectedCategoryId ===
            "browse-by-tag" &&
        selectedTagIds.length === 0
    ) {
        alert(
            "Please select at least one tag before generating flashcards."
        );

        return;
    }

    const items =
        await dbGetItems(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

    generatedItems = [...items];

    if (items.length === 0) {

        alert(
            "No flash cards matched the selected filters."
        );

        return;

    }

    previewPages.innerHTML = "";

    const cardsPerSheet =
        Number(
            cardsPerPage.value
        );

    if (cardSides.value === "two-sided") {
        const selectedBackLanguageId =
            Number(
                backLanguageSelect.value
            );

        const backItems =
            await dbGetItems(
                selectedCategoryId,
                selectedTagIds,
                selectedBackLanguageId
            );
        generatedBackItems = [...backItems];

        createTwoSidedPreview(
            items,
            backItems,
            cardsPerSheet,
            displayMode.value
        );
    } else {
        generatedBackItems = [];
        createPreviewSide(
            items,
            cardsPerSheet,
            displayMode.value,
            "front"
        );
    }

    schedulePreviewTextFit();

    generatedCardsContainer.classList.remove(
        "hidden"
    );
    previewPages.scrollIntoView({

        block: "start"
    })

    downloadPdfBtn.classList.remove(
        "hidden"
    );
}

function getPageLayout(
    cardsPerPage
) {

    switch (cardsPerPage) {

        case 1:

            return {

                cols: 1,
                rows: 1

            };

        case 2:

            return {

                cols: 2,
                rows: 1

            };

        case 4:

            return {

                cols: 2,
                rows: 2

            };

        case 8:

            return {

                cols: 2,
                rows: 4

            };

        case 16:

            return {

                cols: 4,
                rows: 4

            };

    }

}

function drawPdfCardBorder(
    pdf,
    x,
    y,
    cardWidth,
    cardHeight
) {

    pdf.roundedRect(
        x,
        y,
        cardWidth,
        cardHeight,
        4,
        4
    );

}

function drawPdfCardSeparator(
    pdf,
    x,
    y,
    cardWidth,
    imageArea
) {

    pdf.line(

        x,

        y + imageArea,

        x + cardWidth,

        y + imageArea

    );

}

async function drawPdfCardImage(

    pdf,
    item,
    x,
    y,
    cardWidth,
    imageArea

) {

    const img =
        new Image();

    img.src =
        item.url;

    await new Promise(

        resolve => {

            img.onload =
                resolve;

        }

    );


    const imageRatio =

        img.width /

        img.height;

    let drawWidth =
        cardWidth * 0.85;

    let drawHeight =
        drawWidth /
        imageRatio;

    if (

        drawHeight >

        imageArea * 0.85

    ) {

        drawHeight =
            imageArea * 0.85;

        drawWidth =
            drawHeight *
            imageRatio;

    }

    const imageX =

        x +

        (

            cardWidth -

            drawWidth

        ) / 2;

    const imageY =

        y +

        (

            imageArea -

            drawHeight

        ) / 2;

    pdf.addImage(

        img,

        "PNG",

        imageX,

        imageY,

        drawWidth,

        drawHeight

    );

}

function drawPdfCardText(

    pdf,
    item,
    x,
    y,
    cardWidth,
    textArea,
    imageArea,
    cardsPerSheet,
    fontName = "helvetica",
    fontStyle = "bold",
    rotationAngle = 0

) {

    const textY =

        y +

        imageArea +

        textArea / 2;

    const containsJapanese =
        /[\u3040-\u30ff\u3400-\u9fff]/
            .test(item.name);

    if (
        containsJapanese &&
        fontName === "helvetica"
    ) {
        fontName = "NotoSansJP";
        fontStyle = "normal";
    }

    pdf.setFont(
        fontName,
        fontStyle
    );

    let fontSize =
        PDF_FONT_SIZES[cardsPerSheet];

    const maxTextWidth =
        cardWidth - 6;

    const maxTextHeight =
        Math.max(
            textArea - 6,
            4
        );

    const minimumFontSize = 5;

    let lines = [];
    let lineHeight = 0;

    while (fontSize >= minimumFontSize) {
        pdf.setFontSize(fontSize);

        lines = pdf.splitTextToSize(

            item.name,

            maxTextWidth

        );

        lineHeight =
            fontSize * 0.45;

        const widestLine =
            Math.max(
                ...lines.map(
                    line =>
                        pdf.getTextWidth(line)
                ),
                0
            );

        const textHeight =
            lineHeight * lines.length;

        if (
            widestLine <= maxTextWidth &&
            textHeight <= maxTextHeight
        ) {
            break;
        }

        fontSize--;
    }

    fontSize =
        Math.max(
            fontSize,
            minimumFontSize
        );

    pdf.setFontSize(fontSize);

    const totalHeight =
        lineHeight *
        lines.length;

    const startY =
        textY -
        totalHeight / 2 +
        lineHeight * 0.8;

    const drawTextBlock = (
        horizontalOffset = 0
    ) => {
        if (!rotationAngle) {
            pdf.text(
                lines,
                x + cardWidth / 2 +
                    horizontalOffset,
                startY,
                {
                    align: "center"
                }
            );

            return;
        }

        lines.forEach((line, lineIndex) => {
            const normalBaseline =
                startY +
                lineIndex * lineHeight;

            const rotatedBaseline =
                textY * 2 - normalBaseline;

            const lineWidth =
                pdf.getTextWidth(line);

            // With a 180-degree PDF rotation, text extends left
            // from its insertion point. Starting half a line-width
            // to the right keeps the rotated line centered in its card.
            pdf.text(
                line,
                x + cardWidth / 2 +
                    lineWidth / 2 +
                    horizontalOffset,
                rotatedBaseline,
                {
                    angle: rotationAngle
                }
            );
        });
    };

    drawTextBlock();

    if (fontName === "NotoSansJP") {
        const boldOffset = 0.14;

        drawTextBlock(-boldOffset);
        drawTextBlock(boldOffset);
    }


}

function drawPdfBackPage(
    pdf,
    sheetStart,
    sheetEnd,
    layout,
    cardsPerSheet,
    margin,
    gap,
    cardWidth,
    cardHeight
) {
    pdf.addPage();

    for (
        let index = sheetStart;
        index <= sheetEnd;
        index++
    ) {
        const item =
            generatedBackItems[index];

        const position =
            index % cardsPerSheet;

        const originalCol =
            position % layout.cols;

        const originalRow =
            Math.floor(
                position / layout.cols
            );

        const isLandscape =
            orientation.value === "landscape";

        // Portrait keeps the existing mirrored-column placement.
        // Landscape keeps columns aligned but reverses rows so the
        // backs land correctly after the sheet is flipped.
        const col = isLandscape
            ? originalCol
            : layout.cols - 1 - originalCol;

        const row = isLandscape
            ? layout.rows - 1 - originalRow
            : originalRow;

        const x =
            margin +
            col * (cardWidth + gap);

        const y =
            margin +
            row * (cardHeight + gap);

        drawPdfCardText(
            pdf,
            item,
            x,
            y,
            cardWidth,
            cardHeight,
            0,
            cardsPerSheet,
            "helvetica",
            "bold",
            isLandscape ? 180 : 0
        );
    }
}

let previewResizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(previewResizeTimer);

    previewResizeTimer = setTimeout(
        fitAllPreviewCardText,
        120
    );
});

async function addJapaneseFont(pdf) {
    const response =
        await fetch(
            "fonts/NotoSansJP.ttf"
        );

    if (!response.ok) {
        throw new Error(
            "Could not load the Japanese font."
        );
    }

    const fontBuffer =
        await response.arrayBuffer();

    const fontBytes =
        new Uint8Array(fontBuffer);

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
            String.fromCharCode(...chunk);
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

async function downloadPdf() {

    const downloadingTwoSided =
        generatedBackItems.length > 0;

    if (downloadingTwoSided) {
        await updateFlashcardLoginAccess();

        if (!isFlashcardUserLoggedIn) {
            alert(
                "Please log in or create a free account to download two-sided flashcards."
            );

            return;
        }
    }

    downloadPdfBtn.disabled = true;

    downloadPdfBtn.classList.add(
        "downloading"
    );

    downloadPdfBtn.textContent =
        "Generating PDF...";

    const {
        jsPDF
    } = window.jspdf;

    const pdf =
        new jsPDF({

            orientation:
                orientation.value,

            unit: "mm",

            format: "a4"

        });

    await addJapaneseFont(pdf);

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const cardsPerSheet =
        Number(
            cardsPerPage.value
        );

    const layout =
        getPageLayout(

            cardsPerSheet

        );

    const margin = 10;

    const gap = 5;

    const cardWidth =

        (

            pageWidth -

            margin * 2 -

            gap * (layout.cols - 1)

        ) /

        layout.cols;

    const cardHeight =

        (

            pageHeight -

            margin * 2 -

            gap * (layout.rows - 1)

        ) /

        layout.rows;


    for (

        let index = 0;

        index < generatedItems.length;

        index++

    ) {

        const item =
            generatedItems[index];

        if (

            index > 0 &&

            index % cardsPerSheet === 0

        ) {

            pdf.addPage();

        }

        const position =

            index %

            cardsPerSheet;

        const col =

            position %

            layout.cols;

        const row =

            Math.floor(

                position /

                layout.cols

            );

        const x =

            margin +

            col *

            (cardWidth + gap);

        const y =

            margin +

            row *

            (cardHeight + gap);

        drawPdfCardBorder(

            pdf,

            x,

            y,

            cardWidth,

            cardHeight

        );

        const hasImage =
            displayMode.value !== "text";

        const hasText =
            displayMode.value !== "image";

        const textArea =
            hasText
                ? (
                    hasImage
                        ? cardHeight *
                            IMAGE_TEXT_AREA_RATIO
                        : cardHeight
                )
                : 0;

        const imageArea =
            hasImage
                ? cardHeight - textArea
                : 0;

        if (

            hasImage

        ) {

            await drawPdfCardImage(

                pdf,

                item,

                x,

                y,

                cardWidth,

                imageArea

            );

        }

        if (

            hasImage && hasText

        ) {

            drawPdfCardSeparator(

                pdf,

                x,

                y,

                cardWidth,

                imageArea

            );

        }

        if (hasText) {

            drawPdfCardText(

                pdf,

                item,

                x,

                y,

                cardWidth,

                textArea,

                imageArea,

                cardsPerSheet

            );

        }

        const isEndOfSheet =
            (index + 1) % cardsPerSheet === 0 ||
            index === generatedItems.length - 1;

        if (
            cardSides.value === "two-sided" &&
            isEndOfSheet
        ) {
            const sheetStart =
                index - (index % cardsPerSheet);

            drawPdfBackPage(
                pdf,
                sheetStart,
                index,
                layout,
                cardsPerSheet,
                margin,
                gap,
                cardWidth,
                cardHeight
            );
        }

        await new Promise(r => setTimeout(r, 0));

    }

    pdf.save(
        "flashcards.pdf"
    );

    downloadPdfBtn.disabled = false;

    downloadPdfBtn.classList.remove(
        "downloading"
    );

    downloadPdfBtn.textContent =
        "DOWNLOAD PDF";

}

function reset() {
    generatedItems = [];
    generatedBackItems = [];

    previewPages.innerHTML = "";

    generatedCardsContainer.classList.add(
        "hidden"
    );

    downloadPdfBtn.classList.add(
        "hidden"
    );
}

async function initialize() {

    await updateFlashcardLoginAccess();

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
        () => {
            updateSelectedItemsPreview(
                dbGetItems
            );

            downloadPdfBtn.classList.add(
                "hidden"
            );

            generatedCardsContainer.classList.add(
                "hidden"
            );
        }
    );

    await loadLanguages(
        languageSelect
    );

    await loadLanguages(
        backLanguageSelect
    );

    restoreFlashcardReturnState();

    await updateSelectedItemsPreview(
        dbGetItems,
        categorySelect,
        tagsContainer,
        languageSelect,
        selectedItemsList,
        selectedItemsCount
    );

}

window.addEventListener(
    "focus",
    updateFlashcardLoginAccess
);

document.addEventListener(
    "visibilitychange",
    () => {
        if (!document.hidden) {
            updateFlashcardLoginAccess();
        }
    }
);

db.auth.onAuthStateChange(
    () => {
        setTimeout(
            updateFlashcardLoginAccess,
            0
        );
    }
);

function restoreFlashcardReturnState() {
    const savedState =
        sessionStorage.getItem(
            "flashcardReturnState"
        );

    if (!savedState) {
        return;
    }

    try {
        const state =
            JSON.parse(savedState);

        if (state.category !== undefined) {
            categorySelect.value =
                state.category;
        }

        if (
            Array.isArray(
                state.tagIds
            )
        ) {
            const savedTagIds =
                new Set(
                    state.tagIds.map(
                        String
                    )
                );

            tagsContainer
                .querySelectorAll(
                    "input[type='checkbox']"
                )
                .forEach(checkbox => {
                    checkbox.checked =
                        savedTagIds.has(
                            String(
                                checkbox.value
                            )
                        );
                });
        }

        if (state.frontLanguage) {
            languageSelect.value =
                state.frontLanguage;
        }

        if (state.cardsPerPage) {
            cardsPerPage.value =
                state.cardsPerPage;
        }

        if (state.orientation) {
            orientation.value =
                state.orientation;
        }

        if (state.cardSides) {
            cardSides.value =
                state.cardSides;
        }

        if (state.displayMode) {
            displayMode.value =
                state.displayMode;
        }

        if (state.backLanguage) {
            backLanguageSelect.value =
                state.backLanguage;
        }

        backLanguageControl.classList.toggle(
            "hidden",
            cardSides.value !==
                "two-sided"
        );

        duplexPrintInstructions.classList.toggle(
            "hidden",
            cardSides.value !==
                "two-sided"
        );
    } catch (error) {
        console.error(
            "Could not restore flashcard settings:",
            error
        );
    }

    sessionStorage.removeItem(
        "flashcardReturnState"
    );
}

initialize();
