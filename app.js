// Distance helper (Haversine)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return +(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

// Load JSON and build the page
fetch('data/places.json')
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById('places-container');

    // Get user location
    navigator.geolocation.getCurrentPosition(
      position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Add distance + sort
        data.forEach(place => {
          place.distance = getDistanceKm(
            userLat,
            userLng,
            place.lat,
            place.lng
          );
        });

        data.sort((a, b) => a.distance - b.distance);

        buildCards(data);
      },
      () => {
        console.warn('Location denied – showing without distance');
        buildCards(data);
      }
    );

    function buildCards(places) {
      container.innerHTML = '';

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

        place.photos.forEach((photo, idx) => {
          const img = document.createElement('img');
          img.src = photo;
          if (idx === 0) img.classList.add('active');
          carousel.appendChild(img);
        });

        card.appendChild(carousel);

        // Notes
        if (place.notes) {
          const p = document.createElement('p');
          p.textContent = place.notes;
          card.appendChild(p);
        }

        // 📞 Telephone
        if (place.tel) {
          const tel = document.createElement('div');
          tel.innerHTML = `📞 <a href="tel:${place.tel}">${place.tel}</a>`;
          card.appendChild(tel);
        }

        // 📍 Address + distance
        if (place.address) {
          const addr = document.createElement('div');
          addr.textContent = place.distance
            ? `📍 ${place.address} (${place.distance} km)`
            : `📍 ${place.address}`;
          card.appendChild(addr);
        }

        // 🧭 Google Maps button
        if (place.lat && place.lng) {
          const goBtn = document.createElement('a');
          goBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
          goBtn.target = '_blank';
          goBtn.className = 'go-btn';
          goBtn.textContent = '🧭 Go';
          card.appendChild(goBtn);
        }

        // Affiliate buttons
        if (place.affiliate_links) {
          const cta = document.createElement('div');
          cta.className = 'cta';

          for (const [key, link] of Object.entries(place.affiliate_links)) {
            const a = document.createElement('a');
            a.href = link;
            a.target = '_blank';
            a.rel = 'sponsored';
            a.textContent =
              key === 'booking' ? 'Book Nearby' : 'Book Experience';
            cta.appendChild(a);
          }

          card.appendChild(cta);
        }

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
    }
  })
  .catch(err => console.error(err));
