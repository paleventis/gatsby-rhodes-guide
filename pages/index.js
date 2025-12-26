import React from "react";
import RestaurantList from "../components/RestaurantList";

export default function IndexPage() {
  return (
    <main style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h1>Nearby Restaurants</h1>
      <RestaurantList />
    </main>
  );
}
