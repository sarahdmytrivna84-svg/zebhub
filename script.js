const header = document.querySelector(".site-header");
const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dot")];
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
let current = 0;
let timer;
let touchStartX = 0;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
}
function resetTimer() {
  clearInterval(timer);
  timer = setInterval(() => showSlide(current + 1), 6500);
}
prev.addEventListener("click", () => { showSlide(current - 1); resetTimer(); });
next.addEventListener("click", () => { showSlide(current + 1); resetTimer(); });
dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); resetTimer(); }));

document.querySelector(".hero").addEventListener("touchstart", e => touchStartX = e.changedTouches[0].clientX, {passive:true});
document.querySelector(".hero").addEventListener("touchend", e => {
  const distance = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 50) {
    showSlide(current + (distance < 0 ? 1 : -1));
    resetTimer();
  }
}, {passive:true});

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.querySelectorAll(".hero,.hero-visual").forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    if (el.classList.contains("hero-visual")) {
      el.querySelector(".code-card").style.transform = `rotateY(${x * -12}deg) rotateX(${y * -7}deg) translate(${x * 5}px,${y * 5}px)`;
    }
  });
  el.addEventListener("mouseleave", () => {
    const card = el.querySelector(".code-card");
    if(card) card.style.transform = "";
  });
});

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = encodeURIComponent(`ZebHub Project Inquiry — ${data.get("service")}`);
  const body = encodeURIComponent(
`Hi ZebHub,

My name is ${data.get("name")}.
Email: ${data.get("email")}
Project type: ${data.get("service")}

Project details:
${data.get("message")}

I'd like to discuss the project and next steps.

Thanks.`
  );
  window.location.href = `mailto:hello@zebhub.com?subject=${subject}&body=${body}`;
});

showSlide(0);
resetTimer();
