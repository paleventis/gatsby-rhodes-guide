import React, { useEffect, useState } from "react";
import places from "../data/places.json";
import { getDistanceKm } from "../utils/distance";

const RestaurantList = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => console.warn("Location permission denied")
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const sorted = places
      .filter(p => p.category === "restaurant" || p.category === "beachbar")
      .map(p => ({
        ...p,
        distance: getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          p.lat,
          p.lng
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    setRestaurants(sorted);
  }, [userLocation]);

  return (
    <div>
      {restaurants.map(r => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          {/* FIRST IMAGE */}
          {r.photos?.[0] && (
            <img
              src={require(`../${r.photos[0]}`)}
              alt={r.name}
              style={{
                width: "100%",
                maxHeight: "220px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
          )}

          <h3>{r.name}</h3>

          {r.tel && (
            <div>📞 <a href={`tel:${r.tel}`}>{r.tel}</a></div>
          )}

          <div>
            📍 {r.address} ({r.distance} km)
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "7px 14px",
              background: "#1e88e5",
              color: "#fff",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            🧭 Go
          </a>
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
