// Review Form Validation and Submission

document.addEventListener('DOMContentLoaded', function() {
  initReviewForm();
  initRatingSync();
});

/**
 * Initialize form validation and submission
 */
function initReviewForm() {
  const form = document.querySelector('.review-form');
  const usernameInput = document.getElementById('username');
  const artistInput = document.getElementById('artist');
  const songInput = document.getElementById('song');
  const bodyTextarea = document.getElementById('body');
  const scoreInput = document.getElementById('score');
  
  if (!form) return;
  
  // Real-time validation feedback
  usernameInput.addEventListener('blur', () => validateField(usernameInput, validateUsername));
  artistInput.addEventListener('blur', () => validateField(artistInput, validateArtist));
  songInput.addEventListener('blur', () => validateField(songInput, validateSong));
  bodyTextarea.addEventListener('input', () => validateField(bodyTextarea, validateBody));
  scoreInput.addEventListener('input', () => validateField(scoreInput, validateScore));
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isUsernameValid = validateField(usernameInput, validateUsername);
    const isArtistValid = validateField(artistInput, validateArtist);
    const isSongValid = validateField(songInput, validateSong);
    const isBodyValid = validateField(bodyTextarea, validateBody);
    const isScoreValid = validateField(scoreInput, validateScore);
    
    // If all valid, submit the review
    if (isUsernameValid && isArtistValid && isSongValid && isBodyValid && isScoreValid) {
      const reviewData = {
        username: usernameInput.value.trim(),
        artist: artistInput.value.trim(),
        song: songInput.value.trim(),
        body: bodyTextarea.value.trim(),
        score: parseFloat(scoreInput.value),
        timestamp: new Date().toISOString()
      };
      
      submitReview(reviewData);
      form.reset();
      // Clear any validation messages
      clearValidationMessages(form);
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.field.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
  
  console.log('Review form validation initialized');
}

/**
 * Validation functions
 */
function validateUsername(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Username is required' };
  }
  if (value.trim().length < 2) {
    return { valid: false, message: 'Username must be at least 2 characters' };
  }
  if (value.trim().length > 50) {
    return { valid: false, message: 'Username must be less than 50 characters' };
  }
  return { valid: true, message: '' };
}

function validateArtist(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Artist name is required' };
  }
  if (value.trim().length < 2) {
    return { valid: false, message: 'Artist name must be at least 2 characters' };
  }
  if (value.trim().length > 100) {
    return { valid: false, message: 'Artist name must be less than 100 characters' };
  }
  return { valid: true, message: '' };
}

function validateSong(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Song title is required' };
  }
  if (value.trim().length < 1) {
    return { valid: false, message: 'Song title is required' };
  }
  if (value.trim().length > 150) {
    return { valid: false, message: 'Song title must be less than 150 characters' };
  }
  return { valid: true, message: '' };
}

function validateBody(value) {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'Review text is required' };
  }
  if (value.trim().length < 40) {
    return { valid: false, message: `Review must be at least 40 characters (currently ${value.trim().length})` };
  }
  if (value.trim().length > 2000) {
    return { valid: false, message: 'Review must be less than 2000 characters' };
  }
  return { valid: true, message: '✓ Looks good!' };
}

function validateScore(value) {
  const score = parseFloat(value);
  
  if (!value || value === '') {
    return { valid: false, message: 'Score is required' };
  }
  if (isNaN(score)) {
    return { valid: false, message: 'Score must be a number' };
  }
  if (score < 0 || score > 10) {
    return { valid: false, message: 'Score must be between 0 and 10' };
  }
  // Check if it's a valid 0.5 increment
  if ((score * 2) % 1 !== 0) {
    return { valid: false, message: 'Score must be in 0.5 increments (e.g., 7.5, 8.0)' };
  }
  return { valid: true, message: '✓ Valid score' };
}

/**
 * Validate a field and show error/success message
 */
function validateField(input, validationFn) {
  const fieldDiv = input.closest('.field');
  const value = input.value;
  const result = validationFn(value);
  
  // Remove existing error message
  const existingError = fieldDiv.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Remove existing classes
  fieldDiv.classList.remove('error', 'success');
  input.classList.remove('error', 'success');
  
  if (!result.valid) {
    // Add error styling
    fieldDiv.classList.add('error');
    input.classList.add('error');
    
    // Create error message
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error-message';
    errorMsg.textContent = result.message;
    errorMsg.style.color = '#ff4444';
    errorMsg.style.fontSize = '.9rem';
    errorMsg.style.marginTop = '4px';
    
    // Insert after input
    input.parentNode.insertBefore(errorMsg, input.nextSibling);
    
    return false;
  } else {
    // Add success styling (optional)
    if (value.trim().length > 0) {
      fieldDiv.classList.add('success');
      input.classList.add('success');
      
      if (result.message) {
        const successMsg = document.createElement('p');
        successMsg.className = 'error-message success-message';
        successMsg.textContent = result.message;
        successMsg.style.color = '#44ff44';
        successMsg.style.fontSize = '.9rem';
        successMsg.style.marginTop = '4px';
        input.parentNode.insertBefore(successMsg, input.nextSibling);
      }
    }
    return true;
  }
}

