function shuffle(arr){
    return [...arr].sort(
        ()=>Math.random()-0.5
    );
}

function populateItemCount(
    itemCount,
    min = 3,
    max = 10
){

    itemCount.innerHTML = "";

    for(
        let i = min;
        i <= max;
        i++
    ){

        const option =
            document.createElement(
                "option"
            );

        option.value = i;

        option.textContent = i;

        itemCount.appendChild(
            option
        );

    }

}

function populateCardCount(cardCountSelect) {

    cardCountSelect.innerHTML = "";

    for (let i = 1; i <= 20; i++) {

        const option =
            document.createElement("option");

        option.value = i;

        option.textContent = i;

        cardCountSelect.appendChild(option);

    }

}