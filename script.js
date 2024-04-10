// Fetching the API Key and storing it as a variable
const apiKey = "ea72acdad7bb41e5936e479fd55b9b79";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Define a function to fetch Random news from Newsapi.org
async function fetchRandomNews(pageCount, articlesPerPage) {
  try {
    const articles = [];
    const fetchedArticles = new Set(); // Keep track of fetched articles in order to remove duplicates
    let currentPage = 1;

    while (articles.length < pageCount * articlesPerPage) {
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&page=${currentPage}&pageSize=${articlesPerPage}&apiKey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const filteredArticles = data.articles.filter(
        (article) =>
          article.urlToImage &&
          article.description &&
          !fetchedArticles.has(article.title)
      );
      filteredArticles.forEach((article) => fetchedArticles.add(article.title)); // Add fetched articles to the set
      articles.push(...filteredArticles);
      currentPage++;
    }
    return articles.slice(0, pageCount * articlesPerPage);
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}
// To search for articles on the page based on the keyword entered
searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      displayBlogs(articles);
    } catch (error) {
      console.log("Error fetching news by query", error);
    }
  }
});

async function fetchNewsQuery(query) {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=20&apiKey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    // filter out articles without images or descriptions
    const filteredArticles = data.articles.filter(
      (article) => article.urlToImage && article.description
    );
    return filteredArticles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}
function displayBlogs(articles) {
  blogContainer.innerHTML = "";
  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");
    const img = document.createElement("img");
    img.src = article.urlToImage;
    img.alt = article.title;
    // handle image loading errors
    img.onerror = function () {
      img.src = "https://placehold.co/600x400"; //Provide a placeholder image URL
      img.alt = "Image not available";
    };
    const title = document.createElement("h2");
    const truncatedTitle =
      article.title.length > 30
        ? article.title.slice(0, 30) + "...."
        : article.title;
    title.textContent = truncatedTitle;
    const description = document.createElement("p");
    let truncatedDescr = "";
    if (article.description !== null) {
      truncatedDescr =
        article.description && article.description.length > 120
          ? article.description.slice(0, 120) + "...."
          : article.description;
    }
    description.textContent = truncatedDescr;

    blogCard.appendChild(title);
    blogCard.appendChild(img);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    blogContainer.append(blogCard);
  });
}

(async () => {
  try {
    const pageCount = 1; // Number of pages
    const articlesPerPage = 12; // Number of articles per page
    const articles = await fetchRandomNews(pageCount, articlesPerPage);
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching random news", error);
  }
})();
