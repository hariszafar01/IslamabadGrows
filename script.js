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
