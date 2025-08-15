import confetti from "canvas-confetti";

const btn = document.getElementById("nominateBtn");
const countEl = document.getElementById("count");
const cheer = document.getElementById("cheerSfx");

let count = 0;
let lastFire = 0;

function celebrate() {
  const now = performance.now();
  if (now - lastFire < 250) return; // throttle
  lastFire = now;

  count += 1;
  countEl.textContent = count.toLocaleString();

  // Fire tasteful confetti bursts
  const duration = 1200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      startVelocity: 38,
      spread: 64,
      ticks: 90,
      scalar: 0.8,
      origin: { x: Math.random() * 0.3 + 0.35, y: 0.2 }
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  // Play sound without overlapping too harshly
  try {
    cheer.currentTime = 0;
    cheer.volume = 0.3;
    cheer.play().catch(() => {});
  } catch {}
}

async function openNominationComment() {
  if (window.websim?.postComment) {
    window.websim.postComment({
      content: "And you get a nomination! Spreading the nomination love across Websim 💖"
    });
  } else {
    celebrate();
  }
}

btn.addEventListener("click", openNominationComment);
window.addEventListener("keydown", (e) => { if (e.key.toLowerCase() === "n") openNominationComment(); });

window.websim?.addEventListener?.('comment:created', () => { celebrate(); });