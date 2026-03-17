const envelopeButton = document.getElementById("envelopeButton");
const envelopeStage = document.getElementById("envelopeStage");
const letterPanel = document.getElementById("letterPanel");
const challengeSection = document.getElementById("challengeSection");
const hintStrip = document.getElementById("hintStrip");
const transitionPanel = document.getElementById("transitionPanel");
const giftButton = document.getElementById("giftButton");
const arena = document.getElementById("arena");
const moodDisplay = document.getElementById("mood");
const hintText = document.getElementById("hintText");
const revealCard = document.getElementById("revealCard");
const messageBubble = document.getElementById("messageBubble");
const girlfriendPhoto = document.getElementById("girlfriendPhoto");

const totalAttempts = 28;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

const dodgeMessages = [
  "Nope. It likes being admired.",
  "Still untouchable.",
  "Almost. The box is feeling theatrical.",
  "It moved with excellent timing.",
  "This present trained for this moment.",
  "Still dodging with confidence.",
  "You are being flirted with by a gift.",
  "Persistent. Impressive.",
  "The ribbon slipped away again.",
  "The box refuses to be basic.",
  "The present is laughing softly.",
  "Nearly. Very nearly.",
  "It seems to enjoy your attention.",
  "Still dramatic, still wrapped.",
  "That was actually close.",
  "The gift is beginning to sweat.",
  "Birthday determination detected.",
  "Okay, the box is less smug now.",
  "You might break its spirit soon.",
  "The present is reconsidering everything.",
  "It knows the end is near.",
  "Still one jump ahead.",
  "The bow is losing confidence.",
  "This is becoming inevitable.",
  "The box is tired but committed.",
  "One of you is about to win.",
  "The gift has accepted its destiny.",
  "Now click. It is finally yours."
];

const moods = [
  "Very smug",
  "Playfully rude",
  "Still performing",
  "Slightly nervous",
  "Losing composure",
  "Ready to surrender"
];

let attempts = 0;
let unlocked = false;
let introOpened = false;
let bubbleTimer;
let touchMoveCooldown = false;
let introTimerOne;
let introTimerTwo;

function showBubble(text) {
  messageBubble.textContent = text;
  messageBubble.classList.add("show");
  window.clearTimeout(bubbleTimer);
  bubbleTimer = window.setTimeout(() => {
    messageBubble.classList.remove("show");
  }, 1300);
}

function updateState() {
  if (attempts < 6) {
    moodDisplay.textContent = moods[0];
    hintText.textContent = "This present has the energy of someone who knows she looks amazing.";
  } else if (attempts < 12) {
    moodDisplay.textContent = moods[1];
    hintText.textContent = "The gift still believes in its own speed.";
  } else if (attempts < 18) {
    moodDisplay.textContent = moods[2];
    hintText.textContent = "A little confidence has left the building.";
  } else if (attempts < 24) {
    moodDisplay.textContent = moods[3];
    hintText.textContent = "This is no longer effortless for the box.";
  } else if (attempts < totalAttempts) {
    moodDisplay.textContent = moods[4];
    hintText.textContent = "The gift is visibly running out of excuses.";
  } else {
    moodDisplay.textContent = moods[5];
    hintText.textContent = "The gift has surrendered. One final click.";
    giftButton.classList.add("can-catch");
  }
}

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
  showBubble("Voucher unlocked.");
  revealCard.classList.remove("hidden");
  revealCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function registerAttempt(messageOverride) {
  if (unlocked || attempts >= totalAttempts) {
    return;
  }

  attempts += 1;
  updateState();
  placeGiftRandomly();

  const message =
    messageOverride || dodgeMessages[Math.min(attempts - 1, dodgeMessages.length - 1)];
  showBubble(message);
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
    hintStrip.classList.remove("hidden");
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
      registerAttempt("Not yet. The ribbon slipped away again.");
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

updateState();
