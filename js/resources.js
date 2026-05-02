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

async function handleDownload(id, url) {
  try {
    const { error: err1 } = await supabaseClient.rpc("increment_resource_download", {
      resource_id: id
    });
    if (err1) console.error("Resource increment error:", err1);

    const { error: err2 } = await supabaseClient.rpc("increment_download");
    if (err2) console.error("Total download increment error:", err2);
  } catch (err) {
    console.error("Download tracking error:", err);
  }

  window.open(url, "_blank");
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

      <a href="#"
         class="card-link download-btn"
         data-id="${item.id}"
         data-url="${item.file_url || ''}">
        Download →
      </a>
    `;

    card.querySelector(".download-btn").addEventListener("click", async (e) => {
      e.preventDefault();
      const id = e.target.dataset.id;
      const url = e.target.dataset.url;

      try {
        const { error: err1 } = await supabaseClient.rpc("increment_resource_download", {
          resource_id: id
        });
        if (err1) console.error("Resource increment error:", err1);

        const { error: err2 } = await supabaseClient.rpc("increment_download");
        if (err2) console.error("Total increment error:", err2);
      } catch (err) {
        console.error("Download error:", err);
      }

      if (url) window.open(url, "_blank");
    });

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