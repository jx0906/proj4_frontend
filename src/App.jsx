//for overall app structure, ie routes and navigation
import React, { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./app.css";
import { Layout } from "./components/layout/Layout.jsx";
import UserLogin from "./pages/user/Login.jsx";
import UserSignUp from "./pages/user/Signup.jsx";
import { getUser } from "./service/users";

// dedicated variable to capture all user data
const UserContext = createContext({
  user: null,
  setUser: () => {},
});

function App() {
  const [user, setUser] = useState(getUser());

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<Layout />} />
          {/* Root */}
          {/* <Route index element={<RecipeList />} /> */}

          {/* User */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
export { UserContext };
