//for overall app structure, ie routes and navigation
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} />
        {/* Root */}
        {/* <Route index element={<RestaurantList />} /> */}
      </Routes>
    </>
  );
}

export default App;
