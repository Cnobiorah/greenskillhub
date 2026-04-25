// ===============================
// RESOURCES.JS
// ===============================

let allResources = [];
let filteredResources = [];
let currentPage = 1;
const itemsPerPage = 6;


// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  allResources = Array.from(document.querySelectorAll(".resource-item"));

  filteredResources = [...allResources];

  setupFilters();
  renderResources();
});


// -------------------------------
// RENDER
// -------------------------------
function renderResources() {
  const container = document.getElementById("resourceList");
  const pagination = document.getElementById("resourcePagination");

  // Hide all first
  allResources.forEach(el => el.style.display = "none");

  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filteredResources.slice(start, start + itemsPerPage);

  if (paginated.length === 0) {
    container.innerHTML = `<p class="no-results">No resources found.</p>`;
    pagination.innerHTML = "";
    return;
  }

  paginated.forEach(el => {
    el.style.display = "block";
  });

  renderPagination();
}


// -------------------------------
// PAGINATION
// -------------------------------
function renderPagination() {
  const pagination = document.getElementById("resourcePagination");

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  pagination.innerHTML = `
    <div class="pagination-inner">
      <button class="btn-page" ${currentPage === 1 ? "disabled" : ""} id="prevBtn">Prev</button>
      <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
      <button class="btn-page" ${currentPage === totalPages ? "disabled" : ""} id="nextBtn">Next</button>
    </div>
  `;

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    currentPage--;
    renderResources();
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    currentPage++;
    renderResources();
  });
}


// -------------------------------
// FILTERS + SEARCH
// -------------------------------
function setupFilters() {
  const searchInput = document.getElementById("resourceSearch");
  const categoryFilter = document.getElementById("resourceCategory");
  const accessFilter = document.getElementById("resourceAccess");

  function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const accessValue = accessFilter.value;

    filteredResources = allResources.filter(item => {
      const keywords = item.dataset.keywords || "";

      const matchesSearch =
        keywords.toLowerCase().includes(searchValue);

      const matchesCategory =
        categoryValue === "all" ||
        item.dataset.category === categoryValue;

      const matchesAccess =
        accessValue === "all" ||
        item.dataset.access === accessValue;

      return matchesSearch && matchesCategory && matchesAccess;
    });

    currentPage = 1;
    renderResources();
  }

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  accessFilter.addEventListener("change", applyFilters);
}