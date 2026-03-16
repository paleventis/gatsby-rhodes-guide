
// ---------------------------
// Places Page JS (FULL VERSION)
// ---------------------------

// Gatsby Rhodes Villas fallback location
const unlocked = hasAccess();
const villaLocation = {
  lat: 36.2553,
  lng: 28.1676
};

// Get category from <body data-category="">
function getCategory() {
  return document.body.dataset.category || null;
}

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

// User location
let userLocation = null;

// Initialize page
function initPage() {

  fetch('data/places.json')
    .then(res => res.json())
    .then(data => {

      const container = document.getElementById('places-container');
      container.innerHTML = '';

      const category = getCategory();

      let places = category
        ? data.filter(p => p.category === category)
        : data;

      // Sort by nearest
      if (userLocation) {
        places.sort((a, b) =>
          getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
          getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
        );
      }

      if (places.length === 0) {
        container.innerHTML = '<p>No places found.</p>';
        return;
      }

      places.forEach((place,index) => {

     const locked = !unlocked && index >= 2;

        const card = document.createElement('div');
        card.className = 'restaurant-card';

        // Name
        const title = document.createElement('h2');
        title.textContent = locked ? "Hidden location" : place.name;
        card.appendChild(title);

        // ---------------------------
        // Image carousel
        // ---------------------------

        const carousel = document.createElement('div');
        carousel.className = 'carousel';

        place.photos.forEach((photo, i) => {
          const img = document.createElement('img');
          img.src = photo;

          if (i === 0) img.classList.add('active');
          
          if (locked) {
          img.style.filter = "blur(6px)";
          img.style.opacity = "0.4";
          }


          carousel.appendChild(img);
        });

       


 // Featured badge
        if (place.featured) {

          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = '⭐ Featured';

          carousel.appendChild(badge);
        }

        card.appendChild(carousel);

        // ---------------------------
        // Notes
        // ---------------------------

        if (place.notes) {

          const p = document.createElement('p');
          p.textContent = place.notes;

          card.appendChild(p);
        }

        // ---------------------------
        // Address + distance
        // ---------------------------

        const info = document.createElement('p');

        let distanceText = '';

        if (userLocation) {

          const d = getDistance(
            userLocation.lat,
            userLocation.lng,
            place.lat,
            place.lng
          );

          distanceText = `<br>📏 ${d.toFixed(1)} km from you`;

        } else {

          const d = getDistance(
            villaLocation.lat,
            villaLocation.lng,
            place.lat,
            place.lng
          );

          distanceText = `<br>📏 ${d.toFixed(1)} km from Gatsby Rhodes Villas`;
        }

        info.innerHTML = `📍 ${place.address}${distanceText}`;
        card.appendChild(info);

        // ---------------------------
        // Phone
        // ---------------------------

        if (place.phone || place.tel) {

          const phone = document.createElement('p');

          phone.textContent = `📞 ${place.phone || place.tel}`;


          card.appendChild(phone);
        }

        // ---------------------------
        // Google Maps navigation
        // ---------------------------

        const mapBtn = document.createElement('a');

        // Determine origin: user location or villa location
        let origin;
        if (userLocation) {
          origin = `${userLocation.lat},${userLocation.lng}`;
        } else {
          origin = `${villaLocation.lat},${villaLocation.lng}`;
        }

        // Destination: place coordinates and address
        const destination = `${place.lat},${place.lng}`;
        const destinationName = encodeURIComponent(place.address);

        // Google Maps Directions API URL
        // Using both coordinates and address for better accuracy
       if(!locked){
 mapBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_name=${destinationName}&travelmode=driving`;

        mapBtn.target = '_blank';
        mapBtn.className = 'map-btn';
        mapBtn.textContent = '🧭 Go';

        card.appendChild(mapBtn);
}else{
mapBtn.href="#";
 mapBtn.textContent="Unlock to Go";
 mapBtn.style.background="gray";
 mapBtn.onclick = openUnlockModal;
}
       if(locked){

 const unlockBtn = document.createElement("button");

 unlockBtn.className = "unlock-btn";
 unlockBtn.textContent = "Unlock";

 unlockBtn.onclick = openUnlockModal;

 card.appendChild(unlockBtn);

}

        container.appendChild(card);

        // ---------------------------
        // Carousel animation
        // ---------------------------

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

// ---------------------------
// Geolocation
// ---------------------------

if (navigator.geolocation) {

  navigator.geolocation.getCurrentPosition(

    pos => {

      userLocation = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      initPage();
    },

    () => {

      userLocation = villaLocation;

      initPage();
    }
  );

} else {

  userLocation = villaLocation;

  initPage();
}
