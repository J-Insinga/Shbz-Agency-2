// ===========================
// MENU MOBILE
// ===========================
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});

// ===========================
// FADE AU SCROLL + affichage initial
// ===========================
const faders = document.querySelectorAll('.fade');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
  const rect = fader.getBoundingClientRect();
  if(rect.top < window.innerHeight) fader.classList.add('appear');
});

// ===========================
// POPUP AUDIT
// ===========================
const auditPopup = document.getElementById('auditPopup');
const auditStep1 = document.getElementById('auditStep1');
const auditStep2 = document.getElementById('auditStep2');

function openAuditPopup() {
  auditPopup.style.display = 'flex';
  auditStep1.style.display = 'block';
  auditStep2.style.display = 'none';
}

function closeAuditPopup() {
  auditPopup.style.display = 'none';
}

function goToStep2(event) {
  event.preventDefault();
  auditStep1.style.display = 'none';
  auditStep2.style.display = 'block';
}

// ===========================
// FORMULAIRE DE CONTACT
// ===========================
const contactForm = document.getElementById('premiumContactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = contactForm.querySelector('input[type="text"]').value.trim();
  const email = contactForm.querySelector('input[type="email"]').value.trim();
  const message = contactForm.querySelector('textarea').value.trim();

  if(name && email && message){
    formFeedback.textContent = "Merci ! Votre message a été envoyé 🚀";
    formFeedback.style.color = "green";
    contactForm.reset();
  } else {
    formFeedback.textContent = "Veuillez remplir tous les champs.";
    formFeedback.style.color = "red";
  }
});

// ===========================
// BACKGROUND CANVAS BLEU / JAUNE (plus lent, sans lignes)
// ===========================
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const mouse = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 2;
    this.speedX = (Math.random() - 0.5) * 0.15; // vitesse plus lente
    this.speedY = (Math.random() - 0.5) * 0.15; // vitesse plus lente
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = Math.random() < 0.7 
      ? `rgba(26,115,232,${this.opacity})`   // bleu 70%
      : `rgba(255,206,0,${this.opacity})`;   // jaune 30%
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if(this.x > canvas.width) this.x = 0;
    if(this.x < 0) this.x = canvas.width;
    if(this.y > canvas.height) this.y = 0;
    if(this.y < 0) this.y = canvas.height;

    // Interaction souris
    if(mouse.x && mouse.y){
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < mouse.radius){
        this.x += dx/dist * 0.5; // déplacement doux
        this.y += dy/dist * 0.5;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles(){
  particlesArray = [];
  const numberOfParticles = Math.floor(canvas.width / 12);
  for(let i = 0; i < numberOfParticles; i++){
    particlesArray.push(new Particle());
  }
}
initParticles();

function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();