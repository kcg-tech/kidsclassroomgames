/*
only english translation is validated
item tags are NOT validated

*/

const categorySelect = 
    document.getElementById("categorySelect");
const english =
    document.getElementById("english");
const japanese =
    document.getElementById("japanese");

const gamesContainer =
    document.getElementById("gamesContainer");

const selectAllGamesBtn =
    document.getElementById(
        "selectAllGamesBtn"
    );

const tagsContainer =
    document.getElementById(
        "tagsContainer"
    );

const imageInput =
    document.getElementById("imageInput");

const imagePreview =
    document.getElementById("imagePreview");

const dropZone = 
    document.getElementById("dropZone");

const saveBtn = 
    document.getElementById("saveBtn");

let itemSaveInProgress = false;

const searchInput =
    document.getElementById(
        "searchInput"
    );

const itemsContainer =
    document.getElementById(
        "itemsContainer"
    );

const filterCategory =
    document.getElementById(
        "filterCategory"
    );

const filterTagsContainer =
    document.getElementById(
        "filterTagsContainer"
    );

const itemFilterMessage =
    document.getElementById(
        "itemFilterMessage"
    );

const categoryClashDrafts =
    document.getElementById(
        "categoryClashDrafts"
    );

const categoryClashPresets =
    document.getElementById(
        "categoryClashPresets"
    );

const refreshCategoryClashBtn =
    document.getElementById(
        "refreshCategoryClashBtn"
    );

const categoryClashAdminMessage =
    document.getElementById(
        "categoryClashAdminMessage"
    );

const adminNavButtons =
    document.querySelectorAll(
        ".admin-nav-btn"
    );

const itemAdminSections =
    document.querySelectorAll(
        ".item-admin-section"
    );

const categoryClashAdminSection =
    document.querySelector(
        ".category-clash-admin-section"
    );

const tornadoDrafts =
    document.getElementById(
        "tornadoDrafts"
    );

const tornadoPresets =
    document.getElementById(
        "tornadoPresets"
    );

const refreshTornadoBtn =
    document.getElementById(
        "refreshTornadoBtn"
    );

const tornadoAdminMessage =
    document.getElementById(
        "tornadoAdminMessage"
    );

const tornadoAdminSection =
    document.querySelector(
        ".tornado-admin-section"
    );    

const homepageResourcesAdminSection =
    document.querySelector(
        ".homepage-resources-admin-section"
    );

const homepageResourceForm =
    document.getElementById(
        "homepageResourceForm"
    );

const homepageResourceId =
    document.getElementById(
        "homepageResourceId"
    );

const homepageResourceName =
    document.getElementById(
        "homepageResourceName"
    );

const homepageResourceDescription =
    document.getElementById(
        "homepageResourceDescription"
    );

const homepageResourceSection =
    document.getElementById(
        "homepageResourceSection"
    );

const homepageResourceUrl =
    document.getElementById(
        "homepageResourceUrl"
    );

const homepageResourceStatus =
    document.getElementById(
        "homepageResourceStatus"
    );

const homepageResourceOrder =
    document.getElementById(
        "homepageResourceOrder"
    );

const homepageResourceActive =
    document.getElementById(
        "homepageResourceActive"
    );

const homepageResourceNewTab =
    document.getElementById(
        "homepageResourceNewTab"
    );

const saveHomepageResourceBtn =
    document.getElementById(
        "saveHomepageResourceBtn"
    );

const cancelHomepageResourceEditBtn =
    document.getElementById(
        "cancelHomepageResourceEditBtn"
    );

const homepageResourceMessage =
    document.getElementById(
        "homepageResourceMessage"
    );

const homepageResourcesList =
    document.getElementById(
        "homepageResourcesList"
    );

let homepageResources = [];
const formData = {

    item: {

        categoryId: null,
        categoryName: "",
        imageFile: null,
        imagePath: "",
        imageUrl: "",
        thumbnailPath: "",
        thumbnailUrl: "",
        active: true,
        displayOrder: 1

    },

    games: [],

    tags: [],

    translations: {},

    editMode: false,
    editingItemId: null

};

async function loadCategories(){
    
    const categories = await dbGetCategories();
    categorySelect.innerHTML = "";
    categories.forEach(category =>{
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent= category.name;

    categorySelect.appendChild(option);
});

}

async function loadGames(){
    
    const games = await dbgetGames();
    console.log("getting games");
    gamesContainer.innerHTML = "";

    games.forEach(game=>{

        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = game.id;
        label.appendChild(checkbox);
        label.append(" "+ game.name);
        gamesContainer.appendChild(label);
        
    });

}

