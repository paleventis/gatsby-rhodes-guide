import React from "react";
import RestaurantList from "../components/RestaurantList";

export default function IndexPage() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>Restaurants Near You</h1>
      <RestaurantList />
    </main>
  );
}
