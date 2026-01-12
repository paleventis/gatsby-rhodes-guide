// 📍 Use my location
const locationBtn = document.getElementById('use-location');

if (locationBtn) {
  locationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        window.location.href =
          `restaurants.html?lat=${latitude}&lng=${longitude}#restaurants`;
      },
      () => alert('Location access denied.')
    );
  });
}

// 🌍 Language switch
const translations = {
  en: {
    title: "Rhodes Island",
    subtitle: "Discover • Taste • Explore • Experience"
  },
  fr: {
    title: "Île de Rhodes",
    subtitle: "Découvrir • Goûter • Explorer • Vivre"
  },
  de: {
    title: "Insel Rhodos",
    subtitle: "Entdecken • Genießen • Erkunden • Erleben"
  }
};

document.querySelectorAll('.lang-switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    document.querySelector('h1').textContent = translations[lang].title;
    document.querySelector('.hero p').textContent = translations[lang].subtitle;
  });
});
