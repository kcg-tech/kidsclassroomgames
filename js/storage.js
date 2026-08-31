const IMAGE_UPLOAD_SETTINGS = Object.freeze({
    main: { maxDimension: 1000, quality: 0.85 },
    thumbnail: { maxDimension: 320, quality: 0.8 }
});

async function loadUploadImage(file) {
    if ("createImageBitmap" in window) {
        return createImageBitmap(file);
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(
            new Error("The selected image could not be read.")
        );
        image.src = objectUrl;
    });

    URL.revokeObjectURL(objectUrl);
    return image;
}

function canvasToWebpBlob(canvas, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => blob
                ? resolve(blob)
                : reject(new Error("This browser could not optimize the image.")),
            "image/webp",
            quality
        );
    });
}

async function createOptimizedWebp(file, maxDimension, quality) {
    const source = await loadUploadImage(file);
    const sourceWidth = source.naturalWidth || source.width;
    const sourceHeight = source.naturalHeight || source.height;
    const scale = Math.min(
        1,
        maxDimension / Math.max(sourceWidth, sourceHeight)
    );
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
        if (typeof source.close === "function") source.close();
        throw new Error("This browser could not resize the image.");
    }

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    if (typeof source.close === "function") source.close();
    return canvasToWebpBlob(canvas, quality);
}

async function uploadImageBlob(filePath, blob) {
    const { error } = await db.storage
        .from("images")
        .upload(filePath, blob, {
            cacheControl: "31536000",
            contentType: "image/webp",
            upsert: false
        });

    if (error) throw error;

    return db.storage
        .from("images")
        .getPublicUrl(filePath)
        .data.publicUrl;
}

async function storageUploadImage(file, category, english) {
    try {
        const [mainBlob, thumbnailBlob] = await Promise.all([
            createOptimizedWebp(
                file,
                IMAGE_UPLOAD_SETTINGS.main.maxDimension,
                IMAGE_UPLOAD_SETTINGS.main.quality
            ),
            createOptimizedWebp(
                file,
                IMAGE_UPLOAD_SETTINGS.thumbnail.maxDimension,
                IMAGE_UPLOAD_SETTINGS.thumbnail.quality
            )
        ]);
        const fileName = generateFileName(english, "webp");
        const imagePath = `${category}/${fileName}`;
        const thumbnailPath = `${category}/thumbnails/${fileName}`;
        const imageUrl = await uploadImageBlob(imagePath, mainBlob);

        try {
            const thumbnailUrl = await uploadImageBlob(
                thumbnailPath,
                thumbnailBlob
            );

            return { imagePath, imageUrl, thumbnailPath, thumbnailUrl };
        } catch (error) {
            await storageDeleteImage(imagePath);
            throw error;
        }
    } catch (error) {
        console.error("Image optimization or upload failed:", error);
        return null;
    }
}

async function storageDeleteImage(imagePath) {
    if (!imagePath) return true;

    const { error } = await db.storage
        .from("images")
        .remove([imagePath]);

    if (error) {

        console.error(error);

        return false;

    }

    return true;
}

async function storageDeleteImages(imagePaths) {
    const paths = [...new Set(imagePaths.filter(Boolean))];

    if (paths.length === 0) return true;

    const { error } = await db.storage
        .from("images")
        .remove(paths);

    if (error) {
        console.error(error);
        return false;
    }

    return true;
}
