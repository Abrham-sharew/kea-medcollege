 const API_BASE_URL = "http://localhost:3002/api";
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token) window.location.href = "login.html";
    if (username) document.getElementById("adminName").innerHTML =' <i class="fas fa-user"></i>'+ username;

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // Load dashboard stats
    async function loadStats() {
  //render category
  const res = await fetch(`${API_BASE_URL}/categories`, { headers });
  const categories = await res.json();
  renderCategories(categories);
  categoriesID(categories);
  //render news
  const newsRes=await fetch(`${API_BASE_URL}/news`, { headers });
  const news = await newsRes.json();
  renderNews(news);
  document.getElementById("newsCount").textContent = news.length;
  //render comment
  const commentsRes=await fetch(`${API_BASE_URL}/feedback`, { headers });
  const comments = await commentsRes.json();
  renderComments(comments);
  document.getElementById("commentsCount").textContent = comments.length ;
  //render applicatin
  const appsRes=await fetch(`${API_BASE_URL}/apply`, { headers });
  const apps = await appsRes.json();
  renderApplications(apps);
  document.getElementById("applicationsCount").textContent = apps.length;
}

// Add event listener to load applications when the applications tab is shown
document.addEventListener('DOMContentLoaded', function() {
  const applicationsTab = document.getElementById('applications-tab');
  if (applicationsTab) {
    applicationsTab.addEventListener('shown.bs.tab', function (e) {
      // Reload applications when tab is shown
      loadApplications();
    });
  }
});

// Function to load applications specifically
async function loadApplications() {
  try {
    const appsRes = await fetch(`${API_BASE_URL}/apply`, { headers });
    const apps = await appsRes.json();
    renderApplications(apps);
    document.getElementById("applicationsCount").textContent = apps.length;
  } catch (error) {
    console.error("Error loading applications:", error);
    const list = document.getElementById("adminApplicationsList");
    if (list) {
      list.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading applications: ${error.message}</td></tr>`;
    }
  }
}

// Header carousel - initialize safely after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  try {
    if (typeof $ === 'function' && $('.header-carousel').length) {
      $('.header-carousel').owlCarousel({
        items: 1,
        loop: true,
        margin: 0,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: false,
        smartSpeed: 700,
        animateIn: 'slideInRight',
        animateOut: 'slideOutLeft'
      });
    }
  } catch (err) {
    console.error('Carousel init error:', err);
  }
});

    
    function renderComments(comments) {
      const list = document.getElementById("adminCommentsList");
      list.innerHTML = comments.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.message}</td>
          <td>${new Date(c.created_at).toLocaleDateString()}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteComment(${c.id})"><i class="fas fa-trash"></i></button></td>
        </tr>
      `).join("");
    }

    async function deleteComment(id) {
      if (!confirm("Delete this comment?")) return;
      const res=await fetch(`${API_BASE_URL}/feedback/${id}`, { method: "DELETE", headers });
       if(res.status==404){
        alert(data.message);
      }
      loadStats();
    }

    function renderApplications(apps) {
      const list = document.getElementById("adminApplicationsList");
      list.innerHTML = apps.map(a => `
        <tr>
          <td>${a.fullName}</td>
          <td>${a.email}</td>
          <td>${a.phone}</td>
          <td>${a.program}</td>
          <td>${new Date(a.created_at).toLocaleDateString()}</td>
        </tr>
      `).join("");
    }
// Load categories

 function categoriesID(categories){
   const list=document.getElementById("newsCategory");
   list.innerHTML=categories.map(i=>`<option value='${i.id}'>${i.name}</option>`).join("");
 }
 function renderCategories(categories) {
  const list = document.getElementById("adminCategoriesList");
  list.innerHTML = categories.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editCategory(${c.id}, '${c.name}')"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${c.id})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `).join("");

}

// Add category
async function addCategory() {
  const name = document.getElementById("categoryName").value.trim();
  if (!name) return alert("Category name is required");

  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (res.ok) {
    document.getElementById("addCategoryForm").reset();
    bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
    loadStats();
  } else {
    alert("Failed to add category");
  }
}

// Delete category
async function deleteCategory(id) {
  if (!confirm("Delete this category?")) return;
  const res=await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE", headers });
    if(res.status==404){
        alert(data.message);
      }
  loadStatss();
}

// Edit category (simple prompt example)
async function editCategory(id, currentName) {
  const newName = prompt("Edit category name:", currentName);
  if (!newName) return;
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ name: newName }),
  });
  if (!res.ok) {
    alert('Not updated');
  }
    loadStatss();
}// Function to render news list with multiple images
function renderNews(news) {
  const list = document.getElementById("adminNewsList");
  list.innerHTML = news.map(n => {
    // Get featured image or first image
    let imageHtml = 'No image';
    if (n.featured_image) {
      imageHtml = `<img src="../backend/uploads/${n.featured_image}" alt="News image" style="width: 50px; height: 50px; object-fit: cover;">`;
    } else if (n.images && n.images.length > 0) {
      imageHtml = `<img src="../backend/uploads/${n.images[0].image}" alt="News image" style="width: 50px; height: 50px; object-fit: cover;">`;
    }
    
    // Show image count badge
    const imageCount = n.image_count || (n.images ? n.images.length : 0);
    const imageCountBadge = imageCount > 0 ? 
      `<span class="badge bg-info ms-1">${imageCount}</span>` : '';
    
    return `
      <tr>
        <td>${n.title}</td>
        <td>${n.content.substring(0, 80)}...</td>
        <td>${new Date(n.created_at).toLocaleDateString()}</td>
        <td>
          ${imageHtml} ${imageCountBadge}
        </td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editNews(${n.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteNews(${n.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Preview multiple images before upload
document.getElementById('newsImageFiles').addEventListener('change', function(e) {
  const previewContainer = document.getElementById('previewContainer');
  const noImagesMessage = document.getElementById('noImagesMessage');
  
  // Clear previous previews
  previewContainer.innerHTML = '';
  
  const files = e.target.files;
  
  if (files.length > 0) {
    noImagesMessage.style.display = 'none';
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        alert(`File "${file.name}" is not an image. Please select only image files.`);
        continue;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 5MB limit.`);
        continue;
      }
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-6 col-md-4 col-lg-3';
        
        colDiv.innerHTML = `
          <div class="card position-relative">
            <img src="${e.target.result}" class="card-img-top preview-image" 
                 alt="Preview" style="height: 100px; object-fit: cover;">
            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                    onclick="removeImage(${i})" style="padding: 0.15rem 0.3rem; font-size: 0.75rem;">
              ×
            </button>
            <div class="card-body p-2">
              <small class="text-muted d-block text-truncate">${file.name}</small>
              <small class="text-muted">${(file.size / 1024).toFixed(1)} KB</small>
            </div>
          </div>
        `;
        
        previewContainer.appendChild(colDiv);
      };
      
      reader.readAsDataURL(file);
    }
  } else {
    noImagesMessage.style.display = 'block';
  }
});

