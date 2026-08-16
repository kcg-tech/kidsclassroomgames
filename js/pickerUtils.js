const PickerUtils = (() => {

    function createShuffledItems(items) {

        const shuffledItems = [...items];

        for (
            let index =
                shuffledItems.length - 1;
            index > 0;
            index--
        ) {
            const randomIndex =
                Math.floor(
                    Math.random() *
                    (index + 1)
                );

            [
                shuffledItems[index],
                shuffledItems[randomIndex]
            ] = [
                shuffledItems[randomIndex],
                shuffledItems[index]
            ];
        }

        return shuffledItems;
    }

    function showSelectedItem({
        modal,
        itemContainer,
        titleElement,
        item,
        displayMode = "image-text"
    }) {
        itemContainer.innerHTML = "";

        if (
            displayMode !== "text" &&
            item.url
        ) {
            const image =
                document.createElement("img");

            image.src = item.url;
            image.alt = item.name || "";

            itemContainer.appendChild(
                image
            );
        }

        if (
            displayMode !== "image"
        ) {
            const itemName =
                document.createElement("p");

            itemName.textContent =
                item.name || "(No name)";

            itemContainer.appendChild(
                itemName
            );
        }

        titleElement.textContent =
            "Selected Item";

        modal.classList.remove("hidden");
    }

    function closeSelectedItem(modal) {
        modal.classList.add("hidden");
    }

    function renderItems({
        container,
        items,
        pickedItemIds = [],
        displayMode = "image-text"
    }) {
        container.innerHTML = "";

        const colors = [
            "#d9ecff",
            "#ffe3a8",
            "#dff7c7",
            "#ffd8e8",
            "#e6dcff",
            "#cffff4"
        ];

        const pickedIds =
            new Set(
                pickedItemIds.map(Number)
            );

        items.forEach((item, index) => {

            const itemCard =
                document.createElement("div");

            itemCard.className =
                "picker-item";

            itemCard.dataset.itemId =
                String(item.id);

            itemCard.style.backgroundColor =
                colors[index % colors.length];

            if (
                pickedIds.has(
                    Number(item.id)
                )
            ) {
                itemCard.classList.add(
                    "picked"
                );
            }

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

            if (
                displayMode !== "image"
            ) {
                const itemName =
                    document.createElement("span");

                itemName.textContent =
                    item.name || "(No name)";

                itemCard.appendChild(
                    itemName
                );
            }

            container.appendChild(
                itemCard
            );
        });
    }

    return {
            createShuffledItems,
            renderItems,
            showSelectedItem,
            closeSelectedItem
        };

})();