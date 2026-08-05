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
const tagsContainer =
    document.getElementById(
        "tagsContainer"
    );

const imageInput =
    document.getElementById("imageInput");
const imagePreview =
    document.getElementById("imagePreview");
const dropZone = document.getElementById("dropZone");
const saveBtn = document.getElementById("saveBtn");

const searchInput =
    document.getElementById(
        "searchInput"
    );
const itemsContainer =
document.getElementById("itemsContainer");
console.log("itemsContainer", itemsContainer)
const filterCategory =
    document.getElementById(
        "filterCategory"
    );





const formData = {

    item: {

        categoryId: null,
        categoryName: "",
        imageFile: null,
        imagePath: "",
        imageUrl: "",
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
        gamesContainer.appendChild(document.createElement("br"))
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

    updateFormData();

    if (!validateItem(formData))
        return;

    if (!validateGames(formData))
        return;

    if (formData.editMode) {

        await updateItem(formData);

    }
    else {

        await saveItem(formData);

    };


});

searchInput.addEventListener(
    "input",
    loadItems
);

filterCategory.addEventListener(
    "change",
    loadItems
);

async function loadCategoryFilter() {

    const categories =
        await dbGetCategories();

    filterCategory.innerHTML =
        `
        <option value="">
            All Categories
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
    const savedGameIds = [];
    
    try{   
        
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
        imagePath =image.imagePath; 

        
        const savedItem =
        await dbSaveItem(formData.item);

        if (!savedItem){
            throw new Error(
                "Item save failed"
            );
        }

        formData.item.id = savedItem.id;
        itemId = savedItem.id; 

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
                "English item already exists."
            );

            return;

        }

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

        if (imagePath) {

            await storageDeleteImage(
                imagePath
            );

        }

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

    }
    else {

        console.log(
            "Keeping current image"
        );

        formData.item.imageUrl =
            formData.oldImageUrl;

        formData.item.imagePath =
            formData.oldImagePath;

    }


    const updatedItem =
        await dbUpdateItem(
            formData.editingItemId,
            formData.item
        );

    console.log(updatedItem);

    if (
        formData.item.imageFile &&
        formData.oldImagePath
    ) {

        await storageDeleteImage(
            formData.oldImagePath
        );

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
    'input[type="checkbox"]:checked');

     checkedGames.forEach(game => {

        formData.games.push(
            Number(game.value)
        );

    });

}

async function loadItems() {

    const items =
        await dbGetItems();

    console.log(items);

    const translations =
        await dbGetTranslations();

    console.log(translations);

    const itemGames =
        await dbGetItemGames();

    const itemTags =
        await dbGetItemTags();

    const searchText =
        searchInput.value
        .toLowerCase();

    const selectedCategory =
        filterCategory.value;

    searchInput.addEventListener(
        "input",
        loadItems
    );

    itemsContainer.innerHTML = "";

    items
    .filter(item => {

        const englishTranslation =
            translations.find(
                translation =>
                    translation.item_id === item.id &&
                    translation.language_id === 1
            );

        const searchMatch =
                englishTranslation?.text
                    ?.toLowerCase()
                    .includes(searchText);

        const categoryMatch =
            !selectedCategory ||
            item.category_id ==
            selectedCategory;

        return (
            searchMatch &&
            categoryMatch
        );

    }).forEach(item => {

            const div =
                document.createElement("div");
            
                div.className = "itemDiv";
                

            const img =
                document.createElement("img");

            img.src = item.image_url;
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

                console.log(
                    formData.oldImagePath
                );
                console.log(
                    formData.oldImagePath
                );

                formData.item.imageUrl = item.image_url

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
    formData.oldImagePath = null;
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

    console.log(
        "item deleted",
        deletedItem
    );

    const deletedImage =
        await storageDeleteImage(
            item.image_path
        );

    console.log(
        "image deleted",
        deletedImage
    );

    resetForm();

    await loadItems();

    alert("Item deleted.");

}


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
};

initialize();