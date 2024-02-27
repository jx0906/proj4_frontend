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

  // Context.Provider will make the variable a global one through UseContext
  // OutletContext only for the immediate child through useOutletContext
  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Flex
          direction="column"
          position={"relative"}
          style={{ minHeight: "200vh" }}
        >
          <Header user={user} setUser={setUser} />
          <main style={{ flexGrow: "1" }}>
            <Container size="xl">
              <Outlet user={user} setUser={setUser} />
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
