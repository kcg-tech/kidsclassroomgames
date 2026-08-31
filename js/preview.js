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

    let visibleCount = 10;

    const appendItem = (item, beforeNode = null) => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "preview-item";

        const image = document.createElement("img");
        const name = document.createElement("div");

        image.src = item.thumbnailUrl || item.url;
        image.alt = item.name;
        image.loading = "lazy";
        name.textContent = item.name;

        div.appendChild(image);
        div.appendChild(name);

        selectedItemsList.insertBefore(
            div,
            beforeNode
        );

    };

    items.slice(0, visibleCount).forEach(appendItem);

    if (items.length > visibleCount) {
        const showMoreButton = document.createElement("button");
        showMoreButton.type = "button";
        showMoreButton.className = "show-more-items-button";
        showMoreButton.textContent = "Show 10 More";
        selectedItemsList.appendChild(showMoreButton);

        showMoreButton.addEventListener("click", () => {
            const nextItems = items.slice(visibleCount, visibleCount + 10);
            nextItems.forEach(item => appendItem(item, showMoreButton));
            visibleCount += nextItems.length;
            showMoreButton.classList.toggle("hidden", visibleCount >= items.length);
        });
    }

}
