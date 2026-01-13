fetch('../data/places.json')
  .then(r => r.json())
  .then(data => {
    const container = document.getElementById('places-container');
    container.innerHTML = '';

    data.forEach(place => {
      const div = document.createElement('div');
      div.style.padding = '12px';
      div.style.border = '1px solid #ccc';
      div.style.margin = '8px';
      div.textContent = place.name;
      container.appendChild(div);
    });
  })
  .catch(err => {
    document.body.innerHTML = '<pre>' + err + '</pre>';
  });
