document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggling
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      
      // Prevent body and html scroll when menu is open
      if (mainNav.classList.contains('active')) {
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
      }
    });
    
    // Close menu when link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
      });
    });
  }

  // 2. Lightbox implementation for Projects Page
  const projectCards = document.querySelectorAll('.project-card.lightbox-trigger');
  const lightbox = document.getElementById('lightbox');
  
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let visibleCards = [];
    let currentIdx = -1;
    
    const updateLightboxContent = (index) => {
      if (index < 0 || index >= visibleCards.length) return;
      currentIdx = index;
      
      const card = visibleCards[index];
      const imgUrl = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const categoryLabel = card.getAttribute('data-category-label') || card.getAttribute('data-category') || '';
      
      // Animation transition fade-out
      lightboxImg.classList.add('fade-out');
      
      setTimeout(() => {
        if (imgUrl) {
          lightboxImg.src = imgUrl;
          lightboxTitle.textContent = title || '';
          lightboxCategory.textContent = categoryLabel.replace('-', ' ').toUpperCase();
          // Remove fade-out to trigger fade-in animation
          lightboxImg.classList.remove('fade-out');
        }
      }, 150);
    };
    
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find currently visible (non-hidden) cards according to selected category filter
        visibleCards = Array.from(document.querySelectorAll('.project-card.lightbox-trigger')).filter(el => {
          return window.getComputedStyle(el).display !== 'none';
        });
        
        const idx = visibleCards.indexOf(card);
        if (idx !== -1) {
          updateLightboxContent(idx);
          lightbox.classList.add('active');
          document.body.classList.add('no-scroll');
          document.documentElement.classList.add('no-scroll');
        }
      });
    });
    
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
      lightboxImg.src = '';
    };
    
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIdx = currentIdx - 1;
        if (newIdx < 0) newIdx = visibleCards.length - 1;
        updateLightboxContent(newIdx);
      });
    }
    
    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        let newIdx = currentIdx + 1;
        if (newIdx >= visibleCards.length) newIdx = 0;
        updateLightboxContent(newIdx);
      });
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        let newIdx = currentIdx - 1;
        if (newIdx < 0) newIdx = visibleCards.length - 1;
        updateLightboxContent(newIdx);
      } else if (e.key === 'ArrowRight') {
        let newIdx = currentIdx + 1;
        if (newIdx >= visibleCards.length) newIdx = 0;
        updateLightboxContent(newIdx);
      }
    });
  }

  // 3. Category Filter buttons for Projects Page
  const filterButtons = document.querySelectorAll('.filter-btn');
  const itemsToFilter = document.querySelectorAll('.project-card.filterable');
  
  if (filterButtons.length > 0 && itemsToFilter.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        itemsToFilter.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 4. Testimonials Carousel
  const track = document.querySelector('.testimonial-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const nextButton = document.querySelector('.carousel-ctrl-next');
  const prevButton = document.querySelector('.carousel-ctrl-prev');
  const dotContainer = document.querySelector('.carousel-dots');
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    
    // Create navigation dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
      });
      dotContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotContainer.querySelectorAll('.carousel-dot'));
    
    const updateDots = (index) => {
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
    };
    
    const goToSlide = (index) => {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots(currentIndex);
    };
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }
    
    // Auto slide every 6 seconds
    let autoPlay = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
    
    // Pause autoplay on user interaction
    const resetAutoplay = () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 6000);
    };
    
    if (nextButton) nextButton.addEventListener('click', resetAutoplay);
    if (prevButton) prevButton.addEventListener('click', resetAutoplay);
    dots.forEach(dot => dot.addEventListener('click', resetAutoplay));
  }

  // 5. Scroll Reveal System using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 6. Header Scroll shrink and blur transition
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scroll');
      } else {
        header.classList.remove('scroll');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 7. Hero Banner Slider Automatic Cycle
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroDots = Array.from(document.querySelectorAll('.hero-dot'));
  
  if (heroSlides.length > 0) {
    let heroIndex = 0;
    let heroPlay;
    
    const showHeroSlide = (index) => {
      heroSlides.forEach(slide => slide.classList.remove('active'));
      heroDots.forEach(dot => dot.classList.remove('active'));
      
      heroSlides[index].classList.add('active');
      heroDots[index].classList.add('active');
      heroIndex = index;
    };
    
    const nextHeroSlide = () => {
      let nextIndex = heroIndex + 1;
      if (nextIndex >= heroSlides.length) nextIndex = 0;
      showHeroSlide(nextIndex);
    };
    
    // Auto-cycle slide every 5 seconds
    heroPlay = setInterval(nextHeroSlide, 5000);
    
    // Hook dots to manual clicks
    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(heroPlay);
        showHeroSlide(idx);
        heroPlay = setInterval(nextHeroSlide, 5000);
      });
    });
  }
});