async function loadTags() {

    const tags =
        await dbGetTags();

    tagsContainer.innerHTML = "";

    tags.forEach(tag => {

        const label =
            document.createElement(
                "label"
            );

        const checkbox =
            document.createElement(
                "input"
            );

        checkbox.type =
            "checkbox";

        checkbox.value =
            tag.id;

        checkbox.addEventListener(
            "change",
            () => {

                if (
                    checkbox.checked
                ) {

                    formData.tags.push(
                        tag.id
                    );

                }
                else {

                    formData.tags =
                        formData.tags.filter(
                            id =>
                                id !== tag.id
                        );

                }

            }
        );

        label.appendChild(
            checkbox
        );

        label.append(
            " " + tag.name
        );

        tagsContainer.appendChild(
            label
        );

        tagsContainer.appendChild(
            document.createElement(
                "br"
            )
        );

    });

}

imageInput.addEventListener("change", () => {

    const file =
        imageInput.files[0];

    if(!file)
        return;
    
    formData.item.imageFile = file;

    previewImage(file);

});

function previewImage(file){

    const url =
    URL.createObjectURL(file);

    imagePreview.src = url;
    imagePreview.style.display = "block";
};

dropZone.addEventListener("click",()=>{
    imageInput.click();
})

dropZone.addEventListener("dragover",(event)=>{
    event.preventDefault();
    dropZone.classList.add("dragover");
})

dropZone.addEventListener("drop",(event)=>{
    event.preventDefault();

    dropZone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if(!file) return;
    
    formData.item.imageFile = file;
    previewImage(file);
})

dropZone.addEventListener("dragleave",()=>{

    dropZone.classList.remove("dragover");

});


saveBtn.addEventListener("click", async () => {

    if (itemSaveInProgress) {
        return;
    }

    updateFormData();

    if (!validateItem(formData))
        return;

    if (!validateGames(formData))
        return;

    itemSaveInProgress = true;
    saveBtn.disabled = true;
    saveBtn.setAttribute(
        "aria-busy",
        "true"
    );
    saveBtn.textContent =
        formData.editMode
            ? "Updating..."
            : "Saving...";

    try {
        if (formData.editMode) {

            await updateItem(formData);

        }
        else {

            await saveItem(formData);

        }
    }
    finally {
        itemSaveInProgress = false;
        saveBtn.disabled = false;
        saveBtn.removeAttribute(
            "aria-busy"
        );
        saveBtn.textContent =
            formData.editMode
                ? "Update Item"
                : "Save Item";
    }


});

searchInput.addEventListener(
    "input",
    loadItems
);

filterCategory.addEventListener(
    "change",
    async () => {
        await updateSavedItemTagFilters();
        await loadItems();
    }
);

filterTagsContainer.addEventListener(
    "change",
    loadItems
);

selectAllGamesBtn.addEventListener(
    "click",
    () => {

        gamesContainer
            .querySelectorAll(
                'input[type="checkbox"]'
            )
            .forEach(checkbox => {

                checkbox.checked = true;

            });

    }
);

async function updateSavedItemTagFilters() {
    filterTagsContainer.innerHTML = "";

    const selectedCategory =
        filterCategory.value;

    if (!selectedCategory) {
        return;
    }

    const results =
        await Promise.all([
            dbGetTags(),
            dbGetItemTags(),
            dbGetAllItems()
        ]);

    const tags =
        results[0];

    const itemTags =
        results[1];

    const items =
        results[2];

    const matchingItemIds =
        new Set(
            items
                .filter(
                    item =>
                        selectedCategory ===
                            "browse-by-tag" ||
                        String(
                            item.category_id
                        ) === selectedCategory
                )
                .map(
                    item =>
                        item.id
                )
        );

    const availableTagIds =
        new Set(
            itemTags
                .filter(
                    itemTag =>
                        matchingItemIds.has(
                            itemTag.item_id
                        )
                )
                .map(
                    itemTag =>
                        itemTag.tag_id
                )
        );

    tags
        .filter(
            tag =>
                availableTagIds.has(
                    tag.id
                )
        )
        .forEach(tag => {
            const label =
                document.createElement(
                    "label"
                );

            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";

            checkbox.value =
                tag.id;

            label.appendChild(
                checkbox
            );

            label.append(
                ` ${tag.name}`
            );

            filterTagsContainer.appendChild(
                label
            );
        });
}

async function loadCategoryFilter() {

    const categories =
        await dbGetCategories();

    filterCategory.innerHTML =
        `
        <option value="">
            Choose a Category or Browse by Tag
        </option>

        <option value="browse-by-tag">
            Browse by Tag (All Categories)
        </option>
        `;

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category.id;

        option.textContent =
            category.name;

        filterCategory.appendChild(
            option
        );

    });

}

