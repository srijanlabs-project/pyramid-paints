(function () {
  var yearEls = document.querySelectorAll('[data-year]');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = String(year); });

  var menuToggle = document.querySelector('[data-menu-toggle]');
  var navShell = document.querySelector('[data-nav-shell]');
  if (menuToggle && navShell) {
    menuToggle.addEventListener('click', function () {
      navShell.classList.toggle('open');
    });
  }

  var megaTriggers = document.querySelectorAll('.has-mega > .main-link');
  megaTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      if (window.innerWidth > 1024) { return; }
      event.preventDefault();
      var parent = trigger.parentElement;
      if (parent) { parent.classList.toggle('open'); }
    });
  });

  var slider = document.querySelector('[data-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.slide');
    var dots = slider.querySelectorAll('.dot');
    var index = 0;

    function setSlide(next) {
      slides.forEach(function (s, i) { s.classList.toggle('active', i === next); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === next); });
      index = next;
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { setSlide(i); });
    });

    setInterval(function () {
      setSlide((index + 1) % slides.length);
    }, 5500);
  }

  var autoRevealTargets = document.querySelectorAll('main section, main .card, main .content-block, main .long-cta, main .industry-tile, main .page-hero');
  autoRevealTargets.forEach(function (el, idx) {
    if (!el.classList.contains('reveal') && !el.classList.contains('content-reveal')) {
      el.classList.add('content-reveal');
    }
    el.style.setProperty('--reveal-delay', String((idx % 8) * 50) + 'ms');
  });

  var revealEls = document.querySelectorAll('.reveal, .content-reveal');
  if (revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  var forms = document.querySelectorAll('[data-contact-form]');
  forms.forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!button) { return; }

      button.disabled = true;
      var originalText = button.textContent;
      button.textContent = 'Sending...';

      if (status) {
        status.className = 'form-status';
        status.textContent = 'Submitting your enquiry...';
      }

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        form.reset();
        if (status) {
          status.className = 'form-status success';
          status.textContent = 'Thank you. Your enquiry has been sent.';
        }
      } catch (error) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = 'Submission failed. Please try again or email us directly.';
        }
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    });
  });
})();
