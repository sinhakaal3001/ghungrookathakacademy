/* =============================================
   GHUNGROO KATHAK ACADEMY – JAVASCRIPT
============================================= */

// ===== STICKY HEADER =====
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close nav when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ===== SMOOTH SCROLL ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav a');

const observerOptions = {
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll(
  '.course-card, .why-card, .testimonial-card, .about-content, .about-visual, .contact-info, .contact-form-wrap, .award-card, .bio-layout'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Add reveal CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  .main-nav a.active { color: #F0C040; }
  .main-nav a.active::after { transform: scaleX(1); }
`;
document.head.appendChild(style);

// ===== CONTACT FORM – Web3Forms =====
const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!name || !email) {
    formNote.style.color = '#C8200C';
    formNote.textContent = 'Please fill in your name and email address.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formNote.style.color = '#C8200C';
    formNote.textContent = 'Please enter a valid email address.';
    return;
  }

  // Set the real Web3Forms access key
  const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
  if (accessKeyInput) accessKeyInput.value = '0865c34d-747b-4aa7-be6a-0c6b71d55f3c';

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  formNote.textContent = '';

  try {
    const formData = new FormData(contactForm);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      formNote.style.color = '#2A7A2A';
      formNote.textContent = '✓ Thank you! Your message has been sent. We\'ll get back to you within 24 hours.';
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    formNote.style.color = '#C8200C';
    formNote.innerHTML = 'Something went wrong. Please email us directly at <a href="mailto:gka.enquiry@gmail.com" style="color:#C8960C">gka.enquiry@gmail.com</a>.';
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + '+';
    }
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const val = parseInt(el.textContent);
      animateCounter(el, val);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ===== GALLERY LIGHTBOX (simple) =====
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.8);';
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
  });
});

// ===== POSTER CAROUSEL =====
(function() {
  const track = document.getElementById('posterTrack');
  const dots = document.querySelectorAll('.poster-dot');
  const prevBtn = document.getElementById('posterPrev');
  const nextBtn = document.getElementById('posterNext');
  if (!track) return;

  let current = 0;
  const total = track.children.length;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 4000);
  }
  function stopAuto() { clearInterval(autoTimer); }

  nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  startAuto();
})();

// ===== PHOTO GALLERY LIGHTBOX =====
(function() {
  const grid = document.getElementById('photoGrid');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (!grid || !lightbox) return;

  const items = Array.from(grid.querySelectorAll('.pg-item'));
  let current = 0;

  function openLightbox(index) {
    current = index;
    const img = items[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = items[current].querySelector('.pg-overlay span').textContent;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    current = (current - 1 + items.length) % items.length;
    openLightbox(current);
  }

  function showNext() {
    current = (current + 1) % items.length;
    openLightbox(current);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

// ===== PERFORMANCE VIDEO THUMBNAIL SWITCHER =====
(function() {
  const thumbs = document.querySelectorAll('.perf-thumb');
  const featuredVideo = document.getElementById('featuredVideo');
  const featTitle = document.querySelector('.perf-feat-title');
  if (!thumbs.length || !featuredVideo) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Update featured video
      const src = thumb.dataset.src;
      const poster = thumb.dataset.poster;
      const title = thumb.dataset.title;

      featuredVideo.pause();
      featuredVideo.src = src;
      featuredVideo.poster = poster;
      featuredVideo.load();
      if (featTitle) featTitle.textContent = title;
    });
  });
})();

// ===== VIDEO TABS (Stage / Event / Class) =====
(function() {
  const tabBtns = document.querySelectorAll('.vtab-btn');
  const tabContents = document.querySelectorAll('.vtab-content');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.vtab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContents.forEach(content => {
        if (content.id === 'vtab-' + target) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
          content.querySelectorAll('video').forEach(v => v.pause());
        }
      });
    });
  });

  // Pause other videos when one starts playing
  document.querySelectorAll('.vtab-video').forEach(video => {
    video.addEventListener('play', () => {
      document.querySelectorAll('.vtab-video').forEach(v => {
        if (v !== video) v.pause();
      });
    });
  });
})();

// ===== SYLLABUS ACCORDION =====
function toggleSyllabus(btn) {
  const content = btn.nextElementSibling;
  const isOpen = content.classList.contains('open');
  // Close all open groups
  document.querySelectorAll('.syllabus-group-content.open').forEach(el => {
    el.classList.remove('open');
    el.previousElementSibling.classList.remove('open');
  });
  // Open clicked group if it was closed
  if (!isOpen) {
    content.classList.add('open');
    btn.classList.add('open');
  }
}