// Remove individual image from selection
function removeImage(index) {
  const input = document.getElementById('newsImageFiles');
  const files = Array.from(input.files);
  
  // Remove file at index
  files.splice(index, 1);
  
  // Create new DataTransfer and add remaining files
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  
  // Update input files
  input.files = dataTransfer.files;
  
  // Trigger change event to refresh previews
  input.dispatchEvent(new Event('change'));
}

// Clear all images
function clearImageSelection() {
  const input = document.getElementById('newsImageFiles');
  input.value = ''; // Clear file input
  
  // Clear previews
  document.getElementById('previewContainer').innerHTML = '';
  document.getElementById('noImagesMessage').style.display = 'block';
}

// Add news with multiple images
async function addNews() {
  const title = document.getElementById("newsTitle").value.trim();
  const content = document.getElementById("newsContent").value.trim();
  const category_id = document.getElementById("newsCategory").value.trim();
  const fileInput = document.getElementById("newsImageFiles");
  const files = fileInput.files;
  
  if (!title || !content) {
    alert("Title & content required");
    return;
  }
  
  // Validate max files
  if (files.length > 10) {
    alert("Maximum 10 images allowed");
    return;
  }

  // Use FormData to handle file upload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("author", "Admin"); // Default author
  if (category_id) formData.append("category_id", category_id);
  
  // Append multiple images
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]); 
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`  // Include the authorization header
      },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add news");

    // Reset form
    document.getElementById("addNewsForm").reset();
    clearImageSelection();
    
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("addNewsModal"));
    modal.hide();
    
    // Refresh news list
    loadStats();
    
    // Also refresh news on homepage and news page
    refreshNewsOnPages();
    
    alert(`News added successfully with ${files.length} image${files.length !== 1 ? 's' : ''}!`);
  } catch (err) {
    alert(err.message);
  }
}

// Function to refresh news on homepage and news page
async function refreshNewsOnPages() {
  try {
    // Fetch latest news
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) return;
    
    const news = await response.json();
    
    // Store in localStorage for immediate access
    localStorage.setItem('latestNews', JSON.stringify(news));
    
    // Notify other pages through localStorage event
    localStorage.setItem('newsUpdated', Date.now().toString());
  } catch (error) {
    console.error('Error refreshing news:', error);
  }
}

// Edit news with multiple images
async function editNews(id) {
  try {
    // Fetch news details with images
    const res = await fetch(`${API_BASE_URL}/news/${id}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch news details");
    
    const news = await res.json();
    
    // Fetch categories for dropdown
    const catRes = await fetch(`${API_BASE_URL}/categories`, { headers });
    const categories = await catRes.json();

    // Build category options
    const categoryOptions = categories.map(
      c => `<option value="${c.id}" ${c.id == news.category_id ? "selected" : ""}>${c.name}</option>`
    ).join("");

    // Build existing images preview
    let existingImagesHtml = '';
    if (news.images && news.images.length > 0) {
      existingImagesHtml = `
        <div class="mb-3">
          <label class="form-label">Current Images</label>
          <div id="existingImages" class="row g-2">
            ${news.images.map((img, index) => `
              <div class="col-6 col-md-4 col-lg-3">
                <div class="card position-relative">
                  <img src="../backend/uploads/${img.image}" class="card-img-top" 
                       alt="Image ${index + 1}" style="height: 100px; object-fit: cover;">
                  <div class="card-body p-2">
                    <small class="text-muted d-block text-truncate">${img.original_name || img.image}</small>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" 
                             id="removeImage${img.id}" value="${img.id}">
                      <label class="form-check-label text-danger" for="removeImage${img.id}">
                        Remove
                      </label>
                    </div>
                    ${img.is_featured ? '<span class="badge bg-success">Featured</span>' : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>`;
    }

    // Modal content
    const editModal = document.getElementById("editmodal");
    editModal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit News Article</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="editNewsForm">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" id="UNTitle" value="${news.title.replace(/"/g, '&quot;')}" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea class="form-control" id="UNContent" rows="4" required>${news.content}</textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" id="UNCategory">
                  <option value="">-- Select Category --</option>
                  ${categoryOptions}
                </select>
              </div>
              
              ${existingImagesHtml}
              
              <div class="mb-3">
                <label class="form-label">Add More Images (optional)</label>
                <div class="input-group">
                  <input type="file" class="form-control" id="UNImageFiles" accept="image/*" multiple />
                  <button type="button" class="btn btn-outline-secondary" onclick="clearEditImageSelection()">
                    Clear
                  </button>
                </div>
                <div class="form-text">You can select multiple images (max 10 total)</div>
              </div>
              
              <div class="mb-3">
                <div id="editPreviewContainer" class="row g-2 mt-2">
                  <!-- New images preview will be dynamically added here -->
                </div>
                <div id="editNoImagesMessage" class="text-muted text-center py-3" style="display: none;">
                  No new images selected
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="updateNews(${id})">Update</button>
          </div>
        </div>
      </div>`;

    // Add event listener for image preview
    const imageInput = document.getElementById('UNImageFiles');
    imageInput.addEventListener('change', function(e) {
      const previewContainer = document.getElementById('editPreviewContainer');
      const noImagesMessage = document.getElementById('editNoImagesMessage');
      
      previewContainer.innerHTML = '';
      
      const files = e.target.files;
      
      if (files.length > 0) {
        noImagesMessage.style.display = 'none';
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          if (!file.type.match('image.*')) {
            alert(`File "${file.name}" is not an image.`);
            continue;
          }
          
          if (file.size > 5 * 1024 * 1024) {
            alert(`File "${file.name}" exceeds 5MB limit.`);
            continue;
          }
          
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const colDiv = document.createElement('div');
            colDiv.className = 'col-6 col-md-4 col-lg-3';
            
            colDiv.innerHTML = `
              <div class="card position-relative">
                <img src="${e.target.result}" class="card-img-top" 
                     alt="Preview" style="height: 100px; object-fit: cover;">
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                        onclick="removeEditImage(${i})" style="padding: 0.15rem 0.3rem; font-size: 0.75rem;">
                  ×
                </button>
                <div class="card-body p-2">
                  <small class="text-muted d-block text-truncate">${file.name}</small>
                  <small class="text-muted">${(file.size / 1024).toFixed(1)} KB</small>
                </div>
              </div>
            `;
            
            previewContainer.appendChild(colDiv);
          };
          
          reader.readAsDataURL(file);
        }
      } else {
        noImagesMessage.style.display = 'block';
      }
    });

    // Show modal
    const modal = new bootstrap.Modal(editModal);
    modal.show();
    
  } catch (error) {
    console.error("Error loading edit form:", error);
    alert("Failed to load news for editing");
  }
}

