//for overall app structure, ie routes and navigation
import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
      </Routes>
    </>
  );
}

export default App;
