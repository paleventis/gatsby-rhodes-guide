let currentIndex = 0;
let gemsData = [];

fetch('data/gems.json')
.then(res => res.json())
.then(data => {
  gemsData = data;
  renderGems();
  updateInfo();
});

function renderGems(){

  const track = document.getElementById("gemsTrack");
  track.innerHTML = "";

  gemsData.forEach((g, i) => {

    const unlocked = localStorage.getItem("unlocked") === "true";
    const free = g.name === "Red Sand Beach";
    const locked = !unlocked && !free;

    const card = document.createElement("div");
    card.className = "gems-card";

    if (i === currentIndex) card.classList.add("center");
    if (locked) card.classList.add("locked");

    const img = document.createElement("img");
    img.src = g.photos[0];

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = locked ? "Hidden Gem" : g.name;

    if (locked) title.style.filter = "blur(6px)";

    card.appendChild(img);
    card.appendChild(title);

    card.onclick = () => {
      currentIndex = i;
      renderGems();
      updateInfo();
    };

    track.appendChild(card);
  });
}

function getText(key, lang){
  const t = {
    en:{unlock:"Unlock",desc:"Unlock to discover this hidden gem"},
    fr:{unlock:"Débloquer",desc:"Débloquez pour découvrir ce lieu"},
    de:{unlock:"Freischalten",desc:"Freischalten, um diesen Ort zu entdecken"}
  };
  return t[lang][key];
}

function updateInfo(){

  const g = gemsData[currentIndex];

  const unlocked = localStorage.getItem("unlocked") === "true";
  const free = g.name === "Red Sand Beach";
  const locked = !unlocked && !free;

  const lang = localStorage.getItem("lang") || "en";

  const info = document.getElementById("gemsInfo");

  info.innerHTML = `
    <img src="${g.photos[0]}" class="gems-info-image"
      style="${locked ? 'filter:blur(10px)' : ''}">

    <h2 style="${locked ? 'filter:blur(6px)' : ''}">
      ${locked ? "Hidden Gem" : g.name}
    </h2>

    <p style="${locked ? 'filter:blur(6px)' : ''}">
      ${locked ? getText("desc",lang) : g.notes}
    </p>

    <div class="gems-location">
      ${locked ? "••••••••" : g.address}
      <span>${locked ? "-- km" : ""}</span>
    </div>

    ${
      locked
        ? `<button class="unlock-btn" onclick="openUnlock()">🔒 ${getText("unlock",lang)}</button>`
        : `<button class="map-btn" onclick="go(${g.lat}, ${g.lng})">🧭 Go</button>`
    }
  `;
}

function openUnlock(){
  document.getElementById("unlockModal").classList.remove("hidden");
}

function go(lat, lng){
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
}