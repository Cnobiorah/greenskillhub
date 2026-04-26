// ===============================
// UPDATES.JS (FIXED)
// ===============================

let allUpdates = [];
let filteredUpdates = [];
let updatesCurrentPage = 1;
const itemsPerPage = 6;


// INIT
document.addEventListener("DOMContentLoaded", async () => {
  allUpdates = await getUpdates();
  filteredUpdates = [...allUpdates];
  setupFilters();
  renderUpdates();
});


// RENDER
function renderUpdates() {
  const grid = document.getElementById("updatesGrid");
  const pagination = document.getElementById("updatesPagination");

  grid.innerHTML = "";

  const start = (updatesCurrentPage - 1) * itemsPerPage;
  const items = filteredUpdates.slice(start, start + itemsPerPage);

  if (!items.length) {
    grid.innerHTML = `<p>No updates found.</p>`;
    pagination.innerHTML = "";
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card update-card";

    card.innerHTML = `
      <div class="update-header">
        <span class="badge ${
          item.access?.toLowerCase().includes("free")
            ? "badge-free"
            : "badge-paid"
        }">
          ${item.access || "Info"}
        </span>
        <span class="update-category">${item.sector || "General"}</span>
      </div>

      <h3>${item.title}</h3>

      <p class="update-provider">${item.provider || "Unknown Provider"}</p>

      <ul class="update-meta-list">
        <li><strong>Type:</strong> ${item.type || "-"}</li>
        <li><strong>Level:</strong> ${item.level || "-"}</li>
        <li><strong>Duration:</strong> ${item.duration || "-"}</li>
        <li><strong>Format:</strong> ${item.format || "-"}</li>
      </ul>

      <a href="${item.link || "#"}" target="_blank" class="card-link">
        View details →
      </a>
    `;

    grid.appendChild(card);
  });

  renderPagination();
}


// PAGINATION
function renderPagination() {
  const pagination = document.getElementById("updatesPagination");

  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = `
    <button ${updatesCurrentPage === 1 ? "disabled" : ""} id="prevBtn">Prev</button>
    <span>Page ${updatesCurrentPage} of ${totalPages}</span>
    <button ${updatesCurrentPage === totalPages ? "disabled" : ""} id="nextBtn">Next</button>
  `;

  document.getElementById("prevBtn").onclick = () => {
    updatesCurrentPage--;
    renderUpdates();
  };

  document.getElementById("nextBtn").onclick = () => {
    updatesCurrentPage++;
    renderUpdates();
  };
}


// FILTERS
function setupFilters() {
  const search = document.getElementById("updatesSearch");
  const sector = document.getElementById("updatesSectorFilter");
  const type = document.getElementById("updatesTypeFilter");

  function apply() {
    const searchVal = search.value.toLowerCase();

    filteredUpdates = allUpdates.filter(item => {
      return (
        (item.title?.toLowerCase().includes(searchVal) ||
          item.provider?.toLowerCase().includes(searchVal)) &&
        (sector.value === "all" || item.sector === sector.value) &&
        (type.value === "all" || item.type === type.value)
      );
    });

    updatesCurrentPage = 1;
    renderUpdates();
  }

  search.addEventListener("input", apply);
  sector.addEventListener("change", apply);
  type.addEventListener("change", apply);
}