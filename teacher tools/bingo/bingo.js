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
const gridSize =
    document.getElementById(
        "gridSize"
    );

const generateBtn =
    document.getElementById(
        "generateBtn"
    );
const downloadPdfBtn =
    document.getElementById(
        "downloadPdfBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );



categorySelect.addEventListener(
    "change",
    () =>
       { updateSelectedItemsPreview(
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
    () =>
       { updateSelectedItemsPreview(
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
        await dbGetItems(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

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
}



async function downloadPdf() {

    downloadPdfBtn.disabled = true;

    downloadPdfBtn.classList.add(
        "downloading"
    );

    downloadPdfBtn.textContent =
        "Generating PDF...";

    const {
        jsPDF
    } = window.jspdf;

    const pdfLayout =
        document.getElementById(
            "pdfLayout"
        ).value;
    

    const pdf =
        new jsPDF({

            orientation:
                pdfLayout === "1"
                    ? "portrait"
                    : "landscape",

            unit: "mm",

            format: "a4"

        });

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const cards =
        document.querySelectorAll(
            ".bingo-wrapper"
        );

    for (
        let i = 0;
        i < cards.length;
        i++
    ) {

        const canvas =
            await html2canvas(
                cards[i],
                {
                    scale: 2,
                    useCORS: true
                }
            );

        const imgData =
            canvas.toDataURL(
                "image/png"
            );

        const margin =
            10;

        const imgWidth =
            pageWidth -
            margin * 2;

        const imgHeight =
            canvas.height *
            imgWidth /
            canvas.width;

        if (pdfLayout === "1") {

            if (i > 0) {

                pdf.addPage();

            }

        } else {

            if (
                i > 0 &&
                i % 2 === 0
            ) {

                pdf.addPage(
                    "a4",
                    "landscape"
                );

            }

        }

        if (pdfLayout === "1") {

            pdf.addImage(

                imgData,

                "PNG",

                margin,

                margin,

                imgWidth,

                imgHeight

            );

        } else {

            const gap = 8;

            const topMargin = 8;
            const sideMargin = 8;

            const availableWidth =
                pageWidth -
                sideMargin * 2 -
                gap;

            const availableHeight =
                pageHeight -
                topMargin * 2;

            const cardWidth =
                availableWidth / 2;

            let cardHeight =
                canvas.height *
                cardWidth /
                canvas.width;

            if (
                cardHeight >
                availableHeight
            ) {

                cardHeight =
                    availableHeight;

            }

            const x =

                (i % 2 === 0)

                ? sideMargin

                : sideMargin + cardWidth + gap;

            const y =
                (pageHeight - cardHeight) / 2;

            pdf.addImage(

                imgData,

                "PNG",

                x,

                y,

                cardWidth,

                cardHeight

            );

        }}

    const title =
        document.getElementById(
            "bingoTitle"
        ).value.trim();

    const fileName =
        title || "Bingo";

    pdf.save(
        `${fileName}.pdf`
    );

    downloadPdfBtn.disabled = false;

    downloadPdfBtn.classList.remove(
        "downloading"
    );

    downloadPdfBtn.textContent =
        "DOWNLOAD PDF";

}

function resetBingo (){
  
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

    await loadTags(
        tagsContainer,
        dbGetItems
    );

    await loadLanguages(
        languageSelect
    );

    await updateSelectedItemsPreview(
        dbGetItems,
        categorySelect,
        tagsContainer,
        languageSelect,
        selectedItemsList,
        selectedItemsCount
    );

}

initialize();