// Helper functions for edit modal
function removeEditImage(index) {
  const input = document.getElementById('UNImageFiles');
  const files = Array.from(input.files);
  files.splice(index, 1);
  
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event('change'));
}

function clearEditImageSelection() {
  const input = document.getElementById('UNImageFiles');
  input.value = '';
  document.getElementById('editPreviewContainer').innerHTML = '';
  document.getElementById('editNoImagesMessage').style.display = 'block';
}

// Update news with multiple images
async function updateNews(id) {
  const title = document.getElementById("UNTitle").value.trim();
  const content = document.getElementById("UNContent").value.trim();
  const category_id = document.getElementById("UNCategory").value.trim();
  const newFilesInput = document.getElementById("UNImageFiles");
  const newFiles = newFilesInput.files;
  
  if (!title || !content) {
    alert("Title & content required");
    return;
  }
  
  // Validate total images (existing + new)
  const existingImages = document.querySelectorAll('#existingImages .card');
  const totalImages = existingImages.length + newFiles.length;
  if (totalImages > 10) {
    alert("Maximum 10 images allowed in total");
    return;
  }

  // Use FormData to handle file upload
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (category_id) formData.append("category_id", category_id);
  
  // Get removed image IDs
  const removedImageIds = [];
  document.querySelectorAll('#existingImages input[type="checkbox"]:checked').forEach(checkbox => {
    removedImageIds.push(checkbox.value);
  });
  
  if (removedImageIds.length > 0) {
    formData.append("removed_image_ids", JSON.stringify(removedImageIds));
  }
  
  // Append new images
  for (let i = 0; i < newFiles.length; i++) {
    formData.append("images", newFiles[i]);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("News updated successfully!");
      bootstrap.Modal.getInstance(document.getElementById("editmodal")).hide();
      loadStats(); // reload admin dashboard
      
      // Also refresh news on homepage and news page
      refreshNewsOnPages();
    } else {
      throw new Error(data.message || "Failed to update news.");
    }
  } catch (error) {
    console.error("Error updating news:", error);
    alert(error.message);
  }
}