/**
 * Clear all validation messages
 */
function clearValidationMessages(form) {
  const errorMessages = form.querySelectorAll('.error-message, .success-message');
  errorMessages.forEach(msg => msg.remove());
  
  const fields = form.querySelectorAll('.field, input, textarea');
  fields.forEach(field => {
    field.classList.remove('error', 'success');
  });
}

/**
 * Submit review and display it
 */
function submitReview(data) {
  console.log('Submitting review:', data);
  
  // Store in localStorage
  const reviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
  reviews.unshift(data); // Add to beginning
  localStorage.setItem('userReviews', JSON.stringify(reviews));
  
  // Show success message briefly
  showSuccessMessage(data);
  
  // Redirect to song page after 2 seconds
  setTimeout(() => {
    window.location.href = 'song_page.html';
  }, 2000);
}

/**
 * Show success notification
 */
function showSuccessMessage(data) {
  const container = document.querySelector('.container');
  const successDiv = document.createElement('div');
  successDiv.className = 'success-notification';
  successDiv.innerHTML = `
    <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color:#fff; padding:20px; border-radius:12px; 
                margin:20px 0; box-shadow:0 8px 24px rgba(0,0,0,.3);
                animation:slideIn .3s ease;">
      <h3 style="margin:0 0 8px; font-size:1.3rem;">✓ Review Published!</h3>
      <p style="margin:0; opacity:.9;">
        <strong>${data.username}</strong> reviewed <strong>${data.song}</strong> by <strong>${data.artist}</strong> 
        (${data.score}/10)
      </p>
      <p style="margin:8px 0 0; font-size:.9rem; opacity:.8;">
        Redirecting to song page...
      </p>
    </div>
  `;
  
  container.insertBefore(successDiv, container.firstChild);
}

/**
 * Display review on the page
 */
function displayReview(data) {
  const container = document.querySelector('.container');
  
  // Create reviews section if it doesn't exist
  let reviewsSection = document.getElementById('submitted-reviews');
  if (!reviewsSection) {
    reviewsSection = document.createElement('section');
    reviewsSection.id = 'submitted-reviews';
    reviewsSection.style.marginTop = '40px';
    reviewsSection.innerHTML = '<h2 style="margin-bottom:20px;">Recent Reviews</h2>';
    container.appendChild(reviewsSection);
  }
  
  // Create review card
  const reviewCard = document.createElement('article');
  reviewCard.className = 'submitted-review-card';
  reviewCard.innerHTML = `
    <div style="background:rgba(255,255,255,.06); border:1px solid var(--border); 
                border-radius:12px; padding:20px; margin-bottom:16px;
                box-shadow:0 4px 12px rgba(0,0,0,.2);">
      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:12px;">
        <div>
          <h3 style="margin:0 0 4px; font-size:1.2rem;">${escapeHtml(data.song)}</h3>
          <p style="margin:0; color:var(--muted); font-size:.95rem;">by ${escapeHtml(data.artist)}</p>
        </div>
        <div style="display:flex; align-items:center; gap:8px; font-size:1.8rem; font-weight:700;">
          ${data.score}
          <svg style="width:36px; height:36px;" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.7 5.7 20.8l1.7-6.9L2 9.2l7.1-.6z"/>
          </svg>
        </div>
      </div>
      <p style="margin:12px 0 8px; line-height:1.6;">${escapeHtml(data.body)}</p>
      <p style="margin:0; color:var(--muted); font-size:.85rem;">
        Posted ${formatTimeAgo(data.timestamp)}
      </p>
    </div>
  `;
  
  // Insert at the beginning of reviews section
  reviewsSection.appendChild(reviewCard);
}

/**
 * Sync score input with range slider
 */
function initRatingSync() {
  const scoreInput = document.getElementById('score');
  const rangeInput = document.getElementById('adjust');
  const scoreBig = document.querySelector('.score-big');
  
  if (!scoreInput || !rangeInput) return;
  
  // Update range when score input changes
  scoreInput.addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      rangeInput.value = value;
      updateScoreDisplay(value);
    }
  });
  
  // Update score input when range changes
  rangeInput.addEventListener('input', function() {
    scoreInput.value = this.value;
    updateScoreDisplay(this.value);
  });
  
  // Update display
  function updateScoreDisplay(value) {
    if (scoreBig) {
      const displayValue = parseFloat(value).toFixed(1);
      // Find or create the display element
      let display = scoreBig.querySelector('.score-display');
      if (!display) {
        display = document.createElement('div');
        display.className = 'score-display';
        display.style.fontSize = '3rem';
        display.style.fontWeight = '700';
        display.style.marginBottom = '8px';
        scoreBig.insertBefore(display, scoreBig.firstChild);
      }
      display.textContent = displayValue;
    }
  }
  
  // Initialize display
  updateScoreDisplay(rangeInput.value);
}

/**
 * Utility functions
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .field.error input,
  .field.error textarea {
    border-color: #ff4444 !important;
    box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1) !important;
  }
  
  .field.success input,
  .field.success textarea {
    border-color: #44ff44 !important;
    box-shadow: 0 0 0 3px rgba(68, 255, 68, 0.1) !important;
  }
`;
document.head.appendChild(style);