async function saveItem(formData) {
    
    let itemId = null;
    let imagePath = null;
    let thumbnailPath = null;
    const savedGameIds = [];
    
    try{

        const englishLanguage =
            await dbGetLanguageByCode("en");

        if (!englishLanguage) {

            throw new Error(
                "English language not found"
            );

        }

        const duplicateItems =
            await dbGetTranslationByText(
                englishLanguage.id,
                formData.translations.en
            );

        if (duplicateItems.length > 0) {

            alert(
                "English item already exists. The image was not uploaded."
            );

            return;

        }
        
        const image =
            await storageUploadImage(
            formData.item.imageFile,
            formData.item.categoryName,
            formData.translations.en
            
        );

        if (!image){
            throw new Error(
                "Image upload failed"
            );
        }

        formData.item.imagePath = image.imagePath;
        formData.item.imageUrl = image.imageUrl;
        formData.item.thumbnailPath = image.thumbnailPath;
        formData.item.thumbnailUrl = image.thumbnailUrl;
        imagePath = image.imagePath;
        thumbnailPath = image.thumbnailPath;

        
        const savedItem =
        await dbSaveItem(formData.item);

        if (!savedItem){
            throw new Error(
                "Item save failed"
            );
        }

        formData.item.id = savedItem.id;
        itemId = savedItem.id; 

        const japaneseLanguage =
            await dbGetLanguageByCode("jp");

        if (!japaneseLanguage) {

            throw new Error(
                "Japanese language not found"
            );

        }

        const savedTranslation =
        await dbSaveTranslation(
            formData.item.id,
            englishLanguage.id,
            formData.translations.en
        );

        const savedJapaneseTranslation =
        await dbSaveTranslation(
            formData.item.id,
            japaneseLanguage.id,
            formData.translations.jp
        );

        if (!savedJapaneseTranslation) {

            throw new Error(
                "Japanese translation save failed"
            );

        }

        if (!savedTranslation) {

            throw new Error(
                "Translation save failed"
            );

        }
        

        for (const gameId of formData.games) {

            const savedGame =
            await dbSaveItemGame(
                formData.item.id,
                gameId
        );

        console.log(savedGame);

            if (!savedGame){
                throw new Error(
                    "Game save failed"
                );
            }

        savedGameIds.push(savedGame.id);

        }

        for (const tagId of formData.tags) {

            const savedTag =
                await dbSaveItemTag(
                    formData.item.id,
                    tagId
                );

            if (!savedTag) {

                throw new Error(
                    "Tag save failed"
                );

            }

        }

        alert("Item has been saved.");

        resetForm();

        console.log("AFTER RESET");

        await loadItems();

        console.log("AFTER LOAD ITEMS");

    }
    catch(error){

        console.error(error);

            for (const itemGameId of savedGameIds) {

            await dbDeleteItemGame(
                itemGameId
            );

        }

        if (itemId) {

            await dbDeleteItem(itemId);

        }

        await storageDeleteImages([
            imagePath,
            thumbnailPath
        ]);

        alert(error.message);
    }
    
};

async function updateItem(formData) {
    
    console.log(
        "imageFile:",
        formData.item.imageFile
    );

    if (formData.item.imageFile) {

        console.log(
            "New image selected"
        );

        const image =
            await storageUploadImage(
                formData.item.imageFile,
                formData.item.categoryName,
                formData.translations.en
            );

        if (!image) {

            throw new Error(
                "Image upload failed"
            );

        }

        formData.item.imageUrl =
            image.imageUrl;

        formData.item.imagePath =
            image.imagePath;

        formData.item.thumbnailUrl =
            image.thumbnailUrl;

        formData.item.thumbnailPath =
            image.thumbnailPath;

    }
    else {

        console.log(
            "Keeping current image"
        );

        formData.item.imageUrl =
            formData.oldImageUrl;

        formData.item.imagePath =
            formData.oldImagePath;

        formData.item.thumbnailUrl =
            formData.oldThumbnailUrl;

        formData.item.thumbnailPath =
            formData.oldThumbnailPath;

    }


    const updatedItem =
        await dbUpdateItem(
            formData.editingItemId,
            formData.item
        );

    console.log(updatedItem);

    if (!updatedItem) {
        if (formData.item.imageFile) {
            await storageDeleteImages([
                formData.item.imagePath,
                formData.item.thumbnailPath
            ]);
        }

        throw new Error("Item update failed");
    }

    if (
        formData.item.imageFile &&
        formData.oldImagePath
    ) {

        await storageDeleteImages([
            formData.oldImagePath,
            formData.oldThumbnailPath
        ]);

    }
    
    const englishLanguage =
        await dbGetLanguageByCode("en");

    const updatedEnglish =
        await dbUpdateTranslation(
            formData.editingItemId,
            englishLanguage.id,
            formData.translations.en
        );

    console.log(updatedEnglish);    

    const japaneseLanguage =
        await dbGetLanguageByCode("jp");

    const updatedJapanese =
        await dbUpdateTranslation(
            formData.editingItemId,
            japaneseLanguage.id,
            formData.translations.jp
        );

    console.log(updatedJapanese);

    const deletedGames =
        await dbDeleteItemGames(
            formData.editingItemId
        );

    if (!deletedGames) {

        throw new Error(
            "Could not delete item games"
        );

    };

    for (const gameId of formData.games) {

        const savedGame =
            await dbSaveItemGame(
                formData.editingItemId,
                gameId
            );

        if (!savedGame) {

            throw new Error(
                "Could not save game"
            );

        }

    };

    const deletedTags =
        await dbDeleteItemTags(
            formData.editingItemId
        );

    if (!deletedTags) {

        throw new Error(
            "Could not delete tags"
        );

    };

    for (const tagId of formData.tags) {

    const savedTag =
        await dbSaveItemTag(
            formData.editingItemId,
            tagId
        );

    if (!savedTag) {

            throw new Error(
                "Could not save tag"
            );

        }

    };


    alert("Item has been updated.");

    resetForm();

    await loadItems();

}

