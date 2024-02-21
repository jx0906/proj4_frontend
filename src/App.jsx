//for overall app structure, ie routes and navigation
import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";
import { Container, Flex } from "@mantine/core";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
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
        <Flex
          direction="column"
          position={"relative"}
          style={{ minHeight: "100vh" }}
        >
          <Header />
          <main style={{ flexGrow: "1" }}>
            <Container size="sm">
              <Outlet />
            </Container>
          </main>
          <Footer />
        </Flex>
      </UserContext.Provider>
    </>
  );
}

export default App;
export { UserContext };
