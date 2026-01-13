// ---------------------------
// Places Page JS (Fully Working)
// ---------------------------

// Get category from <body data-category="">
function getCategory() {
  return document.body.dataset.category || null;
}

// Haversine distance in km
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

// User location
let userLocation = null;

// Initialize page
function initPage() {
  // FETCH path relative to HTML file
  fetch('data/places.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('places-container');
      container.innerHTML = '';

      const category = getCategory();
      let places = category ? data.filter(p => p.category === category) : data;

      // Sort by distance if location available
      if (userLocation) {
        places.sort(
          (a, b) =>
            getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
            getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
        );
      }

      if (places.length === 0) {
        container.innerHTML = '<p>No places found for this category.</p>';
        return;
      }

      places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        // Featured badge
        if (place.featured) {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = '⭐ Featured';
          card.appendChild(badge);
        }

        // Name
        const h2 = document.createElement('h2');
        h2.textContent = place.name;
        card.appendChild(h2);

        // Carousel
        const carousel = document.createElement('div');
        carousel.className = 'carousel';
        place.photos.forEach((photo, i) => {
          const img = document.createElement('img');
          img.src = photo; // path relative to HTML
          if (i === 0) img.classList.add('active');
          carousel.appendChild(img);
        });
        card.appendChild(carousel);

        // Notes
        if (place.notes) {
          const p = document.createElement('p');
          p.textContent = place.notes;
          card.appendChild(p);
        }

        // Address + distance
        const info = document.createElement('p');
        let distText = '';
        if (userLocation) {
          const d = getDistance(
            userLocation.lat,
            userLocation.lng,
            place.lat,
            place.lng
          );
          distText = ` (${d.toFixed(1)} km)`;
        }
        info.innerHTML = `📍 ${place.address}${distText}`;
        card.appendChild(info);

        // Phone number
        if (place.phone || place.tel) {
          const phone = document.createElement('p');
          phone.textContent = `📞 ${place.phone || place.tel}`;
          card.appendChild(phone);
        }

        // Google Maps button
        const mapBtn = document.createElement('a');
        mapBtn.href = `https://www.google.com/maps?q=${place.lat},${place.lng}`;
        mapBtn.target = '_blank';
        mapBtn.className = 'map-btn';
        mapBtn.textContent = '🧭 Go';
        card.appendChild(mapBtn);

        container.appendChild(card);

        // Carousel animation
        let current = 0;
        const imgs = carousel.querySelectorAll('img');
        if (imgs.length > 1) {
          setInterval(() => {
            imgs[current].classList.remove('active');
            current = (current + 1) % imgs.length;
            imgs[current].classList.add('active');
          }, 3000);
        }
      });
    })
    .catch(err => {
      console.error(err);
      document.body.innerHTML +=
        '<p style="color:red">Failed to load places.json</p>';
    });
}

// Get geolocation and then initialize
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      initPage();
    },
    err => {
      console.warn('Geolocation denied or failed, using default order.');
      initPage();
    }
  );
} else {
  initPage();
}