function updateFormData() {

    formData.item.categoryId = Number(categorySelect.value);
    formData.item.categoryName =
    categorySelect.options[
        categorySelect.selectedIndex
    ].text;
    formData.translations = {
        en: english.value.trim(),
        jp: japanese.value.trim()
    }
    formData.games = [];

    const checkedGames = document.querySelectorAll(
        '#gamesContainer input[type="checkbox"]:checked'
    );

     checkedGames.forEach(game => {

        formData.games.push(
            Number(game.value)
        );

    });

}

async function loadItems() {

    const items =
        await dbGetAllItems();

    const translations =
        await dbGetTranslations();

    const itemGames =
        await dbGetItemGames();

    const itemTags =
        await dbGetItemTags();

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        filterCategory.value;

    const selectedTagIds =
        Array.from(
            filterTagsContainer.querySelectorAll(
                'input[type="checkbox"]:checked'
            )
        )
        .map(
            checkbox =>
                Number(
                    checkbox.value
                )
        );

    const browsingByTag =
        selectedCategory ===
            "browse-by-tag";

    itemsContainer.innerHTML = "";

    if (!selectedCategory) {
        itemFilterMessage.textContent =
            "Choose a category or browse by tag to view saved items.";

        return;
    }

    if (
        browsingByTag &&
        selectedTagIds.length === 0
    ) {
        itemFilterMessage.textContent =
            "Select at least one tag to view saved items from all categories.";

        return;
    }

    itemFilterMessage.textContent = "";

    items
        .filter(item => {
            const englishTranslation =
                translations.find(
                    translation =>
                        translation.item_id ===
                            item.id &&
                        translation.language_id ===
                            1
                );

            const englishName =
                englishTranslation?.text || "";

            const searchMatch =
                englishName
                    .toLowerCase()
                    .includes(
                        searchText
                    );

            const categoryMatch =
                browsingByTag ||
                String(
                    item.category_id
                ) === selectedCategory;

            const itemTagIds =
                itemTags
                    .filter(
                        itemTag =>
                            itemTag.item_id ===
                                item.id
                    )
                    .map(
                        itemTag =>
                            itemTag.tag_id
                    );

            const tagsMatch =
                selectedTagIds.every(
                    tagId =>
                        itemTagIds.includes(
                            tagId
                        )
                );

            return (
                searchMatch &&
                categoryMatch &&
                tagsMatch
            );
        })
        .forEach(item => {

            const div =
                document.createElement("div");
            
                div.className = "itemDiv";
                

            const img =
                document.createElement("img");

            img.src = item.thumbnail_url || item.image_url;
            img.loading = "lazy";
            img.width = 100;

            div.appendChild(img);

            const englishTranslation =
                translations.find(
                    translation =>
                        translation.item_id === item.id &&
                        translation.language_id === 1
                );

            const japaneseTranslation =
                translations.find(
                    translation =>
                        translation.item_id === item.id &&
                        translation.language_id === 2
                );

            
            const englishText =
            document.createElement("div");

            englishText.textContent =
                englishTranslation
                    ? englishTranslation.text
                    : "(No English)";
            

            const japaneseText = 
            document.createElement("div");

            japaneseText.textContent =
                    japaneseTranslation?.text ||
                    "(No Japanese)";
            

            const idText =
                document.createElement("div");

            idText.textContent =
                `Item ID: ${item.id}`;

            div.appendChild(englishText);
            div.appendChild(japaneseText);
            div.appendChild(idText);

            const editBtn =
                document.createElement("button");

            editBtn.textContent = "Edit";

            editBtn.addEventListener("click", ()=>{
                formData.editMode = true;
                formData.editingItemId = item.id;
                formData.oldImagePath = item.image_path;
                formData.oldImageUrl = item.image_url;
                formData.oldThumbnailPath = item.thumbnail_path;
                formData.oldThumbnailUrl = item.thumbnail_url;

                console.log(
                    formData.oldImagePath
                );
                console.log(
                    formData.oldImagePath
                );

                formData.item.imageUrl = item.image_url
                formData.item.thumbnailUrl = item.thumbnail_url || "";
                formData.item.thumbnailPath = item.thumbnail_path || "";

                document
                    .querySelectorAll(
                        '#gamesContainer input[type="checkbox"]'
                    )
                    .forEach(checkbox => {

                        checkbox.checked = false;

                    });

                const selectedGames =
                    itemGames.filter(
                        itemGame =>
                            itemGame.item_id === item.id
                    );

                selectedGames.forEach(itemGame => {

                    const checkbox =
                        document.querySelector(
                            `#gamesContainer input[value="${itemGame.game_id}"]`
                        );

                    if (checkbox) {

                        checkbox.checked = true;

                    }

                });

                 document
                    .querySelectorAll(
                        '#tagsContainer input[type="checkbox"]'
                    )
                    .forEach(checkbox => {

                        checkbox.checked = false;

                    });

                const selectedTags =
                    itemTags.filter(
                        itemTag =>
                            itemTag.item_id === item.id
                    );

                selectedTags.forEach(itemTag => {

                    const checkbox =
                        document.querySelector(
                            `#tagsContainer input[value="${itemTag.tag_id}"]`
                        );

                    if (checkbox) {

                        checkbox.checked = true;

                    }

                });

                formData.tags =
                    selectedTags.map(
                        itemTag =>
                            itemTag.tag_id
                    );



                imagePreview.src = item.image_url;
                imagePreview.style.display = "block";
                english.value =
                englishTranslation
                    ? englishTranslation.text
                    : "";
                japanese.value =
                japaneseTranslation
                    ? japaneseTranslation.text
                    : ""; 
                // ! ! !remove saveBTn later
                saveBtn.textContent = "Update Item";
                categorySelect.value = item.category_id;
            })

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", async()=>{
            await deleteItem(item);
        })

        div.appendChild(editBtn);
        div.appendChild(deleteBtn);


        itemsContainer.appendChild(div);

    });

};

