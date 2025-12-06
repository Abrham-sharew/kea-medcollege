const API_BASE_URL = "http://localhost:3002/api";
const headers = { "Content-Type": "application/json" };

// Load dashboard stats (news data)
async function loadStats() {
  try {
    // Fetch all news data (public endpoint)
    const response = await fetch(`${API_BASE_URL}/news`, { method: "GET", headers });

    if (!response.ok) {
      throw new Error(`Failed to load news: ${response.status} ${response.statusText}`);
    }

    const news = await response.json();

    // Render news to the dashboard
    renderNews(news);
  } catch (error) {
    console.error("Error loading stats:", error);
    const container = document.getElementById("newsPreview");
    if (container) {
      container.innerHTML = `<p class="text-center text-danger">Error loading news. Please try again later.</p>`;
    }
  }
}

// Render news cards
function renderNews(news) {
  const newsContainer = document.getElementById("newsPreview");
  if (!newsContainer) {
    console.warn("Element with id 'newsContainer' not found!");
    return;
  }

  // If no news available
  if (!news || news.length === 0) {
    newsContainer.innerHTML = '<p class="text-center text-muted">No news available at the moment.</p>';
    return;
  }

  // Create HTML for each news item
  const newsHTML = news
    .map(n => `
      <div class="col-md-4 mb-4">
        <div class="card news-card h-100 shadow-sm">
          ${n.featured_image ? `<img src="../backend/uploads/${n.featured_image}" class="card-img-top" alt="${n.title}">` : ""}
          <div class="card-body">
            <h5 class="card-title"><a class="card-title" onclick="showNewsDetail(${n.id})">${n.title || 'Untitled News'}</a></h5>
            <p class="card-text">${n.content ? n.content.substring(0, 150) + '...'+ "" : ""}</p>
            <small class="text-muted">
              ${n.created_at ? new Date(n.created_at).toLocaleDateString() : ""}
            </small>
          </div>
        </div>
      </div>
    `)
    .join("");

  newsContainer.innerHTML = newsHTML;
}
// Function to show news detail
function showNewsDetail(newsId) {
  // Redirect to news detail page with news ID as parameter
  window.location.href = `news-detail.html?id=${newsId}`;
}

// Load news when the page is ready
document.addEventListener("DOMContentLoaded", loadStats);
document.querySelector("#stats-selection")