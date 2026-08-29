
// HOMEPAGE

async function dbGetSiteResources() {
    const { data, error } =
        await db
            .from("site_resources")
            .select(`
                id,
                name,
                description,
                section,
                url,
                status,
                display_order,
                open_new_tab
            `)
            .eq("active", true)
            .order(
                "display_order",
                { ascending: true }
            );

    if (error) {
        console.error(
            "Could not load homepage resources:",
            error
        );

        return [];
    }

    return data || [];
}

async function dbGetAllSiteResources() {
    const { data, error } =
        await db
            .from("site_resources")
            .select(`
                id,
                name,
                description,
                section,
                url,
                status,
                active,
                display_order,
                open_new_tab
            `)
            .order(
                "section",
                { ascending: true }
            )
            .order(
                "display_order",
                { ascending: true }
            );

    if (error) {
        console.error(
            "Could not load admin homepage resources:",
            error
        );

        return [];
    }

    return data || [];
}

async function dbSaveSiteResource(
    resource
) {
    const { data, error } =
        await db
            .from("site_resources")
            .insert({
                name:
                    resource.name,

                description:
                    resource.description,

                section:
                    resource.section,

                url:
                    resource.url,

                status:
                    resource.status,

                active:
                    resource.active,

                display_order:
                    resource.displayOrder,

                open_new_tab:
                    resource.openNewTab,

                updated_at:
                    new Date().toISOString()
            })
            .select()
            .single();

    if (error) {
        console.error(
            "Could not add homepage resource:",
            error
        );

        return null;
    }

    return data;
}

async function dbUpdateSiteResource(
    resourceId,
    resource
) {
    const { data, error } =
        await db
            .from("site_resources")
            .update({
                name:
                    resource.name,

                description:
                    resource.description,

                section:
                    resource.section,

                url:
                    resource.url,

                status:
                    resource.status,

                active:
                    resource.active,

                display_order:
                    resource.displayOrder,

                open_new_tab:
                    resource.openNewTab,

                updated_at:
                    new Date().toISOString()
            })
            .eq("id", resourceId)
            .select()
            .single();

    if (error) {
        console.error(
            "Could not update homepage resource:",
            error
        );

        return null;
    }

    return data;
}

async function dbDeleteSiteResource(
    resourceId
) {
    const { data, error } =
        await db
            .from("site_resources")
            .delete()
            .eq("id", resourceId)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not permanently delete homepage resource:",
            error
        );

        return false;
    }

    return Boolean(data);
}

// ADD ITEMS

