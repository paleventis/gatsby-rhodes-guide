// ========================================
// GEMS PAGE JAVASCRIPT
// ========================================

let currentIndex = 0;
let gemsData = [];
let userLocation = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Get user's language from localStorage (set by index.html)
  window.currentLang = localStorage.getItem('lang') || 'en';
  
  // Get user location and load gems
  getUserLocation();
  loadGemsData();
  
  // Check for QR unlock codes
  checkQRUnlock();
});

// ========================================
// GET USER LOCATION
// ========================================

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Re-render after getting location to show distances
        if (gemsData.length > 0) {
          renderGems();
          updateInfo();
        }
      },
      function(error) {
        console.log('Location access denied, using default location');
        // Default to Rhodes center if location not available
        userLocation = {
          lat: 36.1333,
          lng: 28.2167
        };
      }
    );
  }
}

// ========================================
// CALCULATE DISTANCE (Haversine formula)
// ========================================

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ========================================
// LOAD GEMS DATA
// ========================================

function loadGemsData() {
  fetch('data/gems.json')
    .then(res => res.json())
    .then(data => {
      gemsData = data;
      
      // Sort by distance if user location is available
      if (userLocation) {
        gemsData.forEach(gem => {
          gem.distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            gem.lat, 
            gem.lng
          );
        });
        gemsData.sort((a, b) => a.distance - b.distance);
      }
      
      renderGems();
      updateInfo();
    })
    .catch(error => console.error('Error loading gems:', error));
}

// ========================================
// RENDER CAROUSEL CARDS
// ========================================

