// ---------------------------
// Gems Page JS
// ---------------------------

// Fallback location (Gatsby Rhodes Villas)
const villaLocation = { lat: 36.2553, lng: 28.1676 };

// Language from localStorage (set by index.html)
const lang = localStorage.getItem("selectedLanguage") || "en";

// Haversine distance (km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

let userLocation = null;
let gemsData = [];
let currentIndex = 0;
let trailerTimer = null;
let trailerPaused = false;

// ---------------------------
// Info panel
// ---------------------------
function showGemInfo(gem) {
  const unlocked = (typeof hasAccess === "function") ? hasAccess() : false;
  const isFree = gem.free || unlocked;

  const panel     = document.getElementById("gem-info-panel");
  const content   = document.getElementById("gem-info-content");
  const goBtn     = document.getElementById("gem-go-btn");
  const unlockBtn = document.getElementById("gem-unlock-btn");

  if (isFree) {
    panel.classList.remove("locked-panel");

    document.getElementById("gem-info-name").textContent        = gem.name[lang] || gem.name.en;
    document.getElementById("gem-info-description").textContent = gem.description[lang] || gem.description.en;

    // Address always in English Latin characters
    document.getElementById("gem-info-address").textContent = gem.address.en;

    // Distance
    const ref = userLocation || villaLocation;
    const d   = getDistance(ref.lat, ref.lng, gem.lat, gem.lng);
    const src = userLocation ? "" : " from Gatsby Rhodes Villas";
    document.getElementById("gem-info-distance").textContent = `📏 ${d.toFixed(1)} km${src}`;

    // Go button → Google Maps directions
    const origin = `${ref.lat},${ref.lng}`;
    const dest   = `${gem.lat},${gem.lng}`;
    const destName = encodeURIComponent(gem.address.en);
    goBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&destination_name=${destName}&travelmode=driving`;
    goBtn.style.display    = "inline-block";
    unlockBtn.style.display = "none";

  } else {
    panel.classList.add("locked-panel");

    const lockedNames = { en: "Hidden Gem", fr: "Joyau Caché", de: "Verborgenes Juwel" };
    const lockedDesc  = {
      en: "Unlock the full guide to discover this hidden gem and many more secret spots across Rhodes.",
      fr: "Déverrouillez le guide complet pour découvrir ce joyau caché et bien d'autres endroits secrets à Rhodes.",
      de: "Schalten Sie den vollständigen Reiseführer frei, um dieses verborgene Juwel zu entdecken."
    };

    document.getElementById("gem-info-name").textContent        = lockedNames[lang] || lockedNames.en;
    document.getElementById("gem-info-description").textContent = lockedDesc[lang]  || lockedDesc.en;
    document.getElementById("gem-info-address").textContent     = "";
    document.getElementById("gem-info-distance").textContent    = "";

    goBtn.style.display    = "none";
    unlockBtn.style.display = "inline-block";
  }
}

// ---------------------------
// Trailer
// ---------------------------
function buildTrailer(gems) {
  const track = document.getElementById("gems-track");
  track.innerHTML = "";

  gems.forEach((gem, i) => {
    const card = document.createElement("div");
    card.className = "gems-card";
    card.dataset.index = i;

    const img = document.createElement("img");
    img.src = gem.photos[0] || "";
    img.alt = gem.name.en;

    const label = document.createElement("span");
    label.className = "gems-card-label";
    label.textContent = gem.name[lang] || gem.name.en;

    card.appendChild(img);
    card.appendChild(label);

    // Click: stop trailer, navigate to this card
    card.addEventListener("click", () => {
      stopTrailer();
      if (card.classList.contains("center")) {
        // Centre card: if free → open maps; if locked → do nothing (Unlock btn handles it)
        const unlocked = (typeof hasAccess === "function") ? hasAccess() : false;
        if (gem.free || unlocked) {
          const ref  = userLocation || villaLocation;
          const dest = `${gem.lat},${gem.lng}`;
          const destName = encodeURIComponent(gem.address.en);
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${ref.lat},${ref.lng}&destination=${dest}&destination_name=${destName}&travelmode=driving`,
            "_blank"
          );
        }
      } else {
        currentIndex = i;
        applyPositions();
      }
    });

    track.appendChild(card);
  });

  applyPositions();
}

function applyPositions() {
  const cards = document.querySelectorAll(".gems-card");
  const total = cards.length;

  cards.forEach((card, i) => {
    card.classList.remove("center", "near-left", "near-right", "far-left", "far-right");
    const diff = i - currentIndex;
    if      (diff === 0)  card.classList.add("center");
    else if (diff === -1) card.classList.add("near-left");
    else if (diff ===  1) card.classList.add("near-right");
    else if (diff  <  -1) card.classList.add("far-left");
    else                  card.classList.add("far-right");

    // Apply locked blur to image and label
    const gem = gemsData[i];
    const unlocked = (typeof hasAccess === "function") ? hasAccess() : false;
    const isFree = gem.free || unlocked;
    const img   = card.querySelector("img");
    const lbl   = card.querySelector(".gems-card-label");

    if (!isFree) {
      img.style.filter  = "blur(7px) brightness(0.5)";
      lbl.style.filter  = "blur(4px)";
      lbl.style.opacity = "0.7";
    } else {
      img.style.filter  = "";
      lbl.style.filter  = "";
      lbl.style.opacity = "";
    }
  });

  showGemInfo(gemsData[currentIndex]);
}

function startTrailer() {
  if (trailerTimer) clearInterval(trailerTimer);
  trailerTimer  = setInterval(() => {
    currentIndex = (currentIndex + 1) % gemsData.length;
    applyPositions();
  }, 4000);
  trailerPaused = false;
}

function stopTrailer() {
  if (trailerTimer) { clearInterval(trailerTimer); trailerTimer = null; }
  trailerPaused = true;
}

// Info panel click stops trailer
document.getElementById("gem-info-panel").addEventListener("click", stopTrailer);

// ---------------------------
// Page title translation
// ---------------------------
const pageTitles = {
  en: "Hidden Gems of Rhodes",
  fr: "Joyaux Cachés de Rhodes",
  de: "Verborgene Schätze von Rhodos"
};

// ---------------------------
// Init
// ---------------------------
function initGems() {
  document.getElementById("gems-page-title").textContent = pageTitles[lang] || pageTitles.en;

  fetch("data/gems.json")
    .then(r => r.json())
    .then(data => {
      gemsData = data;
      buildTrailer(gemsData);
      startTrailer();
    })
    .catch(err => {
      console.error("Failed to load gems.json", err);
    });
}

// ---------------------------
// Geolocation
// ---------------------------
// Start immediately with villa fallback; update distance if GPS resolves
userLocation = villaLocation;
initGems();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      // Refresh distance display for current gem
      if (gemsData.length > 0) showGemInfo(gemsData[currentIndex]);
    },
    () => { /* keep villa fallback */ }
  );
}
