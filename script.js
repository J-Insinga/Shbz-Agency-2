// MENU MOBILE
const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('show'));

// FADE AU SCROLL
const faders = document.querySelectorAll('.fade');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry, index) => {
    if(entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('appear'), index * 150);
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);
faders.forEach(f => appearOnScroll.observe(f));

// POPUP AUDIT
const auditPopup = document.getElementById('auditPopup');
function openAuditPopup(){ auditPopup.style.display="flex"; }
function closeAuditPopup(){ auditPopup.style.display="none"; }

// FORMULAIRE CONTACT
const contactForm = document.getElementById('premiumContactForm');
const formFeedback = document.getElementById('formFeedback');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  formFeedback.textContent = "Merci ! Nous revenons vers vous rapidement.";
  formFeedback.style.color = "green";
  contactForm.reset();
});

// STICKY NAVBAR
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if(window.scrollY > 150){ header.classList.add('sticky'); }
  else { header.classList.remove('sticky'); }
});

// CANVAS PARTICULES PREMIUM
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
const mouse = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// PARTICLE CLASS
class Particle{
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 2;
    this.speedX = (Math.random() - 0.5) * 0.15;
    this.speedY = (Math.random() - 0.5) * 0.15;
    this.opacity = Math.random() * 0.5 + 0.2;

    // Couleurs uniquement bleu, jaune, turquoise
    const r = Math.random();
    if(r < 0.5) this.color = `rgba(26,115,232,${this.opacity})`;       // bleu
    else if(r < 0.8) this.color = `rgba(255,206,0,${this.opacity})`;   // jaune
    else this.color = `rgba(64,224,208,${this.opacity})`;              // turquoise
  }

  update(){
    this.x += this.speedX;
    this.y += this.speedY;

    if(this.x > canvas.width) this.x = 0;
    if(this.x < 0) this.x = canvas.width;
    if(this.y > canvas.height) this.y = 0;
    if(this.y < 0) this.y = canvas.height;

    if(mouse.x && mouse.y){
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < mouse.radius){
        this.x += dx / dist * 0.5;
        this.y += dy / dist * 0.5;
      }
    }
  }

  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// INIT PARTICLES
let particlesArray = [];
function initParticles(){
  particlesArray = [];
  for(let i = 0; i < Math.floor(canvas.width / 12); i++){
    particlesArray.push(new Particle());
  }
}
initParticles();

// CONNECT PARTICLES
function connectParticles(){
  for(let a = 0; a < particlesArray.length; a++){
    for(let b = a + 1; b < particlesArray.length; b++){
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 120){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(26,115,232,${0.1 + (0.12*(120-dist)/120)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// ANIMATE ALL
function animateAll(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const time = Date.now() * 0.0002;
  const gradient = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  gradient.addColorStop(0, `rgba(26,115,232,0.15)`);   // bleu
  gradient.addColorStop(0.5, `rgba(255,206,0,0.15)`);   // jaune
  gradient.addColorStop(1, `rgba(64,224,208,0.15)`);    // turquoise

  const xShift = Math.sin(time) * 50;
  const yShift = Math.cos(time) * 50;
  ctx.save();
  ctx.translate(xShift, yShift);
  ctx.fillStyle = gradient;
  ctx.fillRect(-50, -50, canvas.width+100, canvas.height+100);
  ctx.restore();

  particlesArray.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateAll);
}
animateAll();