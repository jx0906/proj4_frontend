import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Flex } from "@mantine/core";
// import { Header } from "./Header";
import { Footer } from "./Footer";
// import { getUser } from "../../service/users";

export const Layout = () => {
  // const [user, setUser] = useState(getUser());

  return (
    <Flex
      direction="column"
      position={"relative"}
      style={{ minHeight: "100vh" }}
    >
      <h2>layout.jsx</h2>
      {/* <Header /> */}
      {/* user={user} setUser={setUser} */}
      {/* <main style={{ flexGrow: "1", padding: "40px 0" }}>
        <Container size="md">
          <Outlet context={{ user, setUser }} />
        </Container>
      </main> */}
      <Footer />
    </Flex>
  );
};
