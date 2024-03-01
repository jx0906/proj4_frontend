/* eslint-disable react/prop-types */
import {
  Anchor,
  Flex,
  Text,
  Card,
  Stack,
  Box,
  Image,
  useMantineTheme,
  Title,
} from "@mantine/core";
import { IconSchool, IconToolsKitchen3 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import LoaderDots from "../../components/parts/Loader";
import { useMediaQuery } from "@mantine/hooks";
import { UserContext } from "../../App.jsx";

export default function UserRecipeCollection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sendRequest } = useFetch();
  const { user } = useContext(UserContext);
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);

  useEffect(() => {
    const fetchData = async () => {
      let userCollection, userCreatedRecp, userBookmarks;
      try {
        userCreatedRecp = await getCreations();
        userBookmarks = await getBookmarks();

        if (userCreatedRecp && userBookmarks) {
          userCollection = [...userCreatedRecp, ...userBookmarks];
        } else if (!userCreatedRecp) {
          userCollection = [...userBookmarks];
        } else {
          userCollection = [...userCreatedRecp];
        }

        setData(userCollection);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    fetchData();
    window.scrollTo(0, 0);
  }, []); //else it will just keep running indefinitely

  const getCreations = async () => {
    try {
      const creations = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/user`,
        "GET"
      );
      // recpData returns as an object. need to get array to use map function below
      return creations.recipes;
    } catch (err) {
      console.error("Error fetching user created data:", err);
    }
  };

  const getBookmarks = async () => {
    try {
      const bookmarks = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/search?bookmarkedUser=${
          user.id
        }`,
        "GET"
      );
      // recpData returns as an object. need to get array to use map function below
      return bookmarks.recipes;
    } catch (err) {
      console.error("Error fetching bookmark data:", err);
    }
  };

  const uniqueRecipes = Array.from(
    new Set(data.map((recipe) => recipe._id))
  ).map((id) => {
    return data.find((recipe) => recipe._id === id);
  });

  return (
    <>
      <Title order={3} mt="sm" lineClamp={2}>
        My Recipe Collection
      </Title>
      <Flex
        gap="xs"
        justify="flex-start"
        align="center"
        wrap="wrap"
        mt="sm"
        h="100px"
      >
        {loading ? (
          <LoaderDots />
        ) : (
          <>
            {uniqueRecipes.map((recipe) => (
              <Anchor
                key={recipe._id}
                component={Link}
                to={`/recipe/${recipe._id}`}
                underline="none"
                display="block"
                w={
                  isPc ? `calc(20% - var(--mantine-spacing-xs) * 4 / 5` : `100%`
                }
              >
                <Flex direction="column" w="100%">
                  <Card shadow="sm" padding="xs" radius="md" withBorder>
                    <Card.Section>
                      <Box
                        w="100%"
                        h={200}
                        style={{
                          overflow: "hidden",
                          borderRadius: "var(--mantine-radius-md)",
                        }}
                      >
                        {recipe.image && (
                          <Image
                            src={
                              recipe.image.imgName
                                ? recipe.image.imgName
                                : recipe.image.imgname
                            }
                            alt={recipe.name}
                            w="100%"
                            h="100%"
                          ></Image>
                        )}
                      </Box>
                    </Card.Section>

                    <Stack
                      h={130}
                      bg="var(--mantine-color-body)"
                      align="flex-start"
                      gap="xs"
                    >
                      <Text size="md" fw={600}>
                        {recipe.name}
                      </Text>
                      <Box w="25%">
                        <Flex align="center" gap="xs" mt="xs">
                          <Flex align="center" gap="5px">
                            <IconToolsKitchen3 w="sm" h="sm" stroke={1.5} />
                            <Text size="sm" c="black" lh="1">
                              {recipe.category}
                            </Text>
                            <IconSchool w="sm" h="sm" stroke={1.5} />
                            <Text size="sm" c="black" lh="1">
                              {recipe.levelOfDiff}
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </Stack>
                  </Card>
                </Flex>
              </Anchor>
            ))}
          </>
        )}
      </Flex>
    </>
  );
}
