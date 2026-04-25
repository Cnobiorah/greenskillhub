// ===============================
// UPDATES.JS
// ===============================

let allUpdates = [];
let filteredUpdates = [];
let currentPage = 1;
const itemsPerPage = 6;


// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  allUpdates = await getUpdates();

  filteredUpdates = [...allUpdates];

  setupFilters();
  renderUpdates();
});


// -------------------------------
// RENDER FUNCTION
// -------------------------------
function renderUpdates() {
  const grid = document.getElementById("updatesGrid");
  const pagination = document.getElementById("updatesPagination");

  grid.innerHTML = "";

  // Pagination logic
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredUpdates;tart, start + itemsPerPage;

  if (paginatedItems.length === 0) {
    grid.innerHTML = `<p class="no-results">No updates found.</p>`;
    pagination.innerHTML = "";
    return;
  }

  paginatedItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card update-card";

    card.innerHTML = `
      <div class="update-header">
        <span class="badge ${item.access?.toLowerCase().includes('free') ? 'badge-free' : 'badge-paid'}
          ${item.access || 'info'}
        </span>
        <span class="update-category">${item.sector || ''}</span>
      </div>

      <h3>${item.title}</h3>

      <p class="update-provider">${item.provider || ''}</p>

      <ul class="update-meta-list">
        <li>Type: ${item.type || 'Course'}</li>
<li>Level: ${item.level || 'All Levels'}</li>
<li>Duration: ${item.duration || 'Flexible'}</li>
<li>Format: ${item.format || 'Online'}</li>
      </ul>

      <a href="${item.link}" target="_blank" class="card-link">
        View details →
      </a>
    `;

    grid.appendChild(card);
  });

  renderPagination();
}


// -------------------------------
// PAGINATION
// -------------------------------
function renderPagination() {
  const pagination = document.getElementById("updatesPagination");

  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage);

  pagination.innerHTML = `
    <div class="pagination-inner">
      <button class="btn-page" ${currentPage === 1 ? "disabled" : ""} id="prevBtn">Prev</button>
      <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
      <button class="btn-page" ${currentPage === totalPages ? "disabled" : ""} id="nextBtn">Next</button>
    </div>
  `;

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    currentPage--;
    renderUpdates();
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    currentPage++;
    renderUpdates();
  });
}


// -------------------------------
// FILTERS + SEARCH
// -------------------------------
function setupFilters() {
  const searchInput = document.getElementById("updatesSearch");
  const sectorFilter = document.getElementById("updatesSectorFilter");
  const typeFilter = document.getElementById("updatesTypeFilter");

  function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const sectorValue = sectorFilter.value;
    const typeValue = typeFilter.value;

    filteredUpdates = allUpdates.filter(item => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchValue) ||
        item.provider?.toLowerCase().includes(searchValue);

      const matchesSector =
        sectorValue === "all" || item.sector === sectorValue;

      const matchesType =
        typeValue === "all" || item.type === typeValue;

      return matchesSearch && matchesSector && matchesType;
    });

    currentPage = 1;
    renderUpdates();
  }

  searchInput.addEventListener("input", applyFilters);
  sectorFilter.addEventListener("change", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
}