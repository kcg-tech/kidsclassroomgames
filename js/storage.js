async function storageUploadImage(file, category, english) {

    const extension =
        file.name.split(".").pop();

    const fileName =
        generateFileName(english, extension);

    const filePath =
        `${category}/${fileName}`;

    const { data, error } = await db.storage
        .from("images")
        .upload(filePath, file);

    if (error) {

        console.error(error);

        return null;

    }

    const { data: publicUrlData } = db.storage
        .from("images")
        .getPublicUrl(filePath);

    

    return {

    imagePath: filePath,

    imageUrl: publicUrlData.publicUrl

    };

};

async function storageDeleteImage(imagePath) {
    
    const { error } = await db.storage
        .from("images")
        .remove([imagePath]);

    if (error) {

        console.error(error);

        return false;

    }

    return true;
}