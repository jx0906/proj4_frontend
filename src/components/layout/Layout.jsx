import { useContext } from "react";
// import { Outlet } from "react-router-dom";
import { Container, Flex } from "@mantine/core";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { UserContext } from "../../App.jsx";

export const Layout = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <Flex
      direction="column"
      position={"relative"}
      style={{ minHeight: "100vh" }}
    >
      <Header user={user} setUser={setUser} />
      <main style={{ flexGrow: "1", padding: "40px 0" }}>
        <Container size="md">
          {/* <Outlet context={{ user, setUser }} /> */}
        </Container>
      </main>
      <Footer />
    </Flex>
  );
};
