const categories = [
  {
    title: "Teacher Tools",
    color: "orange",
    id: "generators",
    items: [{name:"Bingo Generator", url: "teacher tools/bingo/bingo.html"},
         {name:"Word Puzzle", url: "teacher tools/word puzzle/wordpuzzle.html"}, {name:"Flash Card", url: "teacher tools/flash card/flashcard.html"}]
  },
  {
    title: "Fun Games",
    color: "blue",
    id: "games",
    items: [{name:"Tornado Game", url: "fun games/Tornado Game/tornado.html"}, {name:"Guess the Image", url: "fun games/guess the image/guess.html"},
      {name:"Category Clash", url: "fun games/Category Clash/categoryclash.html"}]
  },
  {
    title: "Random Pickers",
    color: "yellow",
    id: "pickers",
    items: [{name:"Name Picker", url: "insert url"}, {name:"Number Picker", url: "insert url"}]
  },
  {
    title: "Classroom Tools",
    color: "green",
    id: "tools",
    items: [{name:"Timer", url: "insert url"}, {name:"Score Tracker", url: "insert url"}] 
  }
];

function renderCategories() {
  const container = document.getElementById("categories");

  categories.forEach(category => {
    const card = document.createElement("div");
    card.id = `${category.id}`
    card.className = `card ${category.color}`;

    const title = document.createElement("h2");
    title.textContent = category.title;

    const list = document.createElement("ul");

    category.items.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.target = '_blank';
      a.rel ="noopener noreferrer"//prevents newpage access
      a.textContent = item.name;
      a.href = item.url;

      li.appendChild(a);
      list.appendChild(li);
      
    });

    card.appendChild(title);
    card.appendChild(list);
    container.appendChild(card);
  });
}

renderCategories();

async function testConnection() {

    const { data, error } = await db
        .from("categories")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
    console.log(error);
}

testConnection();