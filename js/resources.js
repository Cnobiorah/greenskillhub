// ===============================
// RESOURCES.JS (IMPROVED — SAFE)
// ===============================

let allResources = [];
let filteredResources = [];
let resourcesCurrentPage = 1;
const itemsPerPage = 6;


// -------------------------------
// INIT
// -------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  try {
    allResources = await getResources();
    filteredResources = [...allResources];

    setupFilters();
    renderResources();
  } catch (err) {
    console.error("Error loading resources:", err);
  }
});


// -------------------------------
// DOWNLOAD TRACKING (NEW)
// -------------------------------
async function incrementResourceDownload(id) {
  try {
    await supabaseClient.rpc("increment_resource_download", {
      resource_id: id
    });
  } catch (err) {
    console.error("Download tracking error:", err);
  }
}

function handleDownload(id, url) {
  incrementResourceDownload(id); // per resource

  incrementTotalDownloads();     // 🔥 ADD THIS

  setTimeout(() => {
    window.open(url, "_blank");
  }, 150);

  return false;
}


// -------------------------------
// RENDER
// -------------------------------
function renderResources() {
  const container = document.getElementById("resourceList");
  const pagination = document.getElementById("resourcePagination");

  if (!container) return;

  container.innerHTML = "";

  const start = (resourcesCurrentPage - 1) * itemsPerPage;
  const paginated = filteredResources.slice(start, start + itemsPerPage);

  if (!paginated.length) {
    container.innerHTML = `<p class="no-results">No resources found.</p>`;
    if (pagination) pagination.innerHTML = "";
    return;
  }

  paginated.forEach(item => {
    const card = document.createElement("div");
    card.className = "card resource-card";

    card.innerHTML = `
      <div class="update-header">
        <span class="badge">
          ${item.type || "Resource"}
        </span>
        <span class="update-category">
          ${item.category || "General"}
        </span>
      </div>

      <h3>${item.title}</h3>

      <p>${item.description || ""}</p>

      <p class="text-muted">
        ${item.downloads || 0} downloads
      </p>

      <a href="${item.file_url || "#"}"
         class="card-link"
         onclick="return handleDownload('${item.id}', '${item.file_url}')">
        Download →
      </a>
    `;

    container.appendChild(card);
  });

  renderPagination();
}


// -------------------------------
// PAGINATION (UNCHANGED)
// -------------------------------
function renderPagination() {
  const pagination = document.getElementById("resourcePagination");

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = `
    <div class="pagination-inner">
      <button ${resourcesCurrentPage === 1 ? "disabled" : ""} id="prevBtn">Prev</button>
      <span>Page ${resourcesCurrentPage} of ${totalPages}</span>
      <button ${resourcesCurrentPage === totalPages ? "disabled" : ""} id="nextBtn">Next</button>
    </div>
  `;

  document.getElementById("prevBtn").onclick = () => {
    if (resourcesCurrentPage > 1) {
      resourcesCurrentPage--;
      renderResources();
    }
  };

  document.getElementById("nextBtn").onclick = () => {
    if (resourcesCurrentPage < totalPages) {
      resourcesCurrentPage++;
      renderResources();
    }
  };
}


// -------------------------------
// FILTERS (UNCHANGED)
// -------------------------------
function setupFilters() {
  const searchInput = document.getElementById("resourceSearch");
  const categoryFilter = document.getElementById("resourceCategory");
  const typeFilter = document.getElementById("resourceAccess");

  function applyFilters() {
    const searchValue = searchInput.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    const typeValue = typeFilter.value;

    filteredResources = allResources.filter(item => {
      const title = (item.title || "").toLowerCase();
      const description = (item.description || "").toLowerCase();
      const category = (item.category || "").toLowerCase();
      const type = (item.type || "").toLowerCase();

      const matchesSearch =
        title.includes(searchValue) ||
        description.includes(searchValue);

      const matchesCategory =
        categoryValue === "all" ||
        category === categoryValue.toLowerCase();

      const matchesType =
        typeValue === "all" ||
        type === typeValue.toLowerCase();

      return matchesSearch && matchesCategory && matchesType;
    });

    resourcesCurrentPage = 1;
    renderResources();
  }

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
}