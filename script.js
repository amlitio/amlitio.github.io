// Basic interactivity: mobile nav, smooth reveal, theme toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  });
},{threshold:0.1});
revealEls.forEach(el=>io.observe(el));

// Year
document.getElementById('y').textContent = new Date().getFullYear();

// Theme toggle
const modeBtn = document.getElementById('mode');
let manual = false;
modeBtn?.addEventListener('click', ()=>{
  manual = true;
  document.documentElement.classList.toggle('light');
});

// Optional: respect prefers-color-scheme; if user toggles, override
if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
  // Light by default
  document.documentElement.classList.add('light');
}

// Typing effect
const typingEl = document.getElementById('typing');
const text = 'Delivering Results.';
let i = 0;
function typeWriter() {
  if (i < text.length) {
    typingEl.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
setTimeout(typeWriter, 2000); // Start after 2s

// Loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading').classList.add('hide');
  }, 2000);
});

// Particle system
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 100;
const connectionDistance = 100;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.5})`;
    this.originalVx = this.vx;
    this.originalVy = this.vy;
  }

  update() {
    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      const force = (100 - distance) / 100;
      this.vx += (dx / distance) * force * 0.01;
      this.vy += (dy / distance) * force * 0.01;
    } else {
      // Return to original velocity
      this.vx += (this.originalVx - this.vx) * 0.01;
      this.vy += (this.originalVy - this.vy) * 0.01;
    }

    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${(connectionDistance - distance) / connectionDistance * 0.2})`;
        ctx.stroke();
      }
    }
  }
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Mouse following glow
let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawGlow() {
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
  const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 50);
  gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();
  requestAnimationFrame(drawGlow);
}
drawGlow();

// Animate progress bars on scroll
const progressBars = document.querySelectorAll('.progress');
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.target;
      const width = progress.style.width;
      progress.style.setProperty('--width', width);
      progress.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
  bar.style.animationPlayState = 'paused';
  progressObserver.observe(bar);
});

// Animated counters
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      const increment = target / 100;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + (target === 95 || target === 30 ? '%' : '+');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + (target === 95 || target === 30 ? '%' : '+');
        }
      }, 30);
      counterObserver.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

// Terminal typing effect
const terminalText = document.getElementById('terminal-text');
const commands = [
  'python optimize_project.py --ai',
  'Analyzing project data...',
  'AI optimization complete. Efficiency: +95%',
  'blockchain secure_transaction.js',
  'Transaction secured with smart contract.',
  'iot monitor_sensors.py',
  'Sensors online. Real-time monitoring active.'
];
let commandIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeTerminal() {
  const currentCommand = commands[commandIndex];
  if (!isDeleting) {
    terminalText.textContent = currentCommand.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentCommand.length) {
      isDeleting = true;
      setTimeout(typeTerminal, 2000);
      return;
    }
  } else {
    terminalText.textContent = currentCommand.substring(0, charIndex);
    charIndex--;
    if (charIndex < 0) {
      isDeleting = false;
      commandIndex = (commandIndex + 1) % commands.length;
      setTimeout(typeTerminal, 500);
      return;
    }
  }
  setTimeout(typeTerminal, isDeleting ? 50 : 100);
}
setTimeout(typeTerminal, 3000);

// Ripple effect on buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = (e.offsetX - 10) + 'px';
    ripple.style.top = (e.offsetY - 10) + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Parallax effect
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;
  document.getElementById('scroll-progress').style.width = progress + '%';
  
  const hero = document.querySelector('.hero');
  const heroText = document.querySelector('.hero-text');
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
  if (heroText) {
    hero.style.transform = `translateY(${scrolled * 0.2}px)`;
  }
  
  // Fade in sections
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      el.classList.add('visible');
    }
  });
});

// 3D Tilt effect
document.querySelectorAll('.innovation-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});
