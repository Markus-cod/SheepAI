// ==================================================
// DOOM SCROLLER — LOCAL VOICE SELECTION
// ==================================================

// Cancel any leftover speech when page reloads
window.addEventListener("beforeunload", () => {
  window.speechSynthesis.cancel();
});

window.speechSynthesis.cancel(); // also run immediately on load

const socket = io(window.location.origin);
const background = document.getElementById("background");
const scrollText = document.getElementById("scrollText");
const textForm = document.getElementById("textForm");
const inputText = document.getElementById("inputText");
const voiceSelect = document.getElementById("voiceSelect");

const videoSrc = "videos/bg.mp4";
background.src = videoSrc;

let ignoreNextSocketMessage = false;
let isNarrating = false;
let allVoices = [];

// === Load voices when available ===
function populateVoiceList() {
  allVoices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = "";
  allVoices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.default) option.textContent += " — Default";
    voiceSelect.appendChild(option);
  });
}

// some browsers load voices asynchronously
window.speechSynthesis.onvoiceschanged = populateVoiceList;
populateVoiceList();

// === Random start point in video ===
function playRandomSegment() {
  const duration = background.duration;
  if (isNaN(duration) || duration === 0) {
    setTimeout(playRandomSegment, 300);
    return;
  }
  const randomTime = 20 + Math.random() * (duration - 40);
  background.currentTime = randomTime;
  background.play().catch(() => {});
}

// === Show / Hide text ===
function showText() {
  scrollText.style.opacity = 1;
}
function hideTextSmooth() {
  scrollText.style.opacity = 0;
  setTimeout(() => {
    scrollText.innerHTML = "";
  }, 800);
}

// === Narration + highlighting (4 words per window) ===
async function narrateStory(fullText) {
  if (isNarrating) return;
  isNarrating = true;
  window.speechSynthesis.cancel();
  showText();

  const words = fullText.split(/\s+/);
  const totalWords = words.length;
  const GROUP_SIZE = 4;

  const utter = new SpeechSynthesisUtterance(fullText);
  utter.lang = "en-US";
  utter.rate = 1.05;
  utter.pitch = 1.0;
  utter.volume = 1;

  // pick selected voice from dropdown
  const selectedIndex = voiceSelect.selectedIndex;
  if (allVoices[selectedIndex]) utter.voice = allVoices[selectedIndex];

  speechSynthesis.speak(utter);

  const WORD_DELAY = 400 / utter.rate;
  let currentGroupStart = 0;

  for (let i = 0; i < totalWords; i++) {
    if (i >= currentGroupStart + GROUP_SIZE) currentGroupStart += GROUP_SIZE;

    const wordsInWindow = words.slice(
      currentGroupStart,
      currentGroupStart + GROUP_SIZE
    );
    const relativeIndex = i - currentGroupStart;

    const html = wordsInWindow
      .map((w, idx) =>
        idx === relativeIndex
          ? `<span class="word active">${w}</span>`
          : `<span class="word">${w}</span>`
      )
      .join(" ");
    scrollText.innerHTML = html;
    await sleep(WORD_DELAY);
  }

  utter.onend = () => {
    hideTextSmooth();
    isNarrating = false;
  };
}

// === Utility ===
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// === Play scene ===
function playScene(text) {
  playRandomSegment();
  narrateStory(text);
}

// === Form / Socket handling ===
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputText.value.trim();
  if (!text) return;

  playScene(text);
  ignoreNextSocketMessage = true;

  fetch("/api/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  inputText.value = "";
});

socket.on("new_text", (text) => {
  if (ignoreNextSocketMessage) {
    ignoreNextSocketMessage = false;
    return;
  }
  playScene(text);
});