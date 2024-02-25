/*main.jsx for entry point logic, ie codes for boostrapping the app and rendering the root component (ie, App)
wrapped in various context providers such as react, router and mantine */
import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import UserLogin from "./pages/user/Login.jsx";
import UserSignUp from "./pages/user/Signup.jsx";
import RecipeList from "./pages/recipe/RecipeList.jsx";
import Recipe from "./pages/recipe/Recipe.jsx";
import NewRecipe from "./pages/recipe/NewRecipe.jsx";
import NotFound from "./pages/error/NotFound.jsx";

// import styles of Mantine packages
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dropzone/styles.css";

// https://mantine.dev/theming/default-theme/
const theme = createTheme({
  fontFamily: "Helvetica, sans-serif",
  defaultRadius: "md",
  cursorType: "pointer",
  //https://mantine.dev/colors-generator/?color=C91A52
  primaryColor: "red",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <MantineProvider theme={theme}>
        <Notifications position="top-right" />
        <Routes>
          <Route path="/" element={<App />}>
            {/* Root */}
            <Route index element={<RecipeList />} />

            {/* User */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignUp />} />

            {/* Recipes */}
            <Route path="/recipe/:id" element={<Recipe />} />
            <Route path="/recipe/create" element={<NewRecipe />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MantineProvider>
    </Router>
  </React.StrictMode>
);
