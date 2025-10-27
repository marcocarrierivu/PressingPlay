// PressingPlay - Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('PressingPlay loaded!');
  
  // Initialize features
  initAlbumScroll();
  initReviewCards();
  initReviewTabs();
  initSearch();
});

/**
 * Album carousel scroll functionality
 */
function initAlbumScroll() {
  const albumsContainer = document.querySelector('.albums');
  const arrows = document.querySelector('.row-arrows');
  
  if (!albumsContainer || !arrows) {
    console.warn('Album container or arrows not found');
    return;
  }
  
  // Make arrows clickable
  arrows.style.cursor = 'pointer';
  arrows.style.userSelect = 'none';
  arrows.setAttribute('role', 'button');
  arrows.setAttribute('tabindex', '0');
  arrows.setAttribute('aria-label', 'Scroll albums left or right');
  
  console.log('Album scroll initialized');
  
  arrows.addEventListener('click', function(e) {
    const scrollAmount = 344; // album width (320px) + gap (24px)
    
    // Get the actual arrows element (in case we clicked on it)
    const arrowsRect = arrows.getBoundingClientRect();
    const clickX = e.clientX - arrowsRect.left;
    const halfWidth = arrowsRect.width / 2;
    
    console.log(`Click position: ${clickX}px, Half width: ${halfWidth}px`);
    
    // If clicked on left half (left arrow), scroll left; otherwise scroll right
    if (clickX < halfWidth) {
      console.log('Scrolling left');
      albumsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      console.log('Scrolling right');
      albumsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    
    // Log current scroll position
    setTimeout(() => {
      console.log(`Current scroll: ${albumsContainer.scrollLeft}px of ${albumsContainer.scrollWidth - albumsContainer.clientWidth}px`);
    }, 100);
  });
  
  // Keyboard support
  arrows.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      albumsContainer.scrollBy({ left: -344, behavior: 'smooth' });
      console.log('Keyboard: scrolling left');
    } else if (e.key === 'ArrowRight') {
      albumsContainer.scrollBy({ left: 344, behavior: 'smooth' });
      console.log('Keyboard: scrolling right');
    }
  });
  
  // Log if there's anything to scroll
  const canScroll = albumsContainer.scrollWidth > albumsContainer.clientWidth;
  console.log(`Can scroll: ${canScroll} (scroll width: ${albumsContainer.scrollWidth}px, client width: ${albumsContainer.clientWidth}px)`);
}

/**
 * Review card interactions
 */
function initReviewCards() {
  const readMoreButtons = document.querySelectorAll('.review-card .btn');
  
  readMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get the review title
      const card = this.closest('.review-card');
      const title = card.querySelector('.title').textContent;
      
      // For now, just log - in a real app this would open a modal or navigate
      console.log(`Reading review: ${title}`);
      
      // Optional: Add visual feedback
      this.textContent = 'Opening...';
      setTimeout(() => {
        this.textContent = 'Read More';
      }, 500);
    });
  });
}

/**
 * Review filter tabs functionality
 */
