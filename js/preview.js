async function updateSelectedItemsPreview(getItemsFunction) {

    const selectedCategoryId =
        categorySelect.value;

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

    const selectedLanguageId =
        Number(
            languageSelect.value
        );

    if (
        selectedCategoryId ===
            "browse-by-tag" &&
        selectedTagIds.length === 0
    ) {
        selectedItemsList.innerHTML = `
            <p class="item-filter-message">
                Select at least one tag to show items.
            </p>
        `;

        selectedItemsCount.textContent =
            "0";

        return;
    }

    const items =
        await getItemsFunction(
            selectedCategoryId,
            selectedTagIds,
            selectedLanguageId
        );

    selectedItemsList.innerHTML = "";

    selectedItemsCount.textContent =
        items.length;

    items.forEach(item => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "preview-item";

        div.innerHTML = `
            <img
                src="${item.url}"
                alt="${item.name}"
            >

            <div>
                ${item.name}
            </div>
        `;

        selectedItemsList.appendChild(
            div
        );

    });

}