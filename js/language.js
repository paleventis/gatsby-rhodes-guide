<script>
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
</script>
