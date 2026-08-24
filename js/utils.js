function validateItem(formData) {
    
    if (english.value.trim() === "") {

        alert("Please enter the English name.");


        return false;

    }
// ! ! J A P A N E S E is it necessary to keep??
    /*if (!formData.translations.jp) {

        alert("Please enter a Japanese name.");

        return false;

    }*/

    if (formData.item.categoryId === null) {

        alert("Please select a category.");

        return false;

    }

    if (!formData.editMode &&
        !formData.item.imageFile
    ) {

        alert("Please choose an image.");

        return false;

    }

    return true;
    console.log('item_validated');


};

function validateGames(formData) {

    if (formData.games.length === 0) {

        alert("Please select at least one game.");

        return false;

    }

    return true;

};

//name for item file
function generateFileName(name, extension) {

    const cleanName = name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

    return `${cleanName}_${Date.now()}.${extension}`;

}

function createShareablePageUrl() {
    const currentUrl =
        new URL(window.location.href);

    const isLocalWebsite =
        currentUrl.hostname ===
            "localhost" ||
        currentUrl.hostname ===
            "127.0.0.1";

    if (!isLocalWebsite) {
        return currentUrl;
    }

    let pagePath =
        currentUrl.pathname;

    if (
        !pagePath.startsWith(
            "/kidsclassroomgames/"
        )
    ) {
        pagePath =
            "/kidsclassroomgames" +
            pagePath;
    }

    return new URL(
        pagePath,
        "https://kcg-tech.github.io"
    );
}