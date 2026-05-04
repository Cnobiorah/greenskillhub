// ===============================
// INDEX.JS (FINAL)
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  await incrementVisitors();
  await loadFeaturedArticles();
  await loadUpdatesPreview();
  await loadTopResources();
  await loadStats();
});


// -------------------------------
// FEATURED ARTICLES
// -------------------------------
async function loadFeaturedArticles() {
  const container = document.getElementById("featuredArticlesGrid");
  if (!container) return;

  const articles = await getFeaturedArticles(3);
  container.innerHTML = "";

  if (!articles || articles.length === 0) {
    container.innerHTML = `<p>No articles available.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card article-card";
    card.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.summary || article.content || ""}</p>
      ${article.link
        ? `<a href="${article.link}" target="_blank" class="card-link">Read more →</a>`
        : `<span class="card-link">Coming soon</span>`
      }
    `;
    container.appendChild(card);
  });
}


// -------------------------------
// UPDATES PREVIEW
// -------------------------------
async function loadUpdatesPreview() {
  const container = document.getElementById("updatesPreviewGrid");
  if (!container) return;

  const updates = await getUpdates();
  const latest = updates.slice(0, 3);
  container.innerHTML = "";

  latest.forEach(item => {
    const card = document.createElement("div");
    card.className = "card update-card";
    card.innerHTML = `
      <div class="update-header">
        <span class="badge ${item.access?.toLowerCase().includes("free") ? "badge-free" : "badge-paid"}">
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
      <a href="${item.link || "#"}" target="_blank" class="card-link">View →</a>
    `;
    container.appendChild(card);
  });
}


// -------------------------------
// TOP RESOURCES
// -------------------------------
async function loadTopResources() {
  const container = document.getElementById("topResourcesGrid");
  if (!container) return;

  const resources = await getTopResources(3);
  container.innerHTML = "";

  if (!resources || resources.length === 0) {
    container.innerHTML = `<p>No resources yet.</p>`;
    return;
  }

  resources.forEach(item => {
    const card = document.createElement("div");
    card.className = "card resource-card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description || ""}</p>
      <p class="text-muted">${item.downloads || 0} downloads</p>
      <a href="#"
         class="card-link download-btn"
         data-id="${item.id}"
         data-url="${item.file_url || ''}">
        Download →
      </a>
    `;
    container.appendChild(card);
  });

  container.addEventListener("click", async (e) => {
    const btn = e.target.closest(".download-btn");
    if (!btn) return;
    e.preventDefault();

    const id = btn.dataset.id;
    const url = btn.dataset.url;

    try {
      await supabaseClient.rpc("increment_resource_download", { resource_id: id });
      await supabaseClient.rpc("increment_download");
    } catch (err) {
      console.error("Download error:", err);
    }

    if (url) window.open(url, "_blank");
  });
}


// -------------------------------
// STATS
// -------------------------------
async function loadStats() {
  const stats = await getStats();
  if (!stats) return;

  document.getElementById("visitorCount").textContent = `${stats.visitors || 0}+`;
  document.getElementById("downloadCount").textContent = `${stats.downloads || 0}+`;
  document.getElementById("topResource").textContent = stats.top_resource || "N/A";
}


// -------------------------------
// DATE FORMAT
// -------------------------------
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}