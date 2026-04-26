// ===============================
// ARTICLES.JS (FINAL CLEAN VERSION)
// ===============================

let allArticles = [];
let filteredArticles = [];
let articlesCurrentPage = 1;
const itemsPerPage = 6;


// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  try {
    allArticles = await getArticles();
    filteredArticles = [...allArticles];

    setupFilters();
    renderArticles();
  } catch (err) {
    console.error("Error loading articles:", err);
  }
});


// -------------------------------
// RENDER ARTICLES
// -------------------------------
function renderArticles() {
  const grid = document.getElementById("articlesGrid");
  const pagination = document.getElementById("articlesPagination");

  if (!grid) return;

  grid.innerHTML = "";

  const start = (articlesCurrentPage - 1) * itemsPerPage;
  const paginated = filteredArticles.slice(start, start + itemsPerPage);

  if (!paginated.length) {
    grid.innerHTML = `<p class="no-results">No articles found.</p>`;
    if (pagination) pagination.innerHTML = "";
    return;
  }

  paginated.forEach(article => {
    const card = document.createElement("div");
    card.className = "card article-card";

    card.innerHTML = `
      <span class="card-tag">${article.category || "Publication"}</span>

      <h3>${article.title || "Untitled"}</h3>

      <p>${article.summary || ""}</p>

      <div class="card-meta">
        <span>${formatDate(article.created_at)}</span>
        <span>${article.read_time || ""}</span>
      </div>

      ${
        article.link
          ? `<a href="${article.link}" target="_blank" class="card-link">Read more →</a>`
          : `<span class="card-link">Coming soon</span>`
      }
    `;

    grid.appendChild(card);
  });

  renderPagination();
}


// -------------------------------
// PAGINATION
// -------------------------------
function renderPagination() {
  const pagination = document.getElementById("articlesPagination");
  if (!pagination) return;

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = `
    <div class="pagination-inner">
      <button ${articlesCurrentPage === 1 ? "disabled" : ""} id="prevBtn">Prev</button>
      <span>Page ${articlesCurrentPage} of ${totalPages}</span>
      <button ${articlesCurrentPage === totalPages ? "disabled" : ""} id="nextBtn">Next</button>
    </div>
  `;

  document.getElementById("prevBtn").onclick = () => {
    if (articlesCurrentPage > 1) {
      articlesCurrentPage--;
      renderArticles();
    }
  };

  document.getElementById("nextBtn").onclick = () => {
    if (articlesCurrentPage < totalPages) {
      articlesCurrentPage++;
      renderArticles();
    }
  };
}


// -------------------------------
// FILTERS + SEARCH
// -------------------------------
function setupFilters() {
  const searchInput = document.getElementById("articlesSearch");
  const filterButtons = document.querySelectorAll(".pill-filter");

  if (!searchInput) return;

  function applyFilters() {
    const searchValue = searchInput.value.toLowerCase().trim();

    const activeFilter =
      document.querySelector(".pill-filter.active")?.dataset.filter || "all";

    filteredArticles = allArticles.filter(article => {
      const title = (article.title || "").toLowerCase();
      const summary = (article.summary || "").toLowerCase();
      const category = (article.category || "").toLowerCase();

      const matchesSearch =
        title.includes(searchValue) ||
        summary.includes(searchValue);

      const matchesFilter =
        activeFilter === "all" ||
        category === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    articlesCurrentPage = 1;
    renderArticles();
  }

  // Search
  searchInput.addEventListener("input", applyFilters);

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      applyFilters();
    });
  });
}


// -------------------------------
// DATE FORMATTER
// -------------------------------
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}