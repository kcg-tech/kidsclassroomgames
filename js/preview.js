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