function resetForm() {

    categorySelect.selectedIndex = 0;

    english.value = "";
    japanese.value = "";

    imageInput.value = "";

    imagePreview.src = "";
    imagePreview.style.display = "none";

    document
        .querySelectorAll(
            '#gamesContainer input[type="checkbox"]'
        )
        .forEach(checkbox => {

            checkbox.checked = false;

        });

    document
    .querySelectorAll(
        '#tagsContainer input[type="checkbox"]'
    )
    .forEach(checkbox => {

        checkbox.checked = false;

    });

    formData.editMode = false;
    formData.editingItemId = null;
    formData.item.imageFile = null;
    formData.item.imageUrl = "";
    formData.item.imagePath = "";
    formData.item.thumbnailUrl = "";
    formData.item.thumbnailPath = "";
    formData.oldImagePath = null;
    formData.oldImageUrl = null;
    formData.oldThumbnailPath = null;
    formData.oldThumbnailUrl = null;
    formData.tags = [];
    formData.games = [];


    saveBtn.textContent = "Save Item";

};

async function deleteItem(item) {

    const confirmed =
        confirm(
            `Delete item ${item.id}?`
        );

    if (!confirmed)
        return;

    const deletedTags =
        await dbDeleteItemTags(
            item.id
        );

    console.log(
        "tags deleted",
        deletedTags
    );

    if (!deletedTags) {
        alert(
            "The item's tag connections could not be deleted."
        );

        return;
    }    

    const deletedTranslations =
        await dbDeleteTranslations(
            item.id
        );

    console.log(
        "translations deleted",
        deletedTranslations
    );

    const deletedGames =
        await dbDeleteItemGames(
            item.id
        );

    console.log(
        "games deleted",
        deletedGames
    );

    const deletedItem =
        await dbDeleteItem(
            item.id
        );

    if (!deletedItem) {
        alert(
            "The item could not be deleted."
        );

        return;
    }

    console.log(
        "item deleted",
        deletedItem
    );

    const deletedImage =
        await storageDeleteImages([
            item.image_path,
            item.thumbnail_path
        ]);

    console.log(
        "image deleted",
        deletedImage
    );

    resetForm();

    await loadItems();

    alert("Item deleted.");

}

function renderAdminBoardList(
    container,
    boards,
    actionText,
    actionClass
) {
    container.innerHTML = "";

    if (boards.length === 0) {
        container.textContent =
            "No boards found.";

        return;
    }

    boards.forEach(board => {
        const row =
            document.createElement(
                "div"
            );

        row.className =
            "category-clash-admin-row";

        const name =
            document.createElement(
                "strong"
            );

        name.textContent =
            board.name;

        const button =
            document.createElement(
                "button"
            );

        button.type = "button";
        button.textContent =
            actionText;
        button.className =
            actionClass;
        button.dataset.boardId =
            board.id;
        button.dataset.boardName =
            board.name;

        row.appendChild(name);
        row.appendChild(button);

        container.appendChild(row);
    });
}
// CATEGORY CLASH
async function loadAdminCategoryClashBoards() {
    const { data, error } =
        await db.auth.getSession();

    if (error || !data.session) {
        return;
    }

    const boardLists =
        await dbGetAdminCategoryClashBoards(
            data.session.user.id
        );

    renderAdminBoardList(
        categoryClashDrafts,
        boardLists.drafts,
        "Publish as Preset",
        "publish-preset-btn"
    );

    renderAdminBoardList(
        categoryClashPresets,
        boardLists.presets,
        "Remove from Presets",
        "unpublish-preset-btn"
    );
}

