import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Image,
  Text,
  Title,
  Box,
  Stack,
  Group,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pathId = location.pathname.split("/")[2];
  // const { formatTime } = useCheckBooking();
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      const recpData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/${pathId}`,
        "GET"
      );
      console.log(recpData);
      // const formattedTimeOpen = resData.timeOpen
      //   ? formatTime(resData.timeOpen)
      //   : null;
      // const formattedTimeClose = resData.timeClose
      //   ? formatTime(resData.timeClose)
      //   : null;
      setData(
        recpData
        // {...recpData,
        // timeOpen: formattedTimeOpen,
        // timeClose: formattedTimeClose,}
      );
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
                  {data.servingSize ? `${data.servingSize} servings` : "-"}
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
                <Box w="40%" px="xs">
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {data.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </Box>

                <Box w="60%" px="xs">
                  <Text>{data.instructions}</Text>
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
