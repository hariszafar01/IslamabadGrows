/* ============================================
       MOBILE NAVIGATION TOGGLE
       ============================================ */
(function () {
  const navToggle = document.querySelector('.nav__toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const body = document.body;

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav--open');
      this.setAttribute('aria-expanded', isOpen);

      // Prevent body scroll when menu is open
      body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  // Close menu when clicking nav links
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('nav--open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove('nav--open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
      body.style.overflow = '';
    }
  });
})();

/* ============================================
       SMOOTH SCROLL WITH HEADER OFFSET
       ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Skip if href is just "#"
    if (href === '#' || href === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  });
});

/* ============================================
       HEADER SCROLL EFFECTS
       ============================================ */
(function () {
  const header = document.querySelector('.header');
  let lastScrollY = window.pageYOffset;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.pageYOffset;

    // Add shadow when scrolled past threshold
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  // Use requestAnimationFrame for better performance
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
})();

/* ============================================
       INTERSECTION OBSERVER FOR ANIMATIONS
       ============================================ */
(function () {
  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    return; // Graceful degradation for older browsers
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements when DOM is ready
  const animatedElements = document.querySelectorAll(
    '.plant-card, .care-item, .season-card'
  );

  animatedElements.forEach(function (element) {
    element.style.animationPlayState = 'paused';
    observer.observe(element);
  });
})();

/* ============================================
       PLANT FILTER FUNCTIONALITY
       ============================================ */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const plantCards = document.querySelectorAll('.plant-card');

  // Store active filters for each group
  let activeFilters = {
    type: 'all',
    difficulty: 'all',
  };

  // Function to filter plants based on active criteria
  function filterPlants() {
    let visibleCount = 0;

    plantCards.forEach(function (card) {
      const cardType = card.getAttribute('data-type');
      const cardDifficulty = card.getAttribute('data-difficulty');

      // Check if card matches active filters
      const typeMatch =
        activeFilters.type === 'all' || cardType === activeFilters.type;
      const difficultyMatch =
        activeFilters.difficulty === 'all' ||
        cardDifficulty === activeFilters.difficulty;

      // Show card if both filters match
      if (typeMatch && difficultyMatch) {
        card.style.display = '';
        // Add staggered fade-in animation
        card.style.animation = 'none';
        // Force reflow to restart animation
        void card.offsetWidth;
        card.style.animation = `fadeInUp 0.5s ease forwards ${
          visibleCount * 0.1
        }s`;
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show "no results" message if needed
    showNoResultsMessage(visibleCount === 0);
  }

  // Function to show/hide no results message
  function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');

    if (show && !noResultsMsg) {
      // Create message if it doesn't exist
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results-message';
      noResultsMsg.innerHTML = `
        <div class="no-results-content">
          <span class="no-results-icon">🌱</span>
          <h3>No plants found</h3>
          <p>Try adjusting your filters to see more results</p>
        </div>
      `;

      const plantGrid = document.querySelector('.plant-grid');
      plantGrid.parentElement.insertBefore(noResultsMsg, plantGrid.nextSibling);
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // Add click handlers to filter buttons
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filterValue = this.getAttribute('data-filter');
      const filterGroup = this.closest('.filter-bar__group');
      const groupButtons = filterGroup.querySelectorAll('.filter-btn');

      // Determine which filter group this button belongs to
      const isTypeFilter = filterGroup
        .querySelector('.filter-bar__label')
        .textContent.includes('Type');

      // Remove active class from all buttons in this group
      groupButtons.forEach(function (sibling) {
        sibling.classList.remove('filter-btn--active');
      });

      // Add active class to clicked button
      this.classList.add('filter-btn--active');

      // Update active filters
      if (isTypeFilter) {
        activeFilters.type = filterValue;
      } else {
        activeFilters.difficulty = filterValue;
      }

      // Apply filters
      filterPlants();
    });
  });

  // Initialize "All" filters as active
  const typeAllBtn = document.querySelector(
    '.filter-bar__group:first-child .filter-btn[data-filter="all"]'
  );
  if (typeAllBtn) {
    typeAllBtn.classList.add('filter-btn--active');
  }
})();

/* ============================================
       FADE-IN ANIMATION FOR FILTERED CARDS
       ============================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
