// Theme toggle (shared across every page)
(function(){
  var root = document.documentElement;
  var btn = document.getElementById('themeToggle');
  if(!btn) return;

  function updateButton(theme){
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  updateButton(root.getAttribute('data-theme') || 'light');

  btn.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    updateButton(next);
  });
})();

// Terminal typing effect (home page only)
(function(){
  var body = document.getElementById('termBody');
  if(!body) return;

  var script = [
    { t: '$ muvbyyy build --release', cls: 'prompt' },
    { t: 'compiling 214 modules...', cls: 'muted' },
    { t: 'running test suite  312/312', cls: 'ok' },
    { t: '✓ tests passed', cls: 'ok' },
    { t: '$ muvbyyy deploy --env production', cls: 'prompt' },
    { t: 'staged rollout: 5% → 50% → 100%', cls: 'muted' },
    { t: '✓ deployed in 41s', cls: 'ok' },
    { t: 'watching metrics...', cls: 'muted' },
    { t: '✓ all systems normal', cls: 'ok' }
  ];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(reduce){
    body.innerHTML = script.map(function(l){ return '<p class="line ' + l.cls + '">' + l.t + '</p>'; }).join('');
    return;
  }

  var lineIndex = 0, charIndex = 0, currentP = null;

  function typeStep(){
    if(lineIndex >= script.length){
      setTimeout(function(){
        body.innerHTML = '';
        lineIndex = 0; charIndex = 0;
        typeStep();
      }, 2200);
      return;
    }
    var entry = script[lineIndex];
    if(charIndex === 0){
      currentP = document.createElement('p');
      currentP.className = 'line ' + entry.cls;
      body.appendChild(currentP);
    }
    charIndex++;
    currentP.textContent = entry.t.slice(0, charIndex);
    if(charIndex < entry.t.length){
      setTimeout(typeStep, 16 + Math.random() * 22);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeStep, 260);
    }
  }
  typeStep();
})();

// Smooth reveal effects
(function(){
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if(!reveals.length) return;

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function(item){ observer.observe(item); });
})();

// Animated counters
(function(){
  var counters = Array.prototype.slice.call(document.querySelectorAll('.counter'));
  if(!counters.length) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var duration = 1000;
      var start = null;

      function tick(timestamp){
        if(!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var current = prefersReduced ? target : target * progress;
        var rounded = target % 1 === 0 ? Math.round(current) : current.toFixed(2);
        el.textContent = prefix + rounded + suffix;
        if(progress < 1){
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + target + suffix;
        }
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.7 });

  counters.forEach(function(counter){ observer.observe(counter); });
})();

// Scroll progress + back-to-top
(function(){
  var progress = document.getElementById('scrollProgress');
  var backBtn = document.getElementById('backToTop');
  if(!progress && !backBtn) return;

  function updateScroll(){
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = height > 0 ? (scrollTop / height) * 100 : 0;
    if(progress){ progress.style.width = ratio + '%'; }
    if(backBtn){ backBtn.classList.toggle('show', scrollTop > 500); }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  if(backBtn){
    backBtn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

// Contact form (contact page only, front-end only demo)
(function(){
  var form = document.getElementById('contactForm');
  if(!form) return;
  var success = document.getElementById('formSuccess');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    success.classList.add('show');
    form.reset();
  });
})();