refreshCategoryClashBtn.addEventListener(
    "click",
    loadAdminCategoryClashBoards
);

categoryClashDrafts.addEventListener(
    "click",
    async event => {
        const button =
            event.target.closest(
                ".publish-preset-btn"
            );

        if (!button) {
            return;
        }

        const confirmed =
            confirm(
                `Publish "${button.dataset.boardName}" as an official preset?`
            );

        if (!confirmed) {
            return;
        }

        const { data } =
            await db.auth.getSession();

        if (!data.session) {
            return;
        }

        button.disabled = true;
        button.textContent =
            "Publishing...";

        const published =
            await dbPublishCategoryClashPreset(
                Number(
                    button.dataset.boardId
                ),
                data.session.user.id
            );

        if (!published) {
            button.disabled = false;
            button.textContent =
                "Publish as Preset";

            categoryClashAdminMessage.textContent =
                "The preset could not be published.";

            return;
        }

        categoryClashAdminMessage.textContent =
            `"${button.dataset.boardName}" is now an official preset.`;

        await loadAdminCategoryClashBoards();
    }
);

categoryClashPresets.addEventListener(
    "click",
    async event => {
        const button =
            event.target.closest(
                ".unpublish-preset-btn"
            );

        if (!button) {
            return;
        }

        const confirmed =
            confirm(
                `Remove "${button.dataset.boardName}" from official presets?`
            );

        if (!confirmed) {
            return;
        }

        const { data } =
            await db.auth.getSession();

        if (!data.session) {
            return;
        }

        button.disabled = true;
        button.textContent =
            "Removing...";

        const unpublished =
            await dbUnpublishCategoryClashPreset(
                Number(
                    button.dataset.boardId
                ),
                data.session.user.id
            );

        if (!unpublished) {
            button.disabled = false;
            button.textContent =
                "Remove from Presets";

            categoryClashAdminMessage.textContent =
                "The preset could not be removed.";

            return;
        }

        categoryClashAdminMessage.textContent =
            `"${button.dataset.boardName}" is now an admin draft.`;

        await loadAdminCategoryClashBoards();
    }
);

// TORNADO
async function loadAdminTornadoBoards() {
    const { data, error } =
        await db.auth.getSession();

    if (error || !data.session) {
        return;
    }

    const boardLists =
        await dbGetAdminTornadoBoards(
            data.session.user.id
        );

    renderAdminBoardList(
        tornadoDrafts,
        boardLists.drafts,
        "Publish as Preset",
        "publish-tornado-preset-btn"
    );

    renderAdminBoardList(
        tornadoPresets,
        boardLists.presets,
        "Remove from Presets",
        "unpublish-tornado-preset-btn"
    );
}

refreshTornadoBtn.addEventListener(
    "click",
    loadAdminTornadoBoards
);

tornadoDrafts.addEventListener(
    "click",
    async event => {
        const button =
            event.target.closest(
                ".publish-tornado-preset-btn"
            );

        if (!button) {
            return;
        }

        const confirmed =
            confirm(
                `Publish "${button.dataset.boardName}" as an official Tornado preset?`
            );

        if (!confirmed) {
            return;
        }

        const { data } =
            await db.auth.getSession();

        if (!data.session) {
            return;
        }

        button.disabled = true;
        button.textContent =
            "Publishing...";

        const published =
            await dbPublishTornadoPreset(
                Number(
                    button.dataset.boardId
                ),
                data.session.user.id
            );

        if (!published) {
            button.disabled = false;
            button.textContent =
                "Publish as Preset";

            tornadoAdminMessage.textContent =
                "The preset could not be published.";

            return;
        }

        tornadoAdminMessage.textContent =
            `"${button.dataset.boardName}" is now an official preset.`;

        await loadAdminTornadoBoards();
    }
);

tornadoPresets.addEventListener(
    "click",
    async event => {
        const button =
            event.target.closest(
                ".unpublish-tornado-preset-btn"
            );

        if (!button) {
            return;
        }

        const confirmed =
            confirm(
                `Remove "${button.dataset.boardName}" from official Tornado presets?`
            );

        if (!confirmed) {
            return;
        }

        const { data } =
            await db.auth.getSession();

        if (!data.session) {
            return;
        }

        button.disabled = true;
        button.textContent =
            "Removing...";

        const unpublished =
            await dbUnpublishTornadoPreset(
                Number(
                    button.dataset.boardId
                ),
                data.session.user.id
            );

        if (!unpublished) {
            button.disabled = false;
            button.textContent =
                "Remove from Presets";

            tornadoAdminMessage.textContent =
                "The preset could not be removed.";

            return;
        }

        tornadoAdminMessage.textContent =
            `"${button.dataset.boardName}" is now an admin draft.`;

        await loadAdminTornadoBoards();
    }
);


