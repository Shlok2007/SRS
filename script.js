/*
 * Global JavaScript for the Shriniwasa Roadways website.
 *
 * This script adds interactive behaviour across the site including:
 *  - Initialising the AOS (Animate On Scroll) library
 *  - Handling the mobile navigation toggle
 *  - Persisting and toggling dark mode
 *  - Animating numeric counters when they enter the viewport
 *  - Cycling through testimonial slides
 *  - Displaying the shipment tracking modal
 */

document.addEventListener('DOMContentLoaded', () => {
  /* Initialise AOS library for scroll animations. */
  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 800,
      easing: 'ease-out-cubic'
    });
  }

  /* Mobile menu toggle */
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('nav ul');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
    // Close menu when clicking a link (use event delegation)
    navList.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'a') {
        navList.classList.remove('open');
      }
    });
  }

  /* Dark mode toggle and persistence */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const storedTheme = localStorage.getItem('shr_theme');
  if (storedTheme === 'dark') {
    body.classList.add('dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark');
      localStorage.setItem('shr_theme', body.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  /* Counter animation using IntersectionObserver */
  const counters = document.querySelectorAll('.counter h3');
  const options = {
    threshold: 0.5
  };
  const animateCounter = (entry) => {
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'), 10);
    const speed = 2000; // duration in ms
    let start = 0;
    const step = () => {
      const increment = Math.ceil(target / (speed / 16));
      start += increment;
      if (start < target) {
        el.textContent = start.toLocaleString();
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
    observer.unobserve(el);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry);
      }
    });
  }, options);
  counters.forEach((c) => observer.observe(c));

  /* Testimonials slider */
  const slider = document.querySelector('.testimonials ul');
  const dotsContainer = document.querySelector('.slider-controls');
  if (slider && dotsContainer) {
    const slides = slider.children;
    let currentIndex = 0;
    const updateSlider = (index) => {
      slider.style.transform = `translateX(-${index * 100}%)`;
      // update dots
      dotsContainer.querySelectorAll('button').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
      });
    };
    // create dots
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider(currentIndex);
      });
      dotsContainer.appendChild(dot);
    }
    // auto slide every 8 seconds
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider(currentIndex);
    }, 8000);
  }

  /* Track shipment modal */
  const modal = document.getElementById('track-modal');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const trackTriggers = document.querySelectorAll('[data-track-trigger]');
  if (modal && modalClose) {
    const openModal = (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    trackTriggers.forEach((trigger) => {
      trigger.addEventListener('click', openModal);
    });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});