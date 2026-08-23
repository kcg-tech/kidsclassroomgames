const categorySections = [
  {
    title: "Teacher Tools",
    description:
      "Create printable materials and activities for lessons, review, and vocabulary practice.",
    color: "orange",
    id: "generators",
    section: "teacher-tools"
  },
  {
    title: "Fun Games",
    description:
      "Play interactive classroom games that make review sessions more engaging.",
    color: "blue",
    id: "games",
    section: "fun-games"
  },
  {
    title: "Live Games",
    description:
      "Create live game rooms where teachers and students can play together on different devices.",
    color: "green",
    id: "live-games",
    section: "live-games"
  },
  {
    title: "Random Pickers",
    description:
      "Make quick random classroom selections for names, numbers, and activities.",
    color: "yellow",
    id: "pickers",
    section: "random-pickers"
  }
];

function addResourceContent(
  container,
  resource
) {
  const name =
    document.createElement("strong");

  name.className =
    "resource-name";

  name.textContent =
    resource.name;

  const description =
    document.createElement("span");

  description.className =
    "resource-description";

  description.textContent =
    resource.description;

  container.appendChild(name);
  container.appendChild(description);
}

async function renderCategories() {
  const container =
    document.getElementById(
      "categories"
    );

  container.innerHTML = "";

  const resources =
    await dbGetSiteResources();

  categorySections.forEach(category => {
    const card =
      document.createElement("article");

    card.id = category.id;

    card.className =
      `card ${category.color}`;

    const title =
      document.createElement("h2");

    title.textContent =
      category.title;

    const categoryDescription =
      document.createElement("p");

    categoryDescription.className =
      "category-description";

    categoryDescription.textContent =
      category.description;

    const list =
      document.createElement("ul");

    const sectionResources =
      resources.filter(
        resource =>
          resource.section ===
            category.section
      );

    sectionResources.forEach(
      resource => {
        const listItem =
          document.createElement("li");

        if (
          resource.status ===
          "available"
        ) {
          const link =
            document.createElement("a");

          link.className =
            "resource-link";

          link.href =
            resource.url;

          if (resource.open_new_tab) {
            link.target = "_blank";
            link.rel =
              "noopener noreferrer";
          }

          addResourceContent(
            link,
            resource
          );

          listItem.appendChild(
            link
          );
        } else {
          const comingSoon =
            document.createElement("div");

          comingSoon.className =
            "resource-link coming-soon-resource";

          comingSoon.setAttribute(
            "aria-disabled",
            "true"
          );

          addResourceContent(
            comingSoon,
            resource
          );

          const badge =
            document.createElement("span");

          badge.className =
            "coming-soon-badge";

          badge.textContent =
            "Coming Soon";

          comingSoon.appendChild(
            badge
          );

          listItem.appendChild(
            comingSoon
          );
        }

        list.appendChild(
          listItem
        );
      }
    );

    card.appendChild(title);
    card.appendChild(
      categoryDescription
    );
    card.appendChild(list);

    container.appendChild(card);
  });
}

renderCategories();

const accountNavLink =
  document.getElementById(
    "accountNavLink"
  );

async function updateAccountNavigation() {
  const { data, error } =
    await db.auth.getSession();

  if (error) {
    console.error(
      "Could not check login status:",
      error
    );

    return;
  }

  accountNavLink.textContent =
    data.session
      ? "My Account"
      : "Log In";
}

db.auth.onAuthStateChange(
  () => {
    setTimeout(
      updateAccountNavigation,
      0
    );
  }
);

window.addEventListener(
  "focus",
  updateAccountNavigation
);

updateAccountNavigation();

