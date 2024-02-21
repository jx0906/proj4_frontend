import {
  Flex,
  Title,
  Anchor,
  Image,
  Box,
  Text,
  Card,
  Badge,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import LoaderDots from "../../components/parts/Loader.jsx";
import CarouselCards from "../../components/parts/CarouselCards.jsx";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./RecipeList.module.css";
import { IconClock, IconSchool, IconToolsKitchen3 } from "@tabler/icons-react";

export default function RecipeList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sendRequest } = useFetch();
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async () => {
    try {
      const recpData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe`,
        "GET"
      );
      // recpData returns as an object. need to get array to use map function below
      setData(recpData.recipes);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <LoaderDots />
      ) : (
        <>
          <CarouselCards />

          <Flex
            gap="xs"
            justify="flex-start"
            align="center"
            wrap="wrap"
            mt="sm"
          >
            {data.map((recipe) => (
              <Anchor
                key={recipe._id}
                component={Link}
                to={`/recipe/${recipe._id}`}
                underline="none"
                display="block"
                w={
                  isPc
                    ? `calc(33.3333% - var(--mantine-spacing-xl) * 2 / 3`
                    : `100%`
                }
              >
                <Flex direction="column" w="100%" h="100%">
                  <Card shadow="sm" padding="xs" radius="md" withBorder>
                    <Card.Section>
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        className={classes.image}
                        height={160}
                      />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                      <Text fw={600}>{recipe.name}</Text>
                      {/* <Badge color="pink">On Sale</Badge> */}
                      <Box w="100%" mt="auto">
                        <Flex align="center" gap="xs" mt="xs">
                          <Flex align="center" gap="5px">
                            <IconToolsKitchen3 w="sm" h="sm" stroke={1.5} />
                            <Text c="black" lh="1">
                              {recipe.category}
                            </Text>
                            {/* </Flex>
                      <Flex align="center" gap="5px"> */}
                            <IconSchool w="sm" h="sm" stroke={1.5} />
                            <Text c="black" lh="1">
                              {recipe.levelOfDiff}
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </Group>

                    {/* <Text size="sm" c="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and
        activities on and around the fjords of Norway
      </Text> */}
                  </Card>
                </Flex>
              </Anchor>
            ))}
          </Flex>
        </>
      )}
    </>
  );
}
