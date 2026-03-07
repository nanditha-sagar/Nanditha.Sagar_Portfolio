document.addEventListener("DOMContentLoaded", () => {
  // 1. GALAXY STARS BACKGROUND (Multi-layered Parallax)
  const starsContainer = document.getElementById("stars-container");

  function initGalaxy() {
    const layers = [
      { count: 1000, size: 1.5, speed: 0.1, opacity: 0.3 },
      { count: 300, size: 3, speed: 0.2, opacity: 0.5 },
      { count: 50, size: 4.5, speed: 0.4, opacity: 0.8 }
    ];

    layers.forEach(layer => {
      const layerEl = document.createElement("div");
      layerEl.className = "star-layer";
      layerEl.style.position = "absolute";
      layerEl.style.width = "100%";
      layerEl.style.height = "100%";

      for (let i = 0; i < layer.count; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.width = layer.size + "px";
        star.style.height = layer.size + "px";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = Math.random() * layer.opacity;

        if (Math.random() > 0.8) {
          star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`;
          star.style.animationDelay = Math.random() * 5 + "s";
        }

        layerEl.appendChild(star);
      }
      starsContainer.appendChild(layerEl);
    });
  }

  // 2. RANDOM SHOOTING STARS
  function createShootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight / 2);
    const length = Math.random() * 200 + 100;
    const angle = 45; // Diagonal

    star.style.left = startX + "px";
    star.style.top = startY + "px";
    star.style.width = length + "px";
    star.style.transform = `rotate(${angle}deg)`;

    starsContainer.appendChild(star);

    const animation = star.animate([
      { transform: `rotate(${angle}deg) translateX(0)`, opacity: 0 },
      { transform: `rotate(${angle}deg) translateX(${length}px)`, opacity: 1, offset: 0.2 },
      { transform: `rotate(${angle}deg) translateX(${length * 2}px)`, opacity: 0 }
    ], {
      duration: 1500,
      easing: 'ease-out'
    });

    animation.onfinish = () => star.remove();
  }

  setInterval(() => {
    if (Math.random() > 0.3) createShootingStar();
  }, 7000);

  const canvas = document.getElementById("neural-canvas");
  let ctx;
  if (canvas) {
    ctx = canvas.getContext("2d");
  }
  let particles = [];
  const particleCount = 60;
  const connectionDistance = 150;
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // React to mouse
      if (mouse.x) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(192, 192, 192, 0.5)";
      ctx.fill();
    }
  }

  function initNeural() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateNeural() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(96, 165, 250, ${1 - dist / connectionDistance})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateNeural);
  }

  // 4. DETECTIVE CURSOR LOGIC
  const cursor = document.getElementById("detective-cursor");
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Smooth cursor movement
    if (cursor) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }

    createCursorTrail(e.clientX, e.clientY);
  });

  window.addEventListener("mousedown", () => cursor?.classList.add("clicking"));
  window.addEventListener("mouseup", () => cursor?.classList.remove("clicking"));

  function createCursorTrail(x, y) {
    const p = document.createElement("div");
    p.className = "cursor-particle";
    p.style.left = x + "px";
    p.style.top = y + "px";
    document.body.appendChild(p);

    const size = Math.random() * 4 + 2;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.backgroundColor = "var(--neon-blue)";
    p.style.boxShadow = "0 0 10px var(--neon-blue)";
    p.style.borderRadius = "50%";
    p.style.position = "fixed";
    p.style.pointerEvents = "none";
    p.style.zIndex = "9997";

    const destinationX = x + (Math.random() - 0.5) * 50;
    const destinationY = y + (Math.random() - 0.5) * 50;

    const anim = p.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
      { transform: `translate(${destinationX - x}px, ${destinationY - y}px) scale(0)`, opacity: 0 }
    ], {
      duration: 1000,
      easing: 'ease-out'
    });

    anim.onfinish = () => p.remove();
  }

  // 5. TYPING EFFECT (Reuse existing)
  const typingElement = document.querySelector(".typing");
  const texts = ["AI Explorer", "Web Developer", "Cinephile", "Stock Trader"];
  let tIndex = 0, cIndex = 0, isDel = false;

  function typeEffect() {
    const cur = texts[tIndex];
    typingElement.textContent = isDel ? cur.substring(0, cIndex--) : cur.substring(0, cIndex++);

    let speed = isDel ? 50 : 100;
    if (!isDel && cIndex > cur.length) {
      isDel = true;
      speed = 2000;
    }
    else if (isDel && cIndex < 0) {
      isDel = false;
      tIndex = (tIndex + 1) % texts.length;
      speed = 500;
    }
    setTimeout(typeEffect, speed);
  }

  // 6. SPOTLIGHT EFFECT
  const spotlight = document.getElementById("spotlight");
  document.addEventListener("mousemove", (e) => {
    if (spotlight) {
      spotlight.style.setProperty("--x", e.clientX + "px");
      spotlight.style.setProperty("--y", e.clientY + "px");
    }
  });



  function createStarBurstInner(x, y, parent) {
    for (let i = 0; i < 10; i++) {
      const p = document.createElement("div");
      p.className = "star-particle";
      const rect = parent.getBoundingClientRect();
      p.style.left = (rect.width / 2) + "px";
      p.style.top = (rect.height / 2) + "px";
      parent.appendChild(p);

      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * 60 + 30;
      p.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d}px) scale(0)`, opacity: 0 }
      ], { duration: 800 }).onfinish = () => p.remove();
    }
  }


  // 11. NAVBAR REDESIGN INTERACTIVITY
  const header = document.getElementById("main-header");
  const navMenu = document.getElementById("nav-menu");
  const mobileToggle = document.getElementById("mobile-toggle");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
  const navLinks = document.querySelectorAll(".nav-link");
  const navIndicator = document.getElementById("nav-indicator");
  const orbitingDot = document.getElementById("orbiting-dot");
  const navbarStars = document.getElementById("navbar-stars");

  // Load Animation
  setTimeout(() => header.classList.add("loaded"), 100);

  // Navbar Starfield
  function initNavbarStars() {
    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      star.className = "star-nav";
      const size = Math.random() * 2 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.opacity = Math.random() * 0.5 + 0.2;

      const duration = Math.random() * 3 + 2;
      star.animate([
        { opacity: 0.2, transform: "scale(1)" },
        { opacity: 0.8, transform: "scale(1.5)" },
        { opacity: 0.2, transform: "scale(1)" }
      ], { duration: duration * 1000, iterations: Infinity });

      navbarStars.appendChild(star);
    }
  }
  initNavbarStars();

  // Active Section Tracker & Indicator
  let activeIndex = 0;
  let dotAngle = 0;
  let isDotPaused = false;

  function updateIndicator() {
    const activeLink = navLinks[activeIndex];
    if (!activeLink || window.innerWidth <= 768) return;

    const rect = activeLink.getBoundingClientRect();
    const navRect = navLinks[0].parentElement.getBoundingClientRect();

    navIndicator.style.width = rect.width + "px";
    navIndicator.style.left = (rect.left - navRect.left) + "px";

    // Orbiting Dot Position
    if (!isDotPaused) {
      dotAngle += 0.05;
      const radiusX = rect.width / 2 + 15;
      const radiusY = 25;
      const centerX = rect.left - navRect.left + rect.width / 2;
      const centerY = rect.height / 2;

      const dotX = centerX + Math.cos(dotAngle) * radiusX;
      const dotY = centerY + Math.sin(dotAngle) * radiusY;

      orbitingDot.style.left = (dotX - 3) + "px";
      orbitingDot.style.top = (dotY - 3) + "px";
      orbitingDot.style.opacity = "1";
    }
  }

  // Section Tracking on Scroll
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link, i) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        activeIndex = i;
        link.classList.add("active");
      }
    });
  });

  // Hover Effects
  navLinks.forEach((link, i) => {
    link.addEventListener("mouseenter", () => {
      isDotPaused = true;
      orbitingDot.style.opacity = "0";
    });
    link.addEventListener("mouseleave", () => {
      isDotPaused = false;
      orbitingDot.style.opacity = "1";
    });

    // Stagger animation for links
    link.style.animationDelay = (i * 0.1 + 0.5) + "s";
  });

  function animateNavbar() {
    updateIndicator();
    requestAnimationFrame(animateNavbar);
  }
  // 13. CERTIFICATE MODAL & PARTICLES
  const certModal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("modal-img");
  const modalPdf = document.getElementById("modal-pdf");
  const closeModal = document.querySelector(".close-modal");
  const certButtons = document.querySelectorAll(".view-cert-btn");
  const certParticles = document.querySelector(".cert-particles");

  if (certButtons.length > 0) {
    certButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const file = btn.getAttribute("data-cert");
        if (file.endsWith(".pdf")) {
          modalImg.style.display = "none";
          modalPdf.style.display = "block";
          modalPdf.src = file;
        } else {
          modalPdf.style.display = "none";
          modalImg.style.display = "block";
          modalImg.src = file;
        }
        certModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    closeModal.addEventListener("click", () => {
      certModal.classList.remove("active");
      document.body.style.overflow = "auto";
      modalPdf.src = "";
    });

    certModal.addEventListener("click", (e) => {
      if (e.target === certModal) {
        certModal.classList.remove("active");
        document.body.style.overflow = "auto";
        modalPdf.src = "";
      }
    });

    // Certificate Particles
    function initCertParticles() {
      if (!certParticles) return;
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "cert-particle";
        const size = Math.random() * 4 + 2;
        p.style.width = size + "px";
        p.style.height = size + "px";
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.setProperty("--duration", (Math.random() * 4 + 3) + "s");
        p.style.animationDelay = Math.random() * 5 + "s";
        certParticles.appendChild(p);
      }
    }
    initCertParticles();
  }
  initGalaxy();
  initNeural();
  animateNeural();
  animateNavbar();

  if (typingElement) {
    typeEffect();
  }
});
