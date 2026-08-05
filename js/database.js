
// ADMIN PAGE SECTION

async function dbGetCategories() {
    const { data, error } = await db
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

    
   if (error) {

        console.error(error);
       return [];

    }

    return data;
};

async function dbgetGames(){

    const { data, error } = await db
        .from("games")
        .select("*")
        .order("display_order");

   if(error){

        console.error(error);
        return [];

    };

    return data;

};

async function dbGetItemGames() {

    const { data, error } = await db
        .from("items_games")
        .select("*");

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbGetTranslations() {

    const { data, error } = await db
        .from("translations")
        .select("*");

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbGetItems(){

    const {data, error} = await db
    .from("items")
    .select("*")
    .order("id", {ascending:false});

    if (error){
        console.log(error);

        return [];
    };

    return data;
}

async function dbGetLanguages() {

    const { data, error } =
        await db
            .from("languages")
            .select("*")
            .order("id");

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbGetLanguageByCode(code) {

    const { data, error } = await db
        .from("languages")
        .select("*")
        .eq("code", code)
        .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

}

async function dbGetTags() {

    const { data, error } =
        await db
            .from("tags")
            .select("*")
            .order("display_order");

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbGetItemTags() {

    const { data, error } =
        await db
            .from("items_tags")
            .select("*");

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbDeleteItemTags(
    itemId
) {

    const { error } =
        await db
            .from("items_tags")
            .delete()
            .eq(
                "item_id",
                itemId
            );

    if (error) {

        console.error(error);

        return false;

    }

    return true;

}

async function dbSaveItemTag(
    itemId,
    tagId
) {

    const { data, error } =
        await db
            .from("items_tags")
            .insert({
                item_id: itemId,
                tag_id: tagId
            })
            .select()
            .single();

    if (error) {

        console.error(
            "dbsaveitemtag error:",
            error);

        return null;

    }

    return data;

}

async function dbSaveItem(item) {

    const { data, error } = await db
        .from("items")
        .insert({
            category_id: item.categoryId,
            image_url: item.imageUrl,
            image_path: item.imagePath,
            active: item.active,
            display_order: item.displayOrder
        })
        .select()
        .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

};

async function dbSaveItemGame(itemId, gameId) {

    const { data, error } = await db
        .from("items_games")
        .insert({
            item_id: itemId,
            game_id: gameId
        })
        .select()
        .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

};

async function dbSaveTranslation(itemId, languageId, text) {

    const { data, error } = await db
        .from("translations")
        .insert({
            item_id: itemId,
            language_id: languageId,
            text: text
        })
        .select()
        .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

};

async function dbGetTranslationByText(
    languageId,
    text
) {

    const { data, error } =
        await db
            .from("translations")
            .select("*")
            .eq(
                "language_id",
                languageId
            )
            .ilike(
                "text",
                text
            );

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbUpdateItem(itemId, item) {

    const { data, error } = await db
        .from("items")
        .update({
            category_id: item.categoryId,
            image_url: item.imageUrl,
            image_path: item.imagePath,
            active: item.active,
            display_order: item.displayOrder
        })
        .eq("id", itemId)
        .select()
        .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

};

async function dbUpdateTranslation(
    itemId,
    languageId,
    text
) {

    const { data, error } = await db
        .from("translations")
        .update({
            text: text
        })
        .eq("item_id", itemId)
        .eq("language_id", languageId)
        .select()
        .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

};

async function dbDeleteItem(itemId) {

    const { error } = await db
        .from("items")
        .delete()
        .eq("id", itemId);

    if (error) {

        console.error(error);

        return false;

    }

    return true;

};

// deletes one specific row for rollback
async function dbDeleteItemGame(itemGameId) {

    const { error } = await db
        .from("items_games")
        .delete()
        .eq("id", itemGameId);

    if (error) {

        console.error(error);

        return false;

    }

    return true;

};
// deletes all rows for a specific item
async function dbDeleteItemGames(itemId) {

    const { error } = await db
        .from("items_games")
        .delete()
        .eq("item_id", itemId);

    if (error) {

        console.error(error);

        return false;

    }

    return true;

}

async function dbDeleteTranslations(itemId) {

    const { error } = await db
        .from("translations")
        .delete()
        .eq("item_id", itemId);

    if (error) {

        console.error(error);

        return false;

    }

    return true;

}

// GAMES SECTION

async function dbGetGameBySlug(
    slug
) {

    const { data, error } =
        await db
            .from("games")
            .select("*")
            .eq(
                "slug",
                slug
            )
            .single();

    if (error) {

        console.error(error);

        return null;

    }

    return data;

}

async function dbGetItemsByGameId(
    gameId
) {

    const { data, error } =
        await db
            .from("items_games")
            .select(`
                item_id,
                items (
                    *
                )
            `)
            .eq(
                "game_id",
                gameId
            );

    if (error) {

        console.error(error);

        return [];

    }

    return data;

}

async function dbGetGuessTheImageItems(
    categoryId = null,
    tagIds = [],
languageId = 1) {
       

    const game =
        await dbGetGameBySlug(
            "guesstheimage"
        );

    if (!game) {

        return [];

    }

    const gameItems =
        await dbGetItemsByGameId(
            game.id
        );

    const itemTags =
        await dbGetItemTags();

    let filteredGameItems =
        gameItems;

    if (categoryId) {

        filteredGameItems =
            gameItems.filter(
                gameItem =>
                    gameItem.items.category_id ==
                    categoryId
            );

    };

    if (tagIds.length > 0) {

        filteredGameItems =
            filteredGameItems.filter(
                gameItem => {

                    const itemTagRows =
                        itemTags.filter(
                            itemTag =>
                                itemTag.item_id ===
                                gameItem.item_id
                        );

                    return itemTagRows.some(
                        itemTag =>
                            tagIds.includes(
                                itemTag.tag_id
                            )
                    );

                }
            );


    };
//added here
    filteredGameItems =
        filteredGameItems.filter(
            gameItem =>
                gameItem.items.active === true
        );
        
    const translations =
        await dbGetTranslations();

    const quizItems =
        filteredGameItems.map(gameItem => {

            const englishTranslation =
                translations.find(
                    translation =>
                        translation.item_id === gameItem.item_id &&
                        translation.language_id === languageId
                );

            return {

                name:
                    englishTranslation
                        ? englishTranslation.text
                        : "(No English)",

                url:
                    gameItem.items.image_url

            };

        });

    return quizItems;

};


// BINGO

async function dbGetItems(
    categoryId = null,
    tagIds = [],
languageId = 1) {
       

    const game =
        await dbGetGameBySlug(
            "guesstheimage"
        );

    if (!game) {

        return [];

    }

    const gameItems =
        await dbGetItemsByGameId(
            game.id
        );

    const itemTags =
        await dbGetItemTags();

    let filteredGameItems =
        gameItems;

    if (categoryId) {

        filteredGameItems =
            gameItems.filter(
                gameItem =>
                    gameItem.items.category_id ==
                    categoryId
            );

    };

    if (tagIds.length > 0) {

        filteredGameItems =
            filteredGameItems.filter(
                gameItem => {

                    const itemTagRows =
                        itemTags.filter(
                            itemTag =>
                                itemTag.item_id ===
                                gameItem.item_id
                        );

                    return itemTagRows.some(
                        itemTag =>
                            tagIds.includes(
                                itemTag.tag_id
                            )
                    );

                }
            );


    };
//added here
    filteredGameItems =
        filteredGameItems.filter(
            gameItem =>
                gameItem.items.active === true
        );
        
    const translations =
        await dbGetTranslations();

    const quizItems =
        filteredGameItems.map(gameItem => {

            const englishTranslation =
                translations.find(
                    translation =>
                        translation.item_id === gameItem.item_id &&
                        translation.language_id === languageId
                );

            return {

                name:
                    englishTranslation
                        ? englishTranslation.text
                        : "(No English)",

                url:
                    gameItem.items.image_url

            };

        });

    return quizItems;

};