function initReviewTabs() {
  const tabs = document.querySelectorAll('.pill-tabs a');
  const reviewCards = document.querySelectorAll('.review-card');
  
  if (!tabs.length || !reviewCards.length) {
    console.warn('Review tabs or cards not found');
    return;
  }
  
  // Sample review data organized by category
  const reviewData = {
    'Top Rated': [
      {
        img: 'images/Lauryn-Hill.webp',
        title: 'Best Female Artist.',
        excerpt: 'I loved every song especially…',
        author: '@TheBurntChip',
        score: '9.5',
        likes: '3.7k',
        comments: '97'
      },
      {
        img: 'images/Little-Simz.webp',
        title: 'Deep.',
        excerpt: 'Wow, life changing…',
        author: '@dybala21',
        score: '8.0',
        likes: '4.1k',
        comments: '155'
      },
      {
        img: 'images/Lupe-Fiasco-Samurai.webp',
        title: 'A cutting-edge track',
        excerpt: 'Lupe Fiasco proves yet again why he…',
        author: '@carrieri',
        score: '4.5',
        likes: '4.6k',
        comments: '367'
      }
    ],
    'Recent': [
      {
        img: 'images/Lupe-Fiasco-Samurai.webp',
        title: 'Fresh Perspective',
        excerpt: 'Just dropped and already loving it…',
        author: '@earlylistener',
        score: '8.5',
        likes: '2.1k',
        comments: '87'
      },
      {
        img: 'images/Little-Simz.webp',
        title: 'First Impressions',
        excerpt: 'Need more listens but promising…',
        author: '@newmusicfan',
        score: '7.8',
        likes: '1.8k',
        comments: '64'
      },
      {
        img: 'images/Lauryn-Hill.webp',
        title: 'Hot Take',
        excerpt: 'Different from their usual sound…',
        author: '@trendwatcher',
        score: '8.0',
        likes: '3.2k',
        comments: '156'
      }
    ],
    'Popular Today': [
      {
        img: 'images/Lupe-Fiasco-Samurai.webp',
        title: 'Everyone\'s Talking About This',
        excerpt: 'Viral for all the right reasons…',
        author: '@trending',
        score: '8.7',
        likes: '12.4k',
        comments: '892'
      },
      {
        img: 'images/Little-Simz.webp',
        title: 'Can\'t Stop Playing',
        excerpt: 'This is on repeat all day…',
        author: '@addicted',
        score: '9.0',
        likes: '9.7k',
        comments: '567'
      },
      {
        img: 'images/Lauryn-Hill.webp',
        title: 'Chart Topper',
        excerpt: 'Deserves all the attention…',
        author: '@chartwatch',
        score: '8.8',
        likes: '11.2k',
        comments: '734'
      }
    ],
    'Popular This Week': [
      {
        img: 'images/Little-Simz.webp',
        title: 'Week\'s Best',
        excerpt: 'Consistently great throughout…',
        author: '@weeklydigest',
        score: '9.1',
        likes: '15.3k',
        comments: '1.2k'
      },
      {
        img: 'images/Lupe-Fiasco-Samurai.webp',
        title: 'Rising Star',
        excerpt: 'This artist is going places…',
        author: '@talentscout',
        score: '8.6',
        likes: '10.8k',
        comments: '678'
      },
      {
        img: 'images/Lauryn-Hill.webp',
        title: 'Underrated Gem',
        excerpt: 'More people need to hear this…',
        author: '@hiddengem',
        score: '8.9',
        likes: '7.9k',
        comments: '445'
      }
    ],
    'Controversial': [
      {
        img: 'images/Lupe-Fiasco-Samurai.webp',
        title: 'Divisive',
        excerpt: 'Love it or hate it, no in between…',
        author: '@polarizing',
        score: '6.5',
        likes: '4.2k',
        comments: '1.8k'
      },
      {
        img: 'images/Little-Simz.webp',
        title: 'Not What I Expected',
        excerpt: 'Disappointed by the direction…',
        author: '@longtime_fan',
        score: '4.0',
        likes: '2.8k',
        comments: '2.3k'
      },
      {
        img: 'images/Lauryn-Hill.webp',
        title: 'Overproduced',
        excerpt: 'Lost the raw energy of early work…',
        author: '@purist',
        score: '5.5',
        likes: '3.5k',
        comments: '1.9k'
      }
    ]
  };
  
  // Function to render reviews
  function renderReviews(category) {
    const reviewsSection = document.querySelector('.reviews');
    const existingCards = reviewsSection.querySelectorAll('.review-card');
    
    // Remove existing cards
    existingCards.forEach(card => card.remove());
    
    // Get reviews for this category
    const reviews = reviewData[category] || reviewData['Recent'];
    
    // Create and append new cards
    reviews.forEach(review => {
      const card = document.createElement('article');
      card.className = 'review-card';
      card.innerHTML = `
        <a class="thumb" href="song_page.html" aria-label="Open song page">
          <img src="${review.img}" alt="">
        </a>
        <div class="body">
          <h3 class="title">${review.title}</h3>
          <p class="by">${review.excerpt} • <span class="muted">${review.author}</span></p>
          <div class="row">
            <button class="btn" type="button">Read More</button>
            <span class="muted">${review.likes}</span>
            <span class="muted">${review.comments}</span>
          </div>
        </div>
        <div class="score">
          ${review.score}
          <svg class="big-star" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.7 5.7 20.8l1.7-6.9L2 9.2l7.1-.6z"/></svg>
        </div>
      `;
      reviewsSection.appendChild(card);
    });
    
    // Reinitialize read more buttons for new cards
    initReviewCards();
    
    console.log(`Showing ${category} reviews`);
  }
  
  // Add click handlers to tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('is-active'));
      
      // Add active class to clicked tab
      this.classList.add('is-active');
      
      // Get category and render reviews
      const category = this.textContent.trim();
      renderReviews(category);
    });
  });
  
  console.log('Review tabs initialized');
}

/**
 * Search functionality
 */
function initSearch() {
  const searchInput = document.getElementById('site-search');
  const searchForm = document.querySelector('.search');
  
  if (!searchInput || !searchForm) return;
  
  // Prevent actual form submission for demo purposes
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (query) {
      console.log(`Searching for: ${query}`);
      // In a real app, this would navigate to search results
      alert(`Searching for: "${query}"\n\n(This is a demo - search functionality would be implemented with a backend)`);
    }
  });
  
  // Optional: Add search suggestions as user types
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    if (query.length >= 2) {
      // In a real app, this would show autocomplete suggestions
      console.log(`Autocomplete query: ${query}`);
    }
  });
}
