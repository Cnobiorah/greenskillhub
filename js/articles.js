// ===============================
// ARTICLES.JS
// ===============================

let allArticles = [];
let filteredArticles = [];
let currentPage = 1;
const itemsPerPage = 6;


// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  allArticles = await getArticles();

  filteredArticles = [...allArticles];

  setupFilters();
  renderArticles();
});


// -------------------------------
// RENDER ARTICLES
// -------------------------------
function renderArticles() {
  const grid = document.getElementById("articlesGrid");
  const pagination = document.getElementById("articlesPagination");

  grid.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filteredArticles.slice(start, start + itemsPerPage);

  if (paginated.length === 0) {
    grid.innerHTML = `<p class="no-results">No articles found.</p>`;
    pagination.innerHTML = "";
    return;
  }

  paginated.forEach(article => {
    const card = document.createElement("div");
    card.className = "card article-card";

    card.innerHTML = `
      <span class="card-tag">${article.category || "Publication"}</span>

      <h3>${article.title}</h3>

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

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  pagination.innerHTML = `
    <div class="pagination-inner">
      <button class="btn-page" ${currentPage === 1 ? "disabled" : ""} id="prevBtn">Prev</button>
      <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
      <button class="btn-page" ${currentPage === totalPages ? "disabled" : ""} id="nextBtn">Next</button>
    </div>
  `;

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    currentPage--;
    renderArticles();
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    currentPage++;
    renderArticles();
  });
}


// -------------------------------
// FILTERS + SEARCH
// -------------------------------
function setupFilters() {
  const searchInput = document.getElementById("articlesSearch");
  const filterButtons = document.querySelectorAll(".pill-filter");

  function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();

    const activeFilter =
      document.querySelector(".pill-filter.active")?.dataset.filter || "all";

    filteredArticles = allArticles.filter(article => {
      const matchesSearch =
        article.title?.toLowerCase().includes(searchValue) ||
        article.summary?.toLowerCase().includes(searchValue);

      const matchesFilter =
        activeFilter === "all" ||
        article.category === activeFilter;

      return matchesSearch && matchesFilter;
    });

    currentPage = 1;
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