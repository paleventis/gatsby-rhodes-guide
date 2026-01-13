const CATEGORY_FILTER = window.PAGE_CATEGORY;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

navigator.geolocation.getCurrentPosition(
  pos => loadPlaces(pos.coords.latitude, pos.coords.longitude),
  () => loadPlaces(null, null)
);

function loadPlaces(userLat, userLng) {
  fetch('data/places.json')
    .then(r => r.json())
    .then(data => {
      let places = data.filter(p => CATEGORY_FILTER.includes(p.category));

      if (userLat && userLng) {
        places.forEach(p => {
          p.distance = haversine(userLat, userLng, p.lat, p.lng);
        });
        places.sort((a,b) => a.distance - b.distance);
      }

      const container = document.getElementById('places-container');

      places.forEach(p => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        card.innerHTML = `
          <img src="${p.photos[0]}" alt="">
          <h2>${p.name}</h2>
          <p>${p.notes || ''}</p>
          <div class="meta">
            📍 ${p.address}<br>
            ${p.distance ? `(${p.distance.toFixed(1)} km away)` : ''}
          </div>
          <div class="actions">
            <a href="https://www.google.com/maps?q=${p.lat},${p.lng}" target="_blank">🗺 Go</a>
          </div>
        `;

        container.appendChild(card);
      });
    });
}