function renderGems() {
  const track = document.getElementById('gemsTrack');
  track.innerHTML = '';

  gemsData.forEach((gem, i) => {
    const hasAccess = hasUserAccess(gem);
    const isLocked = !hasAccess;

    const card = document.createElement('div');
    card.className = 'gems-card';

    if (i === currentIndex) {
      card.classList.add('center');
    }
    if (isLocked) {
      card.classList.add('locked');
    }

    const img = document.createElement('img');
    img.src = gem.photos[0];
    img.alt = gem.name[window.currentLang] || gem.name.en;

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = isLocked ? getText('hiddenGem') : (gem.name[window.currentLang] || gem.name.en);

    card.appendChild(img);
    card.appendChild(title);

    card.onclick = () => {
      currentIndex = i;
      renderGems();
      updateInfo();
    };

    track.appendChild(card);
  });

  // Auto-scroll to center card
  setTimeout(() => {
    const centerCard = track.querySelector('.gems-card.center');
    if (centerCard) {
      centerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, 100);
}

// ========================================
// CHECK USER ACCESS
// ========================================

function hasUserAccess(gem) {
  // Free gems are always accessible
  if (gem.free) return true;

  // Check if user has unlocked the guide
  const guideUnlocked = localStorage.getItem('guideUnlocked') === 'true';
  const guideExpire = localStorage.getItem('guideExpire');
  
  if (guideUnlocked && guideExpire) {
    return new Date(guideExpire) > new Date();
  }

  return false;
}

// ========================================
// GET TRANSLATED TEXT
// ========================================

function getText(key) {
  const lang = window.currentLang;
  const translations = {
    en: {
      hiddenGem: 'Hidden Gem',
      unlockDesc: 'Unlock to discover this hidden gem',
      unlock: 'Unlock',
      distance: 'km away'
    },
    fr: {
      hiddenGem: 'Joyau Caché',
      unlockDesc: 'Débloquez pour découvrir ce lieu',
      unlock: 'Débloquer',
      distance: 'km'
    },
    de: {
      hiddenGem: 'Versteckter Schatz',
      unlockDesc: 'Freischalten, um diesen Ort zu entdecken',
      unlock: 'Freischalten',
      distance: 'km entfernt'
    }
  };

  return translations[lang]?.[key] || translations.en[key];
}

// ========================================
// UPDATE INFORMATION TAB
// ========================================

function updateInfo() {
  const gem = gemsData[currentIndex];
  const hasAccess = hasUserAccess(gem);
  const isLocked = !hasAccess;
  const lang = window.currentLang;

  const infoContainer = document.getElementById('gemsInfoContainer');
  const info = document.getElementById('gemsInfo');

  // Update locked state on container
  if (isLocked) {
    infoContainer.classList.add('locked');
  } else {
    infoContainer.classList.remove('locked');
  }

  // Get translated content
  const gemName = gem.name[lang] || gem.name.en;
  const gemDesc = gem.description[lang] || gem.description.en;
  const gemAddress = gem.address[lang] || gem.address.en;
  const distance = gem.distance ? gem.distance.toFixed(1) : '?';

  // Build info HTML
  let infoHTML = `
    <img src="${gem.photos[0]}" class="gems-info-image ${isLocked ? 'locked' : ''}" alt="${gemName}">
    
    <h2 class="${isLocked ? 'locked' : ''}">
      ${isLocked ? getText('hiddenGem') : gemName}
    </h2>

    <p class="${isLocked ? 'locked' : ''}">
      ${isLocked ? getText('unlockDesc') : gemDesc}
    </p>

    <div class="gems-location ${isLocked ? 'locked' : ''}">
      ${isLocked ? '••••••••••••' : gemAddress}
      <span class="gems-distance">${isLocked ? '-- km' : distance + ' ' + getText('distance')}</span>
    </div>

    <div class="gems-button-group">
      ${
        isLocked
          ? `<button class="unlock-btn" onclick="openUnlockModal()">${getText('unlock')}</button>`
          : `<button class="go-btn" onclick="openGoogleMaps(${gem.lat}, ${gem.lng})">🧭 Go</button>`
      }
    </div>
  `;

  info.innerHTML = infoHTML;
}

// ========================================
// OPEN GOOGLE MAPS
// ========================================

function openGoogleMaps(lat, lng) {
  if (userLocation) {
    // Open directions from current location
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`);
  } else {
    // Just open the location
    window.open(`https://www.google.com/maps/?q=${lat},${lng}`);
  }
}

// ========================================
// UNLOCK MODAL FUNCTIONS
// ========================================

function openUnlockModal() {
  document.getElementById('unlockModal').classList.add('active');
}

function closeUnlockModal() {
  document.getElementById('unlockModal').classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('unlockModal');
  if (event.target === modal) {
    closeUnlockModal();
  }
});

// ========================================
// PAYMENT FUNCTIONS (from paywall.js)
// ========================================

function startPayment() {
  const email = document.getElementById('userEmail').value;

  if (!email) {
    alert('Please enter your email');
    return;
  }

  localStorage.setItem('userEmail', email);
  window.location.href = 'https://buy.stripe.com/dRm4gy7798Amb7p6gkeQM05';
}

function unlockWithCode() {
  const code = document.getElementById('accessCode').value;

  const validCodes = ['gatsby1', 'vip1'];

  if (validCodes.includes(code)) {
    unlockGuide(90);
  } else {
    alert('Invalid access code');
  }
}

function unlockGuide(days = 90) {
  const expire = new Date();
  expire.setDate(expire.getDate() + days);

  localStorage.setItem('guideUnlocked', 'true');
  localStorage.setItem('guideExpire', expire.toISOString());
  localStorage.setItem('guideCodeVersion', 'v1');

  closeUnlockModal();
  location.reload();
}

// ========================================
// LANGUAGE CHANGE LISTENER
// ========================================

// Listen for language changes from index.html
window.addEventListener('storage', function(e) {
  if (e.key === 'lang') {
    window.currentLang = e.newValue || 'en';
    renderGems();
    updateInfo();
  }
});

// ========================================
// CHECK QR CODE UNLOCK
// ========================================

function checkQRUnlock() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('access');

  if (!code) return;

  const validCodes = ['gatsby1', 'vip1'];

  if (validCodes.includes(code)) {
    unlockGuide(90);
  }
}
