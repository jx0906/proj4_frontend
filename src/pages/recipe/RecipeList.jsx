import {
  Flex,
  Title,
  Anchor,
  Image,
  Box,
  Text,
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
      setData(recpData);
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
            gap="xl"
            justify="flex-start"
            align="stretch"
            wrap="wrap"
            mt="xl"
          >
            {/*
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
                  {recipe.image ? (
                    <Box
                      w="100%"
                      h={200}
                      style={{
                        overflow: "hidden",
                        borderRadius: "var(--mantine-radius-md)",
                      }}
                      className={classes.image}
                    >
                      <Image
                        src={recipe.image}
                        alt={recipe.name}
                        w="100%"
                        h="100%"
                      ></Image>
                    </Box>
                  ) : (
                    <Flex
                      radius="md"
                      w="100%"
                      h={200}
                      bg="gray.2"
                      align="center"
                      justify="center"
                      className={classes.image}
                      style={{
                        borderRadius: "var(--mantine-radius-md)",
                      }}
                    >
                      <Text c="gray" ta="center">
                        No Image
                      </Text>
                    </Flex>
                  )}

                  <Title order={3} mt="sm" lineClamp={2}>
                    {recipe.name}
                  </Title>
                  <Box w="100%" mt="auto">
                    <Flex align="center" gap="xs" mt="xs">
                      <Flex align="center" gap="5px">
                        <IconToolsKitchen3 w="sm" h="sm" stroke={1.5} />
                        <Text c="black" lh="1">
                          {recipe.category}
                        </Text>
                      </Flex>
                      <Flex align="center" gap="5px">
                        <IconSchool w="sm" h="sm" stroke={1.5} />
                        <Text c="black" lh="1">
                          {recipe.levelOfDiff}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex align="center" gap="5px" style={{ marginTop: "5px" }}>
                      <IconClock w="sm" h="sm" stroke={1.5} />
                      <Text c="black" lh="1">
                        {recipe.timeRequired}
                      </Text>
                    </Flex>

                    <Text
                      c="black"
                      size="sm"
                      lineClamp={1}
                      style={{ marginTop: "5px" }}
                    >
                      {restaurant.address}
                    </Text>
                  </Box>
                </Flex>
              </Anchor>
            ))}*/}
          </Flex>
        </>
      )}
    </>
  );
}