// Delete news
async function deleteNews(id) {
  if (!confirm("Delete this news article? This will also delete all associated images.")) return;
  
  try {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, { 
      method: "DELETE", 
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      alert(data.message || "News article deleted successfully!");
      loadStats(); // refresh admin dashboard
      
      // Also refresh news on homepage and news page
      refreshNewsOnPages();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete news article.");
    }
  } catch (error) {
    console.error("Error deleting news:", error);
    alert("An error occurred while deleting the news article.");
  }
}

// Initialize image preview functionality when modal is shown
document.getElementById('addNewsModal').addEventListener('shown.bs.modal', function () {
  // Reset image previews
  clearImageSelection();
});

// CSS for better image display
const style = document.createElement('style');
style.textContent = `
  .preview-image {
    max-width: 100%;
    height: auto;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .preview-image:hover {
    transform: scale(1.05);
  }
  
  .card {
    transition: box-shadow 0.2s;
  }
  
  .card:hover {
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
  }
  
  .btn-outline-danger {
    border-color: #dc3545;
    color: #dc3545;
  }
  
  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: white;
  }
  
  #previewContainer, #editPreviewContainer {
    min-height: 50px;
  }
`;
document.head.appendChild(style);

      async function register(event) {
      event.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim(); 
      const password = document.getElementById("password").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username,email, password })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registration successful!");
         bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide();
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred. Try again later.");
      }
      loadStats();
    }

    function logout() {
      localStorage.clear();
      window.location.href = "login.html";
    }
    
