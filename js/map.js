let map;

function initMap(places,userLocation){

 map=L.map('map').setView(
  [userLocation.lat,userLocation.lng],
  12
 );

 L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
   attribution:'© OpenStreetMap'
  }
 ).addTo(map);

 const unlocked = hasAccess();

 places.forEach((place,index)=>{

  const locked = !unlocked && index>=2;

  const marker=L.marker([place.lat,place.lng]).addTo(map);

  if(locked){

   marker.bindPopup(
    `<b>Hidden place</b><br>
    ${place.address}<br>
    <button onclick="openUnlockModal()">Unlock</button>`
   );

  }else{

   marker.bindPopup(
    `<b>${place.name}</b><br>
    ${place.address}<br>
    <a target="_blank"
    href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}">
    Navigate
    </a>`
   );

  }

 });

}