// Load JSON and build the page
fetch('data/places.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('places-container');

    data.forEach(place => {
      const card = document.createElement('div');
      card.className = 'restaurant-card';

      // Featured badge
      if(place.featured) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = '⭐ Featured';
        card.appendChild(badge);
      }

      // Name
      const h2 = document.createElement('h2');
      h2.textContent = place.name;
      card.appendChild(h2);

      // Carousel container
      const carousel = document.createElement('div');
      carousel.className = 'carousel';
      place.photos.forEach((photo, idx) => {
        const img = document.createElement('img');
        img.src = photo;
        if(idx === 0) img.classList.add('active');
        carousel.appendChild(img);
      });
      card.appendChild(carousel);

      // Notes
      const p = document.createElement('p');
      p.textContent = place.notes || '';
      card.appendChild(p);

      // Affiliate buttons
      const cta = document.createElement('div');
      cta.className = 'cta';

      if(place.affiliate_links) {
        for(const [key, link] of Object.entries(place.affiliate_links)) {
          const a = document.createElement('a');
          a.href = link;
          a.target = '_blank';
          a.rel = 'sponsored';
          a.textContent = key === 'booking'
            ? 'Book Nearby'
            : 'Book Experience';
          cta.appendChild(a);
        }
      }

      card.appendChild(cta);
      container.appendChild(card);

      // Simple carousel animation
      let current = 0;
      const imgs = carousel.querySelectorAll('img');
      setInterval(() => {
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('active');
      }, 3000);
    });
  })
  .catch(err => console.error(err));
