// Basic interactivity: mobile nav, smooth reveal, theme toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

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
