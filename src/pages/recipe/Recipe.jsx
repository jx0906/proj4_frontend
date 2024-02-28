import { Link, useLocation } from "react-router-dom";
import {
  Image,
  Text,
  Title,
  Box,
  Stack,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useEdamam from "../../hooks/useEdamam";
import classes from "./RecipeList.module.css";
import { useMediaQuery } from "@mantine/hooks";
import LoaderDots from "../../components/parts/Loader";
import UserActions from "../../components/parts/UserActions";
import {
  IconSoup,
  IconClock,
  IconSchool,
  IconToolsKitchen3,
} from "@tabler/icons-react";

function Recipe() {
  const { sendRequest } = useFetch();
  const {  sendEdamamRequest,
    derivedLevelofDiff,
    formattedCategories,
    edamamRecpUri,
    mappedEdamamRecp, } = useEdamam();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);
  const location = useLocation();
  const pathId = location.pathname.includes("edam")
    ? location.pathname.split("/")[3]
    : location.pathname.split("/")[2];

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      let fetchedData;
      if (location.pathname.includes("edam")) {
        fetchedData = await getEdamamList(
          `https://api.edamam.com/api/recipes/v2/${pathId}?type=public&app_id=06f16e1e&app_key=c06c81514c5f0c114da3fa25ac9cc76a`
        );
      } else {
        fetchedData = await sendRequest(
          `${import.meta.env.VITE_API_URL}/recipe/${pathId}`,
          "GET"
        );
      }

      setData(fetchedData);
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
          <Box w={isPc ? "80%" : "100%"} mx="auto">
            <Stack
              h={100}
              bg="var(--mantine-color-body)"
              align="center"
              gap="xs"
            >
              <Title order={2}>{data.name}</Title>
              {data.description ? (
                <Text mt="md">{data.description}</Text>
              ) : (
                <Text mt="md"></Text>
              )}

              <Flex direction="row" align="center" gap="5px" mt="xs">
                <IconSoup w="sm" h="sm" stroke={1.5} />
                <Text size="sm" c="black" lh="1">
                  {data.servings ? `${data.servings} servings` : "-"}
                </Text>
                <IconClock w="sm" h="sm" stroke={1.5} />
                <Text size="sm" c="black" lh="1">
                  {data.timeRequired} min
                </Text>
                <IconToolsKitchen3 w="sm" h="sm" stroke={1.5} />
                <Text size="sm" c="black" lh="1">
                  {data.category}
                </Text>
                <IconSchool w="sm" h="sm" stroke={1.5} />
                <Text size="sm" c="black" lh="1">
                  {data.levelOfDiff}
                </Text>
              </Flex>

              <UserActions />

              {data.image && (
                <Image
                  src={data.image}
                  alt={data.name}
                  className={classes.image}
                  w="100%"
                  h="auto"
                  mt="lg"
                  radius="md"
                ></Image>
              )}
              <Flex direction="row">
                <Box w="30%" px="xs">
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {data.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {/* Use conditional rendering to display unit */}
                        <strong>{ingredient.quantity}</strong>{" "}
                        {ingredient.unit && <strong>{ingredient.unit}</strong>}{" "}
                        {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </Box>

                <Box w="70%" px="xs">
                  <Text>data.instructions {data.instructions}</Text>
                </Box>
              </Flex>
            </Stack>
          </Box>
        </>
      )}
    </>
  );
}

export default Recipe;
