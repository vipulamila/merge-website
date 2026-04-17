/* ── LOADER ── */
function initLoader() {
  const fill = document.getElementById('loaderFill');
  const msg = document.getElementById('loaderMsg');
  if (!fill || !msg) return;
  const msgs = ['Preparing your experience…', 'Loading features…', 'Almost ready…'];
  let pct = 0, msgIdx = 0;
  const loaderTimer = setInterval(() => {
    pct += Math.random() * 18 + 8;
    if (pct > 100) pct = 100;
    fill.style.width = pct + '%';
    if (pct > 40 && msgIdx < 1) { msgIdx = 1; msg.textContent = msgs[1]; }
    if (pct > 75 && msgIdx < 2) { msgIdx = 2; msg.textContent = msgs[2]; }
    if (pct >= 100) {
      clearInterval(loaderTimer);
      setTimeout(() => { document.getElementById('loader').classList.add('hidden'); }, 300);
    }
  }, 120);
  window.addEventListener('load', () => {
    pct = 100; fill.style.width = '100%';
    setTimeout(() => { document.getElementById('loader').classList.add('hidden'); }, 400);
  });
}

/* ── NAV SCROLL ── */
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* ── MOBILE MENU ── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}

window.closeMobileMenu = function () {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.remove('open');
};

/* ── FAQ ── */
window.toggleFaq = function (el) {
  const item = el.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
};

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── CONTACT FORM VALIDATION & SUBMISSION ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    firstName: { required: true, minLen: 2, label: 'First name' },
    lastName:  { required: true, minLen: 2, label: 'Last name' },
    email:     { required: true, isEmail: true, label: 'Email' },
    company:   { required: true, minLen: 2, label: 'Company' },
    subject:   { required: true, label: 'Subject' },
    message:   { required: true, minLen: 20, label: 'Message' },
  };

  function showError(name, msg) {
    const input = document.getElementById(name);
    const errEl = document.getElementById(name + 'Error');
    if (input) input.classList.add('error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(name) {
    const input = document.getElementById(name);
    const errEl = document.getElementById(name + 'Error');
    if (input) input.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  function validateAll() {
    let valid = true;
    Object.entries(fields).forEach(([name, rules]) => {
      clearError(name);
      const el = document.getElementById(name);
      if (!el) return;
      const val = el.value.trim();

      if (rules.required && !val) {
        showError(name, rules.label + ' is required.');
        valid = false;
        return;
      }
      if (rules.minLen && val.length < rules.minLen) {
        showError(name, rules.label + ' must be at least ' + rules.minLen + ' characters.');
        valid = false;
        return;
      }
      if (rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showError(name, 'Please enter a valid email address.');
        valid = false;
        return;
      }
    });
    return valid;
  }

  // Live validation on blur
  Object.keys(fields).forEach(name => {
    const el = document.getElementById(name);
    if (el) el.addEventListener('blur', () => {
      clearError(name);
      const val = el.value.trim();
      const rules = fields[name];
      if (rules.required && !val) { showError(name, rules.label + ' is required.'); return; }
      if (rules.minLen && val.length < rules.minLen) { showError(name, rules.label + ' must be at least ' + rules.minLen + ' characters.'); return; }
      if (rules.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(name, 'Please enter a valid email address.'); }
    });
  });

  form.addEventListener('submit', function (e) {
    if (!validateAll()) {
      e.preventDefault();
      return;
    }

    // Populate the hidden 'name' field for Salesforce
    const fname = document.getElementById('firstName').value.trim();
    const lname = document.getElementById('lastName').value.trim();
    const nameField = document.getElementById('name');
    if (nameField) nameField.value = fname + ' ' + lname;

    const btn = form.querySelector('.form-submit');
    const spinner = btn.querySelector('.btn-spinner');
    const btnText = btn.querySelector('.btn-text');

    btn.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (btnText) btnText.textContent = 'Sending…';

    // Since we are targeting a hidden iframe, the page won't reload.
    // We show the success banner after a short delay to simulate "submission"
    setTimeout(() => {
      btn.disabled = false;
      if (spinner) spinner.style.display = 'none';
      if (btnText) btnText.textContent = 'Send Message →';

      const success = document.getElementById('successBanner');
      if (success) {
        success.classList.add('show');
        form.reset();
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
}

/* ── DOCS SIDEBAR ACTIVE LINK ── */
function initDocsSidebar() {
  const links = document.querySelectorAll('.docs-nav-link');
  if (!links.length) return;
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  // Highlight on scroll
  const sections = document.querySelectorAll('.docs-content [id]');
  if (!sections.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector('.docs-nav-link[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavScroll();
  initMobileMenu();
  initReveal();
  initContactForm();
  initDocsSidebar();
});
