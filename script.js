const envelopeButton = document.getElementById("envelopeButton");
const envelopeStage = document.getElementById("envelopeStage");
const letterPanel = document.getElementById("letterPanel");
const challengeSection = document.getElementById("challengeSection");
const transitionPanel = document.getElementById("transitionPanel");
const giftButton = document.getElementById("giftButton");
const arena = document.getElementById("arena");
const revealCard = document.getElementById("revealCard");
const girlfriendPhoto = document.getElementById("girlfriendPhoto");

const totalAttempts = 28;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

let attempts = 0;
let unlocked = false;
let introOpened = false;
let touchMoveCooldown = false;
let introTimerOne;
let introTimerTwo;

function placeGiftRandomly() {
  const arenaRect = arena.getBoundingClientRect();
  const giftRect = giftButton.getBoundingClientRect();
  const padding = isCoarsePointer ? 18 : 28;
  const headerOffset = isCoarsePointer ? 88 : 76;
  const maxX = arenaRect.width - giftRect.width - padding;
  const maxY = arenaRect.height - giftRect.height - padding;
  const nextLeft = padding + Math.random() * Math.max(maxX - padding, 18);
  const nextTop = headerOffset + Math.random() * Math.max(maxY - headerOffset, 18);

  giftButton.style.left = `${nextLeft}px`;
  giftButton.style.top = `${nextTop}px`;
}

function revealGift() {
  unlocked = true;
  giftButton.disabled = true;
  giftButton.style.cursor = "default";
  giftButton.classList.remove("can-catch");
  revealCard.classList.remove("hidden");
  revealCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function registerAttempt() {
  if (unlocked || attempts >= totalAttempts) {
    return;
  }

  attempts += 1;
  placeGiftRandomly();
  if (attempts >= totalAttempts) {
    giftButton.classList.add("can-catch");
  }
}

function openIntro() {
  if (introOpened) {
    return;
  }

  introOpened = true;
  envelopeButton.classList.add("is-open");
  transitionPanel.classList.remove("hidden");

  introTimerOne = window.setTimeout(() => {
    transitionPanel.classList.add("visible");
  }, 280);

  introTimerTwo = window.setTimeout(() => {
    letterPanel.classList.remove("hidden");
    challengeSection.classList.remove("hidden");
    envelopeStage.classList.add("hidden");
    transitionPanel.classList.remove("visible");
    challengeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    placeGiftRandomly();
    window.setTimeout(() => {
      transitionPanel.classList.add("hidden");
    }, 450);
  }, 1300);
}

envelopeButton.addEventListener("click", openIntro);

if (!isCoarsePointer) {
  giftButton.addEventListener("pointerenter", () => {
    registerAttempt();
  });
}

giftButton.addEventListener("pointerdown", (event) => {
  if (!isCoarsePointer || unlocked || attempts >= totalAttempts) {
    return;
  }

  event.preventDefault();

  if (touchMoveCooldown) {
    return;
  }

  touchMoveCooldown = true;
  registerAttempt();
  window.setTimeout(() => {
    touchMoveCooldown = false;
  }, 220);
});

giftButton.addEventListener("click", () => {
  if (attempts < totalAttempts) {
    if (!isCoarsePointer) {
      registerAttempt();
    }
    return;
  }

  revealGift();
});

window.addEventListener("resize", () => {
  if (introOpened && !unlocked) {
    placeGiftRandomly();
  }
});

girlfriendPhoto.addEventListener("error", () => {
  girlfriendPhoto.alt = "Add a file named girlfriend-photo.jpg next to index.html to show her portrait here.";
  girlfriendPhoto.style.opacity = "0";
  girlfriendPhoto.parentElement.style.background =
    "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(247,223,205,0.95))";
  girlfriendPhoto.parentElement.insertAdjacentHTML(
    "beforeend",
    '<div class="photo-placeholder">Add <code>girlfriend-photo.jpg</code> to the project folder to show her photo here.</div>'
  );
});
