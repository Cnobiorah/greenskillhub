// ===============================
// INDEX.JS (Homepage Logic)
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
  loadFeaturedArticles();
  loadUpdatesPreview();
  loadStats();
});


// -------------------------------
// FEATURED ARTICLES
// -------------------------------
async function loadFeaturedArticles() {
  const container = document.getElementById("featuredArticlesGrid");

  if (!container) return;

  const articles = await getFeaturedArticles(3);

  container.innerHTML = "";

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "card article-card";

    card.innerHTML = `
      <span class="card-tag">${article.category || "Article"}</span>
      <h3>${article.title}</h3>
      <p>${article.summary || ""}</p>
      <div class="card-meta">
        <span>${formatDate(article.created_at)}</span>
      </div>
      <a href="${article.link}" target="_blank" class="card-link">
        Read more →
      </a>
    `;

    container.appendChild(card);
  });
}


// -------------------------------
// UPDATES PREVIEW (2 items)
// -------------------------------
async function loadUpdatesPreview() {
  const container = document.getElementById("updatesPreviewGrid");

  if (!container) return;

  const updates = await getUpdates();

  const latest = updates.slice(0, 2);

  container.innerHTML = "";

  latest.forEach(item => {
    const card = document.createElement("div");
    card.className = "card update-card";

    card.innerHTML = `
      <div class="update-header">
        <span class="badge ${item.access === 'free' ? 'badge-free' : 'badge-paid'}">
          ${item.access || ''}
        </span>
        <span class="update-category">${item.sector || ''}</span>
      </div>

      <h3>${item.title}</h3>
      <p class="update-provider">${item.provider || ''}</p>

      <a href="${item.link}" target="_blank" class="card-link">
        View →
      </a>
    `;

    container.appendChild(card);
  });
}


// -------------------------------
// STATS
// -------------------------------
async function loadStats() {
  const stats = await getStats();

  if (!stats) return;

  const visitorEl = document.getElementById("visitorCount");
  const downloadEl = document.getElementById("downloadCount");
  const topResourceEl = document.getElementById("topResource");

  if (visitorEl) visitorEl.textContent = `${stats.visitors || 0}+`;
  if (downloadEl) downloadEl.textContent = `${stats.downloads || 0}+`;
  if (topResourceEl) topResourceEl.textContent = stats.top_resource || "N/A";
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