async function dbGetCategories() {
    const { data, error } = await db
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

    
   if (error) {

        console.error(
            "Could not load categories:",
            {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            }
        );  
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

async function dbGetAllItems(){

    const {data, error} = await db
    .from("items")
    .select("*")
    .order("id", {ascending:false});

    if (error){
        console.error(error);

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

        console.error(
            "Could not load tags:",
            {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            }
        );

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
            .eq(
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

    if (
        categoryId &&
        categoryId !== "browse-by-tag"
    ) {

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
                id:
                    gameItem.item_id,

                name:
                    englishTranslation
                        ? englishTranslation.text
                        : "(No Translation)",

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

    if (
        categoryId &&
        categoryId !== "browse-by-tag"
    ) {

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

                id: 
                    gameItem.item_id,

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

async function dbGetImageLibraryItems() {
    const { data: items, error: itemsError } =
        await db
            .from("items")
            .select(
                "id, image_url, active, category_id"
            )
            .eq("active", true)
            .order(
                "display_order",
                { ascending: true }
            );

    if (itemsError) {
        console.error(
            "Could not load image items:",
            itemsError
        );

        return [];
    }

    const translations =
        await dbGetTranslations();
    const itemTags =
        await dbGetItemTags();

    return items
        .filter(item => item.image_url)
        .map(item => {
            const english =
                translations.find(
                    translation =>
                        translation.item_id ===
                            item.id &&
                        translation.language_id ===
                            1
                );

            return {
                id: item.id,

                name: english
                    ? english.text
                    : `Item ${item.id}`,

                imageUrl:
                    item.image_url,

                categoryId:
                    item.category_id,

                tagIds:
                    itemTags
                        .filter(
                            itemTag =>
                                itemTag.item_id ===
                                item.id
                        )
                        .map(
                            itemTag =>
                                itemTag.tag_id
                        )
            };
        });
};

// CATEGORY CLASH
async function dbSaveCategoryClashBoard(
    ownerId,
    boardName,
    boardData
) {
    const { data: board, error: boardError } =
        await db
            .from("category_clash_boards")
            .insert({
                owner_id: ownerId,
                name: boardName,
                is_preset: false,
                is_public: false,
                active: true,
                display_order: 0
            })
            .select()
            .single();

    if (boardError) {
        console.error(
            "Could not save board:",
            boardError
        );

        return {
            board: null,
            error: boardError
        };
    }

    const columnRows =
        boardData.map(
            (category, index) => ({
                board_id: board.id,
                title: category.category,
                position: index + 1
            })
        );

    const {
        data: savedColumns,
        error: columnsError
    } =
        await db
            .from(
                "category_clash_columns"
            )
            .insert(columnRows)
            .select();

    if (columnsError) {
        console.error(
            "Could not save columns:",
            columnsError
        );

        await db
            .from(
                "category_clash_boards"
            )
            .delete()
            .eq("id", board.id);

        return {
            board: null,
            error: columnsError
        };
    }

    const questionRows = [];

    boardData.forEach(
        (category, categoryIndex) => {
            const savedColumn =
                savedColumns.find(
                    column =>
                        Number(
                            column.position
                        ) ===
                        categoryIndex + 1
                );

            category.questions.forEach(
                (question, questionIndex) => {
                    questionRows.push({
                        column_id:
                            savedColumn.id,

                        position:
                            questionIndex + 1,

                        score:
                            Number(
                                question.score
                            ),

                        question_text:
                            question.question,

                        answer_text:
                            question.answer,

                        question_item_id:
                            question.questionItemId,

                        answer_item_id:
                            question.answerItemId,

                        active: true
                    });
                }
            );
        }
    );

    const { error: questionsError } =
        await db
            .from(
                "category_clash_questions"
            )
            .insert(questionRows);

    if (questionsError) {
        console.error(
            "Could not save questions:",
            questionsError
        );

        await db
            .from(
                "category_clash_boards"
            )
            .delete()
            .eq("id", board.id);

        return {
            board: null,
            error: questionsError
        };
    }

    return {
        board: board,
        error: null
    };
}

async function dbGetCategoryClashBoardList(
    userId = null
) {
    let query =
        db
            .from(
                "category_clash_boards"
            )
            .select(`
                id,
                name,
                slug,
                is_preset,
                is_public,
                owner_id
            `)
            .eq("active", true)
            .order(
                "is_preset",
                { ascending: false }
            )
            .order(
                "display_order",
                { ascending: true }
            )
            .order(
                "name",
                { ascending: true }
            );

    if (userId) {
        query = query.or(
            `is_preset.eq.true,owner_id.eq.${userId}`
        );
    } else {
        query = query.eq(
            "is_preset",
            true
        );
    }

    const { data, error } =
        await query;

    if (error) {
        console.error(
            "Could not load Category Clash boards:",
            error
        );

        return [];
    }

    return data;
}

async function dbGetCategoryClashBoard(
    boardId
) {
    const { data: board, error: boardError } =
        await db
            .from(
                "category_clash_boards"
            )
            .select("id, name")
            .eq("id", boardId)
            .eq("active", true)
            .single();

    if (boardError) {
        console.error(
            "Could not load board:",
            boardError
        );

        return null;
    }

    const {
        data: columns,
        error: columnsError
    } =
        await db
            .from(
                "category_clash_columns"
            )
            .select(
                "id, title, position"
            )
            .eq("board_id", boardId)
            .order(
                "position",
                { ascending: true }
            );

    if (columnsError) {
        console.error(
            "Could not load board columns:",
            columnsError
        );

        return null;
    }

    const columnIds =
        columns.map(
            column => column.id
        );

    const {
        data: questions,
        error: questionsError
    } =
        await db
            .from(
                "category_clash_questions"
            )
            .select(`
                id,
                column_id,
                position,
                score,
                question_text,
                answer_text,
                question_item_id,
                answer_item_id
            `)
            .in("column_id", columnIds)
            .eq("active", true)
            .order(
                "position",
                { ascending: true }
            );

    if (questionsError) {
        console.error(
            "Could not load questions:",
            questionsError
        );

        return null;
    }

    const itemIds =
        Array.from(
            new Set(
                questions
                    .flatMap(
                        question => [
                            question.question_item_id,
                            question.answer_item_id
                        ]
                    )
                    .filter(Boolean)
            )
        );

    let imageItems = [];

    if (itemIds.length > 0) {
        const {
            data,
            error
        } =
            await db
                .from("items")
                .select(
                    "id, image_url"
                )
                .in("id", itemIds);

        if (error) {
            console.error(
                "Could not load board images:",
                error
            );

            return null;
        }

        imageItems = data;
    }

    const findImageUrl =
        itemId => {
            if (!itemId) {
                return null;
            }

            const item =
                imageItems.find(
                    imageItem =>
                        imageItem.id === itemId
                );

            return item
                ? item.image_url
                : null;
        };

    return {
        id: board.id,
        name: board.name,

        categories:
            columns.map(column => ({
                category: column.title,

                questions:
                    questions
                        .filter(
                            question =>
                                question.column_id ===
                                column.id
                        )
                        .map(question => ({
                            score:
                                question.score,

                            question:
                                question.question_text,

                            questionImg:
                                findImageUrl(
                                    question.question_item_id
                                ),

                            questionItemId:
                                question.question_item_id,

                            answer:
                                question.answer_text,

                            answerImg:
                                findImageUrl(
                                    question.answer_item_id
                                ),

                            answerItemId:
                                question.answer_item_id,

                            used: false
                        }))
            }))
    };
}

async function dbEnableCategoryClashSharing(
    boardId,
    ownerId,
    shareSlug
) {
    const { data, error } =
        await db
            .from(
                "category_clash_boards"
            )
            .update({
                slug: shareSlug,
                is_public: true,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("owner_id", ownerId)
            .eq("is_preset", false)
            .select("id, slug")
            .single();

    if (error) {
        console.error(
            "Could not enable board sharing:",
            error
        );

        return null;
    }

    return data;
}

async function dbGetCategoryClashBoardBySlug(
    shareSlug
) {
    const { data, error } =
        await db
            .from(
                "category_clash_boards"
            )
            .select("id")
            .eq("slug", shareSlug)
            .eq("is_public", true)
            .eq("active", true)
            .maybeSingle();

    if (error) {
        console.error(
            "Could not load shared board:",
            error
        );

        return null;
    }

    if (!data) {
        return null;
    }

    return await dbGetCategoryClashBoard(
        data.id
    );
}

async function dbDeleteCategoryClashBoard(
    boardId,
    ownerId
) {
    const { data, error } =
        await db
            .from(
                "category_clash_boards"
            )
            .delete()
            .eq("id", boardId)
            .eq("owner_id", ownerId)
            .eq("is_preset", false)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not delete board:",
            error
        );

        return false;
    }

    return Boolean(data);
}

async function dbUpdateCategoryClashBoard(
    boardId,
    boardName,
    boardData
) {
    const { error } =
        await db.rpc(
            "update_category_clash_board",
            {
                p_board_id: boardId,
                p_name: boardName,
                p_board_data: boardData
            }
        );

    if (error) {
        console.error(
            "Could not update board:",
            error
        );

        return false;
    }

    return true;
}

// tornado

async function dbSaveTornadoBoard(
    ownerId,
    boardName,
    boardData
) {
    const {
        data: board,
        error: boardError
    } =
        await db
            .from("tornado_boards")
            .insert({
                owner_id: ownerId,
                name: boardName,
                is_preset: false,
                is_public: false,
                active: true,
                display_order: 0
            })
            .select()
            .single();

    if (boardError) {
        console.error(
            "Could not save Tornado board:",
            boardError
        );

        return {
            board: null,
            error: boardError
        };
    }

    const questionRows =
        boardData.map(
            question => ({
                board_id:
                    board.id,

                position:
                    question.position,

                reward_type:
                    question.rewardType,

                question_text:
                    question.question,

                answer_text:
                    question.answer,

                question_item_id:
                    question.questionItemId,

                answer_item_id:
                    question.answerItemId,

                active:
                    true
            })
        );

    const { error: questionsError } =
        await db
            .from("tornado_questions")
            .insert(questionRows);

    if (questionsError) {
        console.error(
            "Could not save Tornado questions:",
            questionsError
        );

        await db
            .from("tornado_boards")
            .delete()
            .eq(
                "id",
                board.id
            );

        return {
            board: null,
            error: questionsError
        };
    }

    return {
        board: board,
        error: null
    };
}

async function dbGetTornadoBoardList(
    userId = null
) {
    let query =
        db
            .from("tornado_boards")
            .select(`
                id,
                owner_id,
                name,
                slug,
                is_preset,
                is_public,
                active,
                display_order
            `)
            .eq("active", true);

    if (userId) {
        query =
            query.or(
                `is_preset.eq.true,owner_id.eq.${userId}`
            );
    } else {
        query =
            query.eq(
                "is_preset",
                true
            );
    }

    const { data, error } =
        await query
            .order(
                "is_preset",
                { ascending: false }
            )
            .order(
                "display_order",
                { ascending: true }
            )
            .order(
                "name",
                { ascending: true }
            );

    if (error) {
        console.error(
            "Could not load Tornado boards:",
            error
        );

        return [];
    }

    return data;
}

async function dbGetTornadoBoard(
    boardId
) {
    const {
        data: board,
        error: boardError
    } =
        await db
            .from("tornado_boards")
            .select(`
                id,
                owner_id,
                name,
                slug,
                is_preset,
                is_public
            `)
            .eq("id", boardId)
            .eq("active", true)
            .maybeSingle();

    if (boardError) {
        console.error(
            "Could not load Tornado board:",
            boardError
        );

        return null;
    }

    if (!board) {
        return null;
    }

    const {
        data: questions,
        error: questionsError
    } =
        await db
            .from("tornado_questions")
            .select(`
                position,
                reward_type,
                question_text,
                answer_text,
                question_item_id,
                answer_item_id
            `)
            .eq(
                "board_id",
                board.id
            )
            .eq("active", true)
            .order(
                "position",
                { ascending: true }
            );

    if (questionsError) {
        console.error(
            "Could not load Tornado questions:",
            questionsError
        );

        return null;
    }

    const itemIds =
        Array.from(
            new Set(
                questions
                    .flatMap(
                        question => [
                            question.question_item_id,
                            question.answer_item_id
                        ]
                    )
                    .filter(Boolean)
            )
        );

    let imageItems = [];

    if (itemIds.length > 0) {
        const {
            data,
            error
        } =
            await db
                .from("items")
                .select(
                    "id, image_url"
                )
                .in("id", itemIds);

        if (error) {
            console.error(
                "Could not load Tornado images:",
                error
            );

            return null;
        }

        imageItems = data;
    }

    const findImageUrl =
        itemId => {
            const item =
                imageItems.find(
                    imageItem =>
                        imageItem.id ===
                        itemId
                );

            return item
                ? item.image_url
                : null;
        };

    return {
        id: board.id,
        ownerId: board.owner_id,
        name: board.name,
        slug: board.slug,
        isPreset: board.is_preset,
        isPublic: board.is_public,

        questions:
            questions.map(question => {
                const rewardText = {
                    "score-100": "+100",
                    "score-200": "+200",
                    "tornado": "TORNADO",
                    "double": "DOUBLE",
                    "switch": "SWITCH"
                }[question.reward_type];

                return {
                    position:
                        question.position,

                    question:
                        question.question_text,

                    questionItemId:
                        question.question_item_id,

                    questionImg:
                        findImageUrl(
                            question.question_item_id
                        ),

                    answer:
                        question.answer_text,

                    answerItemId:
                        question.answer_item_id,

                    answerImg:
                        findImageUrl(
                            question.answer_item_id
                        ),

                    rewardType:
                        question.reward_type,

                    reward: {
                        type:
                            question.reward_type,
                        text:
                            rewardText ||
                            question.reward_type
                    },

                    used: false
                };
            })
    };
}

async function dbEnableTornadoSharing(
    boardId,
    ownerId,
    shareSlug
) {
    const { data, error } =
        await db
            .from("tornado_boards")
            .update({
                slug: shareSlug,
                is_public: true,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("owner_id", ownerId)
            .eq("is_preset", false)
            .select("id, slug")
            .single();

    if (error) {
        console.error(
            "Could not create Tornado share link:",
            error
        );

        return null;
    }

    return data;
}

async function dbGetTornadoBoardBySlug(
    shareSlug
) {
    const { data, error } =
        await db
            .from("tornado_boards")
            .select("id")
            .eq("slug", shareSlug)
            .eq("is_public", true)
            .eq("active", true)
            .maybeSingle();

    if (error) {
        console.error(
            "Could not load shared Tornado board:",
            error
        );

        return null;
    }

    if (!data) {
        return null;
    }

    return await dbGetTornadoBoard(
        data.id
    );
}

async function dbUpdateTornadoBoard(
    boardId,
    ownerId,
    boardName,
    boardData
) {
    const {
        data: updatedBoard,
        error: boardError
    } =
        await db
            .from("tornado_boards")
            .update({
                name: boardName,
                slug: null,
                is_public: false,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("owner_id", ownerId)
            .eq("is_preset", false)
            .select("id")
            .single();

    if (boardError || !updatedBoard) {
        console.error(
            "Could not update Tornado board:",
            boardError
        );

        return false;
    }

    const questionRows =
        boardData.map(question => ({
            board_id: boardId,
            position: question.position,
            reward_type:
                question.rewardType,
            question_text:
                question.question,
            answer_text:
                question.answer,
            question_item_id:
                question.questionItemId,
            answer_item_id:
                question.answerItemId,
            active: true
        }));

    const { error: questionsError } =
        await db
            .from("tornado_questions")
            .upsert(
                questionRows,
                {
                    onConflict:
                        "board_id,position"
                }
            );

    if (questionsError) {
        console.error(
            "Could not update Tornado questions:",
            questionsError
        );

        return false;
    }

    return true;
}

async function dbDeleteTornadoBoard(
    boardId,
    ownerId
) {
    const { data, error } =
        await db
            .from("tornado_boards")
            .delete()
            .eq("id", boardId)
            .eq("owner_id", ownerId)
            .eq("is_preset", false)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not delete Tornado board:",
            error
        );

        return false;
    }

    return Boolean(data);
}

async function dbGetAdminTornadoBoards(
    adminUserId
) {
    const draftsResult =
        await db
            .from("tornado_boards")
            .select(`
                id,
                name,
                owner_id,
                is_preset,
                display_order
            `)
            .eq("active", true)
            .eq("is_preset", false)
            .eq("owner_id", adminUserId)
            .order(
                "created_at",
                { ascending: false }
            );

    const presetsResult =
        await db
            .from("tornado_boards")
            .select(`
                id,
                name,
                owner_id,
                is_preset,
                display_order
            `)
            .eq("active", true)
            .eq("is_preset", true)
            .order(
                "display_order",
                { ascending: true }
            );

    if (draftsResult.error) {
        console.error(
            "Could not load Tornado drafts:",
            draftsResult.error
        );
    }

    if (presetsResult.error) {
        console.error(
            "Could not load Tornado presets:",
            presetsResult.error
        );
    }

    return {
        drafts:
            draftsResult.data || [],

        presets:
            presetsResult.data || []
    };
}

async function dbPublishTornadoPreset(
    boardId,
    adminUserId
) {
    const { data, error } =
        await db
            .from("tornado_boards")
            .update({
                is_preset: true,
                is_public: true,
                slug: null,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("owner_id", adminUserId)
            .eq("is_preset", false)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not publish Tornado preset:",
            error
        );

        return false;
    }

    return Boolean(data);
}

async function dbUnpublishTornadoPreset(
    boardId,
    adminUserId
) {
    const { data, error } =
        await db
            .from("tornado_boards")
            .update({
                owner_id: adminUserId,
                is_preset: false,
                is_public: false,
                slug: null,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("is_preset", true)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not remove Tornado preset:",
            error
        );

        return false;
    }

    return Boolean(data);
}

// BINGO GAME
async function dbGetBingoItems(
    categoryId = null,
    tagIds = [],
    languageId = 1
) {
    const items =
        await dbGetAllItems();

    const itemTags =
        await dbGetItemTags();

    const translations =
        await dbGetTranslations();

    let filteredItems =
        items.filter(item =>
            item.active === true &&
            item.image_url
        );

    if (
        categoryId &&
        categoryId !==
            "browse-by-tag"
    ) {
        filteredItems =
            filteredItems.filter(
                item =>
                    item.category_id ==
                    categoryId
            );
    }

    if (tagIds.length > 0) {
        filteredItems =
            filteredItems.filter(
                item => {
                    const matchingTags =
                        itemTags.filter(
                            itemTag =>
                                itemTag.item_id ===
                                    item.id
                        );

                    return matchingTags.some(
                        itemTag =>
                            tagIds.includes(
                                itemTag.tag_id
                            )
                    );
                }
            );
    }

    return filteredItems
        .map(item => {
            const translation =
                translations.find(
                    row =>
                        row.item_id ===
                            item.id &&
                        row.language_id ===
                            languageId
                );

            if (!translation) {
                return null;
            }

            return {
                id: item.id,
                name: translation.text,
                url: item.image_url
            };
        })
        .filter(Boolean);
}

async function dbSaveBingoSet({
    name,
    languageId,
    gridSize,
    hasFreeCenter,
    hostDisplayMode,
    playerDisplayMode,
    itemIds
}) {
    const { data, error } =
        await db.rpc(
            "save_bingo_set",
            {
                input_name:
                    name,

                input_language_id:
                    languageId,

                input_grid_size:
                    gridSize,

                input_has_free_center:
                    hasFreeCenter,

                input_host_display_mode:
                    hostDisplayMode,

                input_player_display_mode:
                    playerDisplayMode,

                input_item_ids:
                    itemIds
            }
        );

    if (error) {
        console.error(
            "Could not save Bingo set:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbGetMyBingoSets() {
    const userResult =
        await db.auth.getUser();

    const user =
        userResult.data?.user;

    if (
        userResult.error ||
        !user ||
        user.is_anonymous
    ) {
        return {
            data: [],
            error:
                userResult.error || null
        };
    }

    const { data, error } =
        await db
            .from("bingo_sets")
            .select(`
                id,
                name,
                language_id,
                slug,
                is_public,
                grid_size,
                has_free_center,
                host_display_mode,
                player_display_mode,
                created_at,
                updated_at
            `)
            .eq(
                "owner_id",
                user.id
            )
            .eq(
                "active",
                true
            )
            .order(
                "updated_at",
                {
                    ascending: false
                }
            );

    if (error) {
        console.error(
            "Could not load saved Bingo sets:",
            error
        );

        return {
            data: [],
            error
        };
    }

    return {
        data: data || [],
        error: null
    };
}

async function dbGetBingoSetItems(
    setId,
    languageId
) {
    const {
        data: setItemRows,
        error: setItemsError
    } =
        await db
            .from("bingo_set_items")
            .select(
                "item_id, position"
            )
            .eq(
                "set_id",
                setId
            )
            .order(
                "position",
                {
                    ascending: true
                }
            );

    if (setItemsError) {
        console.error(
            "Could not load Bingo set items:",
            setItemsError
        );

        return {
            data: [],
            error: setItemsError
        };
    }

    const itemIds =
        (setItemRows || []).map(
            row =>
                Number(row.item_id)
        );

    if (itemIds.length === 0) {
        return {
            data: [],
            error: null
        };
    }

    const [
        itemsResult,
        translationsResult
    ] =
        await Promise.all([
            db
                .from("items")
                .select(
                    "id, image_url, active"
                )
                .in(
                    "id",
                    itemIds
                )
                .eq(
                    "active",
                    true
                ),

            db
                .from("translations")
                .select(
                    "item_id, text"
                )
                .in(
                    "item_id",
                    itemIds
                )
                .eq(
                    "language_id",
                    languageId
                )
        ]);

    if (
        itemsResult.error ||
        translationsResult.error
    ) {
        const error =
            itemsResult.error ||
            translationsResult.error;

        console.error(
            "Could not load the saved Bingo items:",
            error
        );

        return {
            data: [],
            error
        };
    }

    const orderedItems =
        itemIds
            .map(itemId => {
                const item =
                    itemsResult.data.find(
                        row =>
                            Number(row.id) ===
                            itemId
                    );

                if (!item) {
                    return null;
                }

                const translation =
                    translationsResult.data.find(
                        row =>
                            Number(row.item_id) ===
                            itemId
                    );

                return {
                    id:
                        itemId,

                    name:
                        translation?.text ||
                        "(No translation)",

                    url:
                        item.image_url
                };
            })
            .filter(Boolean);

    return {
        data: orderedItems,
        error: null
    };
}

async function dbDeleteBingoSet(
    setId
) {
    const { data, error } =
        await db.rpc(
            "delete_bingo_set",
            {
                input_set_id:
                    setId
            }
        );

    if (error) {
        console.error(
            "Could not delete Bingo set:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbEnableBingoSetSharing(
    setId,
    slug
) {
    const { data, error } =
        await db.rpc(
            "enable_bingo_set_sharing",
            {
                input_set_id:
                    setId,

                input_slug:
                    slug
            }
        );

    if (error) {
        console.error(
            "Could not create Bingo share link:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data:
            Array.isArray(data)
                ? data[0]
                : data,

        error: null
    };
}

async function dbGetSharedBingoSet(
    slug
) {
    const { data, error } =
        await db
            .from("bingo_sets")
            .select(`
                id,
                name,
                slug,
                language_id,
                grid_size,
                has_free_center,
                host_display_mode,
                player_display_mode
            `)
            .eq(
                "slug",
                slug
            )
            .eq(
                "is_public",
                true
            )
            .eq(
                "active",
                true
            )
            .maybeSingle();

    if (error) {
        console.error(
            "Could not load shared Bingo set:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbCreateBingoSession({
    name,
    languageId,
    gridSize,
    hasFreeCenter,
    hostDisplayMode,
    playerDisplayMode,
    maxPlayers,
    itemIds,
    setId = null
}) {
    const { data, error } =
        await db.rpc(
            "create_bingo_session",
            {
                input_name:
                    name,

                input_language_id:
                    languageId,

                input_grid_size:
                    gridSize,

                input_has_free_center:
                    hasFreeCenter,

                input_host_display_mode:
                    hostDisplayMode,

                input_player_display_mode:
                    playerDisplayMode,

                input_max_players:
                    maxPlayers,

                input_item_ids:
                    itemIds,

                input_set_id:
                    setId
            }
        );

    if (error) {
        console.error(
            "Could not create Bingo room:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbCallNextBingoItem(
    sessionId
) {
    const { data, error } =
        await db.rpc(
            "call_next_bingo_item",
            {
                input_session_id:
                    sessionId
            }
        );

    if (error) {
        console.error(
            "Could not call the next Bingo item:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbStartBingoSession(
    sessionId
) {
    const { data, error } =
        await db.rpc(
            "start_bingo_session",
            {
                input_session_id:
                    sessionId
            }
        );

    if (error) {
        console.error(
            "Could not start Bingo game:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbJoinBingoRoom(
    roomCode,
    displayName
) {
    const { data, error } =
        await db.rpc(
            "join_bingo_room",
            {
                input_room_code:
                    roomCode,

                input_display_name:
                    displayName
            }
        );

    if (error) {
        console.error(
            "Could not join Bingo room:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbGetBingoPlayerRoom(
    sessionId
) {
    const sessionResult =
        await db
            .from("bingo_sessions")
            .select(`
                id,
                room_code,
                status,
                grid_size,
                has_free_center,
                player_display_mode,
                language_id
            `)
            .eq("id", sessionId)
            .single();

    if (sessionResult.error) {
        console.error(
            "Could not load Bingo room:",
            sessionResult.error
        );

        return {
            session: null,
            items: [],
            error:
                sessionResult.error
        };
    }

    const sessionItemsResult =
        await db
            .from("bingo_session_items")
            .select(`
                item_id,
                draw_position
            `)
            .eq("session_id", sessionId)
            .order(
                "draw_position",
                { ascending: true }
            );

    if (sessionItemsResult.error) {
        console.error(
            "Could not load Bingo room items:",
            sessionItemsResult.error
        );

        return {
            session:
                sessionResult.data,

            items: [],

            error:
                sessionItemsResult.error
        };
    }

    const allItems =
        await dbGetBingoItems(
            null,
            [],
            sessionResult.data.language_id
        );

    const itemById =
        new Map(
            allItems.map(
                item => [
                    Number(item.id),
                    item
                ]
            )
        );

    const roomItems =
        sessionItemsResult.data
            .map(row =>
                itemById.get(
                    Number(row.item_id)
                )
            )
            .filter(Boolean);

    return {
        session:
            sessionResult.data,

        items:
            roomItems,

        error: null
    };
}

async function dbSaveBingoPlayerCard(
    playerId,
    itemIds
) {
    const { data, error } =
        await db.rpc(
            "save_bingo_player_card",
            {
                input_player_id:
                    playerId,

                input_item_ids:
                    itemIds
            }
        );

    if (error) {
        console.error(
            "Could not save Bingo card:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbSetBingoPlayerReady(
    playerId,
    isReady
) {
    const { data, error } =
        await db.rpc(
            "set_bingo_player_ready",
            {
                input_player_id:
                    playerId,

                input_is_ready:
                    isReady
            }
        );

    if (error) {
        console.error(
            "Could not update Bingo readiness:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbGetBingoPlayers(
    sessionId
) {
    const { data, error } =
        await db
            .from("bingo_players")
            .select(`
                id,
                display_name,
                is_ready,
                joined_at
            `)
            .eq(
                "session_id",
                sessionId
            )
            .order(
                "joined_at",
                { ascending: true }
            );

    if (error) {
        console.error(
            "Could not load Bingo players:",
            error
        );

        return {
            data: [],
            error
        };
    }

    return {
        data: data || [],
        error: null
    };
}

async function dbGetBingoPlayerCells(
    playerId
) {
    const { data, error } =
        await db
            .from(
                "bingo_player_cells"
            )
            .select(`
                id,
                position,
                item_id,
                is_free,
                marked_at
            `)
            .eq(
                "player_id",
                playerId
            )
            .order(
                "position",
                { ascending: true }
            );

    if (error) {
        console.error(
            "Could not load Bingo card cells:",
            error
        );

        return {
            data: [],
            error
        };
    }

    return {
        data: data || [],
        error: null
    };
}

async function dbGetBingoCalls(
    sessionId
) {
    const { data, error } =
        await db
            .from("bingo_calls")
            .select(`
                id,
                item_id,
                call_order,
                called_at
            `)
            .eq(
                "session_id",
                sessionId
            )
            .order(
                "call_order",
                { ascending: true }
            );

    if (error) {
        console.error(
            "Could not load called Bingo items:",
            error
        );

        return {
            data: [],
            error
        };
    }

    return {
        data: data || [],
        error: null
    };
}

async function dbMarkBingoCell(
    cellId
) {
    const { data, error } =
        await db.rpc(
            "mark_bingo_cell",
            {
                input_cell_id:
                    cellId
            }
        );

    if (error) {
        console.error(
            "Could not mark Bingo square:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbGetBingoWins(
    sessionId
) {
    const winsResult =
        await db
            .from("bingo_wins")
            .select(`
                id,
                player_id,
                winning_pattern,
                winning_positions,
                detected_at
            `)
            .eq(
                "session_id",
                sessionId
            )
            .eq(
                "is_verified",
                true
            )
            .order(
                "detected_at",
                { ascending: true }
            );

    if (winsResult.error) {
        console.error(
            "Could not load Bingo winners:",
            winsResult.error
        );

        return {
            data: [],
            error:
                winsResult.error
        };
    }

    const playersResult =
        await dbGetBingoPlayers(
            sessionId
        );

    if (playersResult.error) {
        return {
            data: [],
            error:
                playersResult.error
        };
    }

    const playerNames =
        new Map(
            playersResult.data.map(
                player => [
                    player.id,
                    player.display_name
                ]
            )
        );

    return {
        data:
            winsResult.data.map(
                win => ({
                    ...win,

                    display_name:
                        playerNames.get(
                            win.player_id
                        ) ||
                        "Player"
                })
            ),

        error: null
    };
}

async function dbFinishBingoSession(
    sessionId
) {
    const { data, error } =
        await db.rpc(
            "finish_bingo_session",
            {
                input_session_id:
                    sessionId
            }
        );

    if (error) {
        console.error(
            "Could not finish Bingo game:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

async function dbSaveBingoCardDraft(
    playerId,
    positions,
    itemIds
) {
    const { data, error } =
        await db.rpc(
            "save_bingo_card_draft",
            {
                input_player_id:
                    playerId,

                input_positions:
                    positions,

                input_item_ids:
                    itemIds
            }
        );

    if (error) {
        console.error(
            "Could not save Bingo card draft:",
            error
        );

        return {
            data: null,
            error
        };
    }

    return {
        data,
        error: null
    };
}

// ADMIN

async function dbGetAdminCategoryClashBoards(
    adminUserId
) {
    const draftsResult =
        await db
            .from(
                "category_clash_boards"
            )
            .select(`
                id,
                name,
                owner_id,
                is_preset,
                display_order
            `)
            .eq("active", true)
            .eq("is_preset", false)
            .eq("owner_id", adminUserId)
            .order(
                "created_at",
                { ascending: false }
            );

    const presetsResult =
        await db
            .from(
                "category_clash_boards"
            )
            .select(`
                id,
                name,
                owner_id,
                is_preset,
                display_order
            `)
            .eq("active", true)
            .eq("is_preset", true)
            .order(
                "display_order",
                { ascending: true }
            )
            .order(
                "name",
                { ascending: true }
            );

    if (draftsResult.error) {
        console.error(
            "Could not load admin drafts:",
            draftsResult.error
        );
    }

    if (presetsResult.error) {
        console.error(
            "Could not load presets:",
            presetsResult.error
        );
    }

    return {
        drafts:
            draftsResult.data || [],

        presets:
            presetsResult.data || []
    };
}

async function dbPublishCategoryClashPreset(
    boardId,
    adminUserId
) {
    const { data, error } =
        await db
            .from(
                "category_clash_boards"
            )
            .update({
                is_preset: true,
                is_public: true,
                slug: null,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("owner_id", adminUserId)
            .eq("is_preset", false)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not publish preset:",
            error
        );

        return false;
    }

    return Boolean(data);
}

async function dbUnpublishCategoryClashPreset(
    boardId,
    adminUserId
) {
    const { data, error } =
        await db
            .from(
                "category_clash_boards"
            )
            .update({
                owner_id: adminUserId,
                is_preset: false,
                is_public: false,
                slug: null,
                updated_at:
                    new Date().toISOString()
            })
            .eq("id", boardId)
            .eq("is_preset", true)
            .select("id")
            .single();

    if (error) {
        console.error(
            "Could not unpublish preset:",
            error
        );

        return false;
    }

    return Boolean(data);
}

// SUBSCRIPTION

async function dbUserHasPremium() {
    const { data, error } =
        await db.rpc(
            "user_has_premium"
        );

    if (error) {
        console.error(
            "Could not check Premium access:",
            error
        );

        return false;
    }

    return data === true;
}

async function dbGetFreeSavedGameLimit() {
    const { data, error } =
        await db.rpc(
            "get_free_saved_game_limit"
        );

    if (error) {
        console.error(
            "Could not load the free saved-game limit:",
            error
        );

        return 10;
    }

    const limit = Number(data);

    if (
        !Number.isInteger(limit) ||
        limit < 1
    ) {
        return 10;
    }

    return limit;
}