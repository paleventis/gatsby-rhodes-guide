const CATEGORY_FILTER = window.PAGE_CATEGORY || [];

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

navigator.geolocation.getCurrentPosition(
  pos => loadPlaces(pos.coords.latitude, pos.coords.longitude),
  () => loadPlaces(null, null)
);

function loadPlaces(userLat, userLng) {
  fetch('data/places.json')
    .then(r => r.json())
    .then(data => {
      let places = data.filter(p =>
        CATEGORY_FILTER.includes(p.category)
      );

      if (userLat && userLng) {
        places.forEach(p => {
          p.distance = haversine(userLat, userLng, p.lat, p.lng);
        });
        places.sort((a, b) => a.distance - b.distance);
      }

      const container = document.getElementById('places-container');
      container.innerHTML = '';

      if (!places.length) {
        container.innerHTML = '<p>No places found.</p>';
        return;
      }

      places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        // Carousel
        const carousel = document.createElement('div');
        carousel.className = 'carousel';

        place.photos.forEach((photo, i) => {
          const img = document.createElement('img');
          img.src = photo;
          if (i === 0) img.classList.add('active');
          carousel.appendChild(img);
        });

        card.appendChild(carousel);

        // Title
        const h2 = document.createElement('h2');
        h2.textContent = place.name;
        card.appendChild(h2);

        // Notes
        if (place.notes) {
          const p = document.createElement('p');
          p.textContent = place.notes;
          card.appendChild(p);
        }

        // Meta
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.innerHTML = `
          📍 ${place.address}<br>
          ${place.phone ? `📞 <a href="tel:${place.phone}">${place.phone}</a><br>` : ''}
          ${place.distance ? `(${place.distance.toFixed(1)} km away)` : ''}
        `;
        card.appendChild(meta);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'actions';

        const go = document.createElement('a');
        go.href = `https://www.google.com/maps?q=${place.lat},${place.lng}`;
        go.target = '_blank';
        go.textContent = '🗺 Go';

        actions.appendChild(go);
        card.appendChild(actions);

        container.appendChild(card);

        // Carousel animation
        const imgs = carousel.querySelectorAll('img');
        let current = 0;

        if (imgs.length > 1) {
          setInterval(() => {
            imgs[current].classList.remove('active');
            current = (current + 1) % imgs.length;
            imgs[current].classList.add('active');
          }, 3000);
        }
      });
    });
}
