// ✨ PERSONALIZE THE SURPRISE HERE
const CONFIG = {
  name: "Muskan",
  from: "Your favourite person",
};

document.body.classList.add("locked");

document.querySelectorAll("[data-name]").forEach((el) => {
  el.textContent = CONFIG.name;
});

document.querySelectorAll("[data-from]").forEach((el) => {
  el.textContent = CONFIG.from;
});

document.title = `Happy Birthday, ${CONFIG.name}! ✨`;

const intro = document.querySelector("#intro");
const surprise = document.querySelector("#surprise");
const openButton = document.querySelector("#open-surprise");
const musicButton = document.querySelector("#music-toggle");
const cake = document.querySelector("#cake");
const wishMade = document.querySelector("#wish-made");
const replayButton = document.querySelector("#replay-confetti");
const sendHugButton = document.querySelector("#send-hug");
const hugMessage = document.querySelector("#hug-message");
const pageProgress = document.querySelector("#page-progress");
const cursorGlow = document.querySelector("#cursor-glow");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCount = document.querySelector("#lightbox-count");
const lightboxClose = document.querySelector("#lightbox-close");
const lightboxPrev = document.querySelector("#lightbox-prev");
const lightboxNext = document.querySelector("#lightbox-next");
const photoCards = [...document.querySelectorAll(".photo-card")];
let activePhoto = 0;
let lightboxTouchStart = 0;

let audioContext;
let melodyTimer;
let musicPlaying = false;

const notes = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, Bb4: 466.16, C5: 523.25,
};

const melody = [
  ["G4", 0.2], ["G4", 0.2], ["A4", 0.4], ["G4", 0.4], ["C5", 0.4], ["Bb4", 0.8],
  ["G4", 0.2], ["G4", 0.2], ["A4", 0.4], ["G4", 0.4], ["D4", 0.4], ["C4", 0.8],
  ["G4", 0.2], ["G4", 0.2], ["G4", 0.4], ["E4", 0.4], ["C4", 0.4], ["Bb4", 0.4], ["A4", 0.8],
  ["F4", 0.2], ["F4", 0.2], ["E4", 0.4], ["C4", 0.4], ["D4", 0.4], ["C4", 0.8],
];

function playNote(frequency, duration, startTime) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.055, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playMelody() {
  if (!musicPlaying) return;
  const start = audioContext.currentTime + 0.05;
  let cursor = 0;
  melody.forEach(([note, beats]) => {
    playNote(notes[note], beats * 0.72, start + cursor);
    cursor += beats * 0.75;
  });
  melodyTimer = window.setTimeout(playMelody, cursor * 1000 + 1400);
}

function startMusic() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume();
  musicPlaying = true;
  musicButton.classList.remove("paused");
  musicButton.setAttribute("aria-label", "Pause music");
  window.clearTimeout(melodyTimer);
  playMelody();
}

function stopMusic() {
  musicPlaying = false;
  window.clearTimeout(melodyTimer);
  musicButton.classList.add("paused");
  musicButton.setAttribute("aria-label", "Play music");
}

openButton.addEventListener("click", () => {
  intro.classList.add("opened");
  startMusic();
  launchConfetti(240);
  window.setTimeout(() => {
    intro.hidden = true;
    surprise.classList.add("visible");
    surprise.setAttribute("aria-hidden", "false");
    document.body.classList.remove("locked");
    document.querySelectorAll(".hero .reveal").forEach((el, index) => {
      window.setTimeout(() => el.classList.add("in-view"), index * 160);
    });
  }, 700);
});

musicButton.addEventListener("click", () => {
  if (musicPlaying) stopMusic();
  else startMusic();
});

cake.addEventListener("click", () => {
  if (cake.classList.contains("blown")) return;
  cake.classList.add("blown");
  wishMade.classList.add("visible");
  launchConfetti(100);
});

replayButton.addEventListener("click", () => launchConfetti(220));

sendHugButton.addEventListener("click", () => {
  hugMessage.classList.add("visible");
  sendHugButton.innerHTML = 'Hug sent! <span aria-hidden="true">♥</span>';
  launchHearts();
  window.setTimeout(() => hugMessage.classList.remove("visible"), 3200);
});

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  pageProgress.style.width = `${progress}%`;
});

window.addEventListener("pointermove", (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

function showPhoto(index) {
  activePhoto = (index + photoCards.length) % photoCards.length;
  const photo = photoCards[activePhoto];
  const image = photo.querySelector("img");
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = photo.querySelector("figcaption").textContent;
  lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(photoCards.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  showPhoto(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
  photoCards[activePhoto].focus();
}

photoCards.forEach((card, index) => {
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open photo ${index + 1}`);
  card.addEventListener("click", () => openLightbox(index));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showPhoto(activePhoto - 1));
lightboxNext.addEventListener("click", () => showPhoto(activePhoto + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener("touchstart", (event) => {
  lightboxTouchStart = event.changedTouches[0].clientX;
}, { passive: true });

lightbox.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - lightboxTouchStart;
  if (Math.abs(distance) < 45) return;
  showPhoto(activePhoto + (distance < 0 ? 1 : -1));
}, { passive: true });

window.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const canvas = document.querySelector("#confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationFrame;
const confettiColors = ["#ff7e6b", "#f8b6c8", "#f5ca55", "#93c9cf", "#7662a9", "#fffaf1"];

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function launchConfetti(count = 180) {
  resizeCanvas();
  pieces.push(
    ...Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.35,
      width: 5 + Math.random() * 7,
      height: 8 + Math.random() * 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speed: 2.5 + Math.random() * 4,
      drift: -1.5 + Math.random() * 3,
      rotation: Math.random() * Math.PI,
      spin: -0.12 + Math.random() * 0.24,
      wobble: Math.random() * Math.PI * 2,
    }))
  );
  if (!animationFrame) animateConfetti();
}

function launchHearts() {
  const symbols = ["♡", "♥", "✦"];
  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement("span");
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.cssText = `
      position: fixed; z-index: 45; pointer-events: none;
      left: ${45 + Math.random() * 10}%; top: 65%;
      color: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
      font-size: ${1 + Math.random() * 1.6}rem;
      transition: transform ${1.3 + Math.random()}s ease-out, opacity 1.8s ease;
    `;
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random() - 0.5) * 380}px, ${-180 - Math.random() * 260}px) rotate(${Math.random() * 180}deg)`;
      heart.style.opacity = "0";
    });
    window.setTimeout(() => heart.remove(), 2400);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift + Math.sin(piece.wobble) * 0.5;
    piece.rotation += piece.spin;
    piece.wobble += 0.05;
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
    ctx.restore();
  });
  pieces = pieces.filter((piece) => piece.y < window.innerHeight + 30);
  animationFrame = pieces.length ? requestAnimationFrame(animateConfetti) : null;
}

window.addEventListener("resize", resizeCanvas);
