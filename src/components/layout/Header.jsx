// disable specific ESLint rules for the file or portion of code to facilitate temp testing.
/* eslint-disable react-hooks/rules-of-hooks, no-unused-vars, react/prop-types */

import cx from "clsx";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  UnstyledButton,
  Group,
  Text,
  Menu,
  rem,
  useMantineTheme,
  Button,
  Title,
  Image,
  Anchor,
  TextInput,
} from "@mantine/core";
import { useInputState } from "@mantine/hooks";
import {
  IconBucket,
  IconShoppingCartSearch,
  IconChevronDown,
  IconNotes,
  IconSearch,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./HeaderTabs.module.css";
import logo from "../../assets/logo.png";
import useToast from "../../hooks/useToast";
import useFetch from "../../hooks/useFetch";
import { logOut } from "../../service/users";

export const Header = ({ user, setUser }) => {
  // const { user, setUser } = useContext(UserContext);
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useInputState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { successToast, errorToast } = useToast();
  const { sendRequest } = useFetch();

  const handleLogout = () => {
    try {
      const res = sendRequest(
        `${import.meta.env.VITE_API_URL}/user/logout`,
        "POST",
        { email: user.email }
      );
      logOut();
      setUser(null);
      navigate("/");
      successToast({
        title: "See you again!",
        message: "You have successfully logged out.",
      });
    } catch (err) {
      console.log(err);
      errorToast({
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="xl">
        <Group justify="space-between">
          <Title
            order={1}
            style={{
              color: theme.colors.red[6],
              textDecoration: "none",
            }}
          >
            <Anchor component={Link} to="/">
              <Image src={logo} h={45} w="auto" fit="fill" />
            </Anchor>
          </Title>

          <Group>
            {/* Search Field */}
            <TextInput
              placeholder="What are you looking for?"
              value={searchTerm} // Pass the searchTerm value to the input
              leftSection={
                <IconSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                  onClick={() => navigate(`/recipe/search?${searchTerm}`)}
                />
              }
              visibleFrom="xs"
              onChange={(event) => setSearchTerm(event.currentTarget.value)} // Update searchTerm when input changes
              onKeyDown={(evt) => {
                if (evt.key === "Enter") {
                  // Navigate when Enter is pressed
                  navigate(`/recipe/search?${searchTerm}`);
                }
              }}
            />
            {/* Auth Buttons*/}
            {!user &&
              location.pathname !== "/login" &&
              location.pathname !== "/signup" && (
                <>
                  <Button variant="outline" component={Link} to="/login">
                    Login
                  </Button>
                  <Button component={Link} to="/signup">
                    Sign up
                  </Button>
                </>
              )}
          </Group>

          {/* User Menu */}
          {user && (
            <Menu
              width={260}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group gap={7}>
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      Hello {user?.name}!
                    </Text>
                    <IconChevronDown
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to="/account/recipe"
                  leftSection={
                    <IconBucket
                      style={{ width: rem(16), height: rem(16) }}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                >
                  My Collection
                </Menu.Item>
                <>
                  <Menu.Item
                    component={Link}
                    to="/account/notes"
                    leftSection={
                      <IconNotes
                        style={{ width: rem(16), height: rem(16) }}
                        color={theme.colors.yellow[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    My Notes
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to="/butler/pricekaki"
                    leftSection={
                      <IconShoppingCartSearch
                        style={{ width: rem(16), height: rem(16) }}
                        color={theme.colors.blue[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    My Shopping List
                  </Menu.Item>
                </>
                {/* <Menu.Item
                  component={Link}
                  to="/account"
                  leftSection={
                    <IconSettings
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                >
                  Account settings
                </Menu.Item> */}
                <Menu.Item
                  leftSection={
                    <IconLogout
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </div>
  );
};
