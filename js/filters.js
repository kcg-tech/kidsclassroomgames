

async function loadCategories(categorySelect) {

    const categories =
        await dbGetCategories();

    categorySelect.innerHTML =
        '<option value="">All Categories</option>';

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category.id;

        option.textContent =
            category.name;

        categorySelect.appendChild(
            option
        );

    });

}

async function loadTags(tagsContainer) {

    const tags =
        await dbGetTags();

    tagsContainer.innerHTML = "";

    tags.forEach(tag => {

        const label =
            document.createElement(
                "label"
            );

        label.innerHTML = `
            <input
                type="checkbox"
                value="${tag.id}"
            >
            ${tag.name}
        `;

        const checkbox =
            label.querySelector(
                "input"
            );

        checkbox.addEventListener(
            "change",
            () =>
        updateSelectedItemsPreview(
            dbGetGuessTheImageItems
        )
);

        tagsContainer.appendChild(
            label
        );

    });

    

}

async function loadLanguages(languageSelect) {

    const languages =
        await dbGetLanguages();

    languageSelect.innerHTML = "";

    languages.forEach(language => {

        const option =
            document.createElement("option");

        option.value = language.id;

        option.textContent =
            language.name;

        languageSelect.appendChild(option);

    });

}

function initalizeFilters(){}