//ADMIN
function getHomepageSectionLabel(
    section
) {
    const labels = {
        "teacher-tools":
            "Teacher Tools",

        "fun-games":
            "Fun Games",

        "live-games":
            "Live Games",

        "random-pickers":
            "Random Pickers"
    };

    return labels[section] || section;
}

function renderHomepageResources() {
    homepageResourcesList.innerHTML = "";

    if (homepageResources.length === 0) {
        homepageResourcesList.textContent =
            "No homepage resources found.";

        return;
    }

    homepageResources.forEach(
        resource => {
            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "homepage-resource-admin-row";

            const information =
                document.createElement(
                    "div"
                );

            information.className =
                "homepage-resource-admin-info";

            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                resource.name;

            const details =
                document.createElement(
                    "p"
                );

            details.textContent =
                `${
                    getHomepageSectionLabel(
                        resource.section
                    )
                } • ${
                    resource.status ===
                        "available"
                        ? "Available"
                        : "Coming Soon"
                } • Order ${
                    resource.display_order
                } • ${
                    resource.active
                        ? "Visible"
                        : "Hidden"
                }`;

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.type = "button";

            editButton.className =
                "edit-homepage-resource-btn";

            editButton.dataset.resourceId =
                resource.id;

            editButton.textContent =
                "Edit";

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.type = "button";

            deleteButton.className =
                "delete-homepage-resource-btn";

            deleteButton.dataset.resourceId =
                resource.id;

            deleteButton.dataset.resourceName =
                resource.name;

            deleteButton.textContent =
                "Delete";

            const actions =
                document.createElement(
                    "div"
                );

            actions.className =
                "homepage-resource-admin-actions";

            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );

            information.appendChild(
                name
            );

            information.appendChild(
                details
            );

            row.appendChild(
                information
            );

            row.appendChild(
                actions
            );

            homepageResourcesList
                .appendChild(row);
        }
    );
}


async function loadHomepageResources() {
    homepageResources =
        await dbGetAllSiteResources();

    renderHomepageResources();
}

homepageResourcesList.addEventListener(
    "click",
    event => {
        const editButton =
            event.target.closest(
                ".edit-homepage-resource-btn"
            );

        if (!editButton) {
            return;
        }

        const resourceId =
            Number(
                editButton.dataset.resourceId
            );

        const resource =
            homepageResources.find(
                item =>
                    item.id === resourceId
            );

        if (!resource) {
            return;
        }

        homepageResourceId.value =
            resource.id;

        homepageResourceName.value =
            resource.name;

        homepageResourceDescription.value =
            resource.description;

        homepageResourceSection.value =
            resource.section;

        homepageResourceUrl.value =
            resource.url;

        homepageResourceStatus.value =
            resource.status;

        homepageResourceOrder.value =
            resource.display_order;

        homepageResourceActive.checked =
            resource.active;

        homepageResourceNewTab.checked =
            resource.open_new_tab;

        saveHomepageResourceBtn.textContent =
            "Save Changes";

        cancelHomepageResourceEditBtn
            .classList.remove(
                "hidden"
            );

        homepageResourceMessage.textContent =
            `Editing "${resource.name}".`;

        homepageResourceForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);

homepageResourcesList.addEventListener(
    "click",
    async event => {
        const deleteButton =
            event.target.closest(
                ".delete-homepage-resource-btn"
            );

        if (!deleteButton) {
            return;
        }

        const resourceId =
            Number(
                deleteButton.dataset.resourceId
            );

        const resourceName =
            deleteButton.dataset.resourceName;

        const confirmed =
            confirm(
                `Permanently delete "${resourceName}" from the homepage resources? This cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        deleteButton.disabled = true;
        deleteButton.textContent =
            "Deleting...";

        const deleted =
            await dbDeleteSiteResource(
                resourceId
            );

        if (!deleted) {
            deleteButton.disabled = false;
            deleteButton.textContent =
                "Delete";

            alert(
                "The resource could not be deleted."
            );

            return;
        }

        if (
            Number(
                homepageResourceId.value
            ) === resourceId
        ) {
            resetHomepageResourceForm();
        }

        await loadHomepageResources();

        alert(
            `"${resourceName}" was permanently deleted.`
        );
    }
);

cancelHomepageResourceEditBtn
    .addEventListener(
        "click",
        resetHomepageResourceForm
    );

homepageResourceForm.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        if (
            !homepageResourceForm
                .reportValidity()
        ) {
            return;
        }

        const editingId =
            homepageResourceId.value
                ? Number(
                    homepageResourceId.value
                )
                : null;

        const resource = {
            name:
                homepageResourceName
                    .value
                    .trim(),

            description:
                homepageResourceDescription
                    .value
                    .trim(),

            section:
                homepageResourceSection
                    .value,

            url:
                homepageResourceUrl
                    .value
                    .trim(),

            status:
                homepageResourceStatus
                    .value,

            active:
                homepageResourceActive
                    .checked,

            displayOrder:
                Number(
                    homepageResourceOrder
                        .value
                ),

            openNewTab:
                homepageResourceNewTab
                    .checked
        };

        const duplicateName =
            homepageResources.find(
                item =>
                    item.id !== editingId &&
                    item.name
                        .trim()
                        .toLowerCase() ===
                    resource.name
                        .toLowerCase()
            );

        if (duplicateName) {
            alert(
                "A homepage resource with this name already exists."
            );

            homepageResourceMessage.textContent =
                "Please use a different resource name.";

            homepageResourceName.focus();
            return;
        }

        const duplicateUrl =
            homepageResources.find(
                item =>
                    item.id !== editingId &&
                    item.url
                        .trim()
                        .toLowerCase() ===
                    resource.url
                        .toLowerCase()
            );

        if (duplicateUrl) {
            alert(
                "A homepage resource with this page URL already exists."
            );

            homepageResourceMessage.textContent =
                "Please use a different page URL.";

            homepageResourceUrl.focus();
            return;
        }

        saveHomepageResourceBtn.disabled =
            true;

        saveHomepageResourceBtn.textContent =
            editingId
                ? "Saving Changes..."
                : "Adding Resource...";

        let savedResource;

        if (editingId) {
            savedResource =
                await dbUpdateSiteResource(
                    editingId,
                    resource
                );
        } else {
            savedResource =
                await dbSaveSiteResource(
                    resource
                );
        }

        saveHomepageResourceBtn.disabled =
            false;

        if (!savedResource) {
            saveHomepageResourceBtn.textContent =
                editingId
                    ? "Save Changes"
                    : "Add Resource";

            homepageResourceMessage.textContent =
                "The resource could not be saved. Check the console for details.";

            return;
        }

        const successMessage =
            editingId
                ? `"${resource.name}" was updated successfully.`
                : `"${resource.name}" was added successfully.`;

        resetHomepageResourceForm();

        homepageResourceMessage.textContent =
            successMessage;

        await loadHomepageResources();
    }
);

function resetHomepageResourceForm() {
    homepageResourceForm.reset();

    homepageResourceId.value = "";

    homepageResourceOrder.value = "0";

    homepageResourceActive.checked = true;

    homepageResourceNewTab.checked = true;

    saveHomepageResourceBtn.textContent =
        "Add Resource";

    cancelHomepageResourceEditBtn
        .classList.add(
            "hidden"
        );

    homepageResourceMessage.textContent =
        "";
}

adminNavButtons.forEach(button => {
    button.addEventListener(
        "click",
        () => {
            const selectedSection =
                button.dataset.adminSection;

            const showItems =
                selectedSection ===
                "items";

            const showHomepageResources =
                selectedSection ===
                    "homepage-resources";

            const showCategoryClash =
                selectedSection ===
                "category-clash";

            const showTornado =
                selectedSection ===
                "tornado";

            itemAdminSections.forEach(
                section => {
                    section.classList.toggle(
                        "hidden",
                        !showItems
                    );
                }
            );

            homepageResourcesAdminSection
                .classList.toggle(
                    "hidden",
                    !showHomepageResources
                );

            categoryClashAdminSection
                .classList.toggle(
                    "hidden",
                    !showCategoryClash
                );

            tornadoAdminSection
                .classList.toggle(
                    "hidden",
                    !showTornado
                );

            adminNavButtons.forEach(
                navButton => {
                    navButton.classList.toggle(
                        "active",
                        navButton === button
                    );
                }
            );
        }
    );
});

async function initialize(){
    console.log("initialize")
    await loadCategories();
    console.log("categories loaded")
    await loadGames();
    console.log("games loaded");
    await loadTags();
    console.log("loading tags");
    await loadCategoryFilter();
    console.log("load category filter");
    await loadItems();
    await loadAdminCategoryClashBoards();
    await loadAdminTornadoBoards();
    await loadHomepageResources();
};

async function checkAdminAccess() {
    const { data: sessionData } =
        await db.auth.getSession();

    const session =
        sessionData.session;

    if (!session) {
        alert(
            "Please log in with an administrator account."
        );

        window.location.href =
            "../account.html";

        return false;
    }

    const { data: isAdmin, error } =
        await db.rpc(
            "is_site_admin"
        );

    if (error) {
        console.error(
            "Admin check failed:",
            error
        );

        alert(
            "The administrator check failed."
        );

        return false;
    }

    if (!isAdmin) {
        alert(
            "You do not have permission to view this page."
        );

        window.location.href =
            "../index.html";

        return false;
    }

    return true;
}

async function startAdminPage() {
    const isAllowed =
        await checkAdminAccess();

    if (!isAllowed) {
        return;
    }

    await initialize();
}

startAdminPage();
