// ===============================
// UPDATES.JS (FIXED)
// ===============================

let allUpdates = [];
let filteredUpdates = [];
let updatesCurrentPage = 1;
const updatesItemsPerPage = 6;


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

  const start = (updatesCurrentPage - 1) * updatesItemsPerPage;
  const items = filteredUpdates.slice(start, start + updatesItemsPerPage);

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
        <li><strong>Type:</strong> ${item.Type || item.type || "-"}</li>
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

  const totalPages = Math.ceil(filteredUpdates.length / updatesItemsPerPage);

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
  const sectorVal = sector.value.toLowerCase();
  const typeVal = type.value.toLowerCase();

  filteredUpdates = allUpdates.filter(item => {
    const title = item.title?.toLowerCase() || "";
    const provider = item.provider?.toLowerCase() || "";
    const itemSector = item.sector?.toLowerCase() || "";
    const itemType = item.Type || item.type?.toLowerCase() || "";

    const matchesSearch =
      title.includes(searchVal) ||
      provider.includes(searchVal);

    const matchesSector =
  sectorVal === "all" ||
  itemSector === sectorVal ||
  itemSector.includes(sectorVal) ||
  sectorVal.includes(itemSector);

    const matchesType =
  typeVal === "all" ||
  itemType === typeVal ||
  itemType.includes(typeVal) ||
  typeVal.includes(itemType);

    return matchesSearch && matchesSector && matchesType;
  });

  updatesCurrentPage = 1;
  renderUpdates();
}

  search.addEventListener("input", apply);
  sector.addEventListener("change", apply);
  type.addEventListener("change", apply);
}