// ========================================
// IMPORTANT DATES MANAGEMENT FUNCTIONS
// ========================================

// Load and render important dates
async function loadImportantDates() {
  try {
    const res = await fetch(`${API_BASE_URL}/important-dates`, { headers });
    const dates = await res.json();
    renderImportantDates(dates);
  } catch (error) {
    console.error('Error loading important dates:', error);
  }
}

// Render important dates in admin table
function renderImportantDates(dates) {
  const list = document.getElementById("adminDatesList");
  if (!dates || dates.length === 0) {
    list.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No important dates found</td></tr>';
    return;
  }
  
  list.innerHTML = dates.map(d => {
    const formattedDate = new Date(d.event_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return `
      <tr>
        <td><span class="badge bg-primary">${d.intake_name}</span></td>
        <td>${d.event_name}</td>
        <td>${formattedDate}</td>
        <td>${d.description || '<em class="text-muted">No description</em>'}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editImportantDate(${d.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteImportantDate(${d.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Save new important date
async function saveImportantDate() {
  const intake_name = document.getElementById("intakeName").value.trim();
  const event_name = document.getElementById("eventName").value.trim();
  const event_date = document.getElementById("eventDate").value;
  const description = document.getElementById("eventDescription").value.trim();
  
  if (!intake_name || !event_name || !event_date) {
    return alert("Please fill in all required fields");
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}/important-dates`, {
      method: "POST",
      headers,
      body: JSON.stringify({ intake_name, event_name, event_date, description })
    });
    
    if (res.ok) {
      document.getElementById("addDateForm").reset();
      bootstrap.Modal.getInstance(document.getElementById("addDateModal")).hide();
      alert("Important date added successfully!");
      await loadImportantDates();
    } else {
      const error = await res.json();
      alert(error.message || "Failed to add important date");
    }
  } catch (error) {
    console.error('Error saving important date:', error);
    alert("Error saving important date");
  }
}

// Edit important date - load data into modal
async function editImportantDate(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/important-dates/${id}`, { headers });
    const date = await res.json();
    
    if (date) {
      document.getElementById("editDateId").value = date.id;
      document.getElementById("editIntakeName").value = date.intake_name;
      document.getElementById("editEventName").value = date.event_name;
      document.getElementById("editEventDate").value = date.event_date.split('T')[0]; // Format date
      document.getElementById("editEventDescription").value = date.description || '';
      
      const modal = new bootstrap.Modal(document.getElementById('editDateModal'));
      modal.show();
    }
  } catch (error) {
    console.error('Error loading date for edit:', error);
    alert("Error loading date information");
  }
}

// Update important date
async function updateImportantDate() {
  const id = document.getElementById("editDateId").value;
  const intake_name = document.getElementById("editIntakeName").value.trim();
  const event_name = document.getElementById("editEventName").value.trim();
  const event_date = document.getElementById("editEventDate").value;
  const description = document.getElementById("editEventDescription").value.trim();
  
  if (!intake_name || !event_name || !event_date) {
    return alert("Please fill in all required fields");
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}/important-dates/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ intake_name, event_name, event_date, description })
    });
    
    if (res.ok) {
      bootstrap.Modal.getInstance(document.getElementById("editDateModal")).hide();
      alert("Important date updated successfully!");
      await loadImportantDates();
    } else {
      const error = await res.json();
      alert(error.message || "Failed to update important date");
    }
  } catch (error) {
    console.error('Error updating important date:', error);
    alert("Error updating important date");
  }
}

// Delete important date
async function deleteImportantDate(id) {
  if (!confirm("Are you sure you want to delete this important date?")) return;
  
  try {
    const res = await fetch(`${API_BASE_URL}/important-dates/${id}`, {
      method: "DELETE",
      headers
    });
    
    if (res.ok) {
      alert("Important date deleted successfully!");
      await loadImportantDates();
    } else {
      const error = await res.json();
      alert(error.message || "Failed to delete important date");
    }
  } catch (error) {
    console.error('Error deleting important date:', error);
    alert("Error deleting important date");
  }
}

// Load important dates when the dates tab is shown
document.getElementById('dates-tab')?.addEventListener('shown.bs.tab', function () {
  loadImportantDates();
});

// ========================================

    loadStats();