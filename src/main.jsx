/*main.jsx for entry point logic, ie codes for boostrapping the app and rendering the root component (ie, App)
wrapped in various context providers such as react, router and mantine */
import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";

// import styles of Mantine packages
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

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
        <App />
      </MantineProvider>
    </Router>
  </React.StrictMode>
);
