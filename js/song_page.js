// Song Page - Display User Reviews

document.addEventListener('DOMContentLoaded', function() {
  loadUserReviews();
});

/**
 * Load and display user-submitted reviews from localStorage
 */
function loadUserReviews() {
  const reviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
  
  if (reviews.length === 0) {
    console.log('No user reviews to display');
    return;
  }
  
  const feed = document.querySelector('.feed');
  if (!feed) {
    console.warn('Feed container not found');
    return;
  }
  
  console.log(`Loading ${reviews.length} user review(s)`);
  
  // Insert user reviews at the top of the feed
  reviews.forEach((review, index) => {
    const reviewCard = createReviewCard(review, index === 0);
    
    // Insert before the first existing feed-card
    const firstCard = feed.querySelector('.feed-card');
    if (firstCard) {
      feed.insertBefore(reviewCard, firstCard);
    } else {
      feed.appendChild(reviewCard);
    }
  });
}

/**
 * Create a review card element (styled like home page reviews)
 */
function createReviewCard(review, isNewest) {
  const card = document.createElement('article');
  card.className = 'feed-card user-review';
  
  // Truncate review text for preview
  const truncatedBody = review.body.length > 60 
    ? review.body.substring(0, 60) + '...' 
    : review.body;
  
  card.innerHTML = `
    <div class="avatar" role="img" aria-label="User avatar" style="background-image:url('images/pfp.jpg'); background-size:cover; background-position:center;"></div>
    <div>
      <p class="bold">${escapeHtml(review.username)}</p>
      <p class="muted">${escapeHtml(truncatedBody)}</p>
      <button class="btn view-full-review" type="button" data-review-index="${getReviewIndex(review)}">Read More</button>
    </div>
    <div class="vote-col">
      <span>0 👍</span>
      <span>0 👎</span>
    </div>
  `;
  
  // Add click handler for "Read Full Review" button
  const readButton = card.querySelector('.view-full-review');
  readButton.addEventListener('click', function(e) {
    e.preventDefault();
    showFullReview(review);
  });
  
  return card;
}

/**
 * Show full review in a modal/expanded view
 */
function showFullReview(review) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'review-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
    z-index: 1000; display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.2s ease;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: var(--card, #1a0933); border: 1px solid var(--border);
    border-radius: 16px; padding: 32px; max-width: 700px; width: 100%;
    max-height: 80vh; overflow-y: auto; position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.3s ease;
  `;
  
  modalContent.innerHTML = `
    <button class="close-modal" style="position:absolute; top:16px; right:16px; background:rgba(255,255,255,.1); border:1px solid var(--border); border-radius:8px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.5rem; color:#fff;" aria-label="Close">&times;</button>
    
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
      <img src="images/pfp.jpg" alt="${escapeHtml(review.username)}" style="width:64px; height:64px; border-radius:50%; border:2px solid var(--border); object-fit:cover;">
      <div>
        <h2 style="margin:0 0 4px; font-size:1.8rem;">${escapeHtml(review.username)}</h2>
        <p style="margin:0; color:var(--muted); font-size:1rem;">reviewed ${escapeHtml(review.song)} by ${escapeHtml(review.artist)}</p>
      </div>
    </div>
    
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; padding:16px; background:rgba(255,255,255,.06); border-radius:12px;">
      <svg style="width:48px; height:48px; color:var(--accent, #8b5cf6);" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.7 5.7 20.8l1.7-6.9L2 9.2l7.1-.6z"/>
      </svg>
      <div>
        <div style="font-size:2.5rem; font-weight:800; line-height:1;">${review.score}</div>
        <div style="color:var(--muted); font-size:.9rem;">out of 10</div>
      </div>
    </div>
    
    <div style="margin-bottom:20px;">
      <h3 style="margin:0 0 12px; font-size:1.2rem;">Review</h3>
      <p style="line-height:1.7; color:rgba(255,255,255,.9);">${escapeHtml(review.body)}</p>
    </div>
    
    <div style="padding-top:16px; border-top:1px solid var(--border); color:var(--muted); font-size:.9rem;">
      Posted ${formatTimeAgo(review.timestamp)}
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Close modal handlers
  const closeButton = modalContent.querySelector('.close-modal');
  closeButton.addEventListener('click', closeModal);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
  
  function closeModal() {
    modal.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 200);
  }
}

/**
 * Utility functions
 */
function getReviewIndex(review) {
  const reviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
  return reviews.findIndex(r => r.timestamp === review.timestamp);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) === 1 ? '' : 's'} ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) === 1 ? '' : 's'} ago`;
  return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) === 1 ? '' : 's'} ago`;
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .user-review .thumb img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
document.head.appendChild(style);
