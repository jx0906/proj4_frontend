import { useLocation } from "react-router-dom";
import {
  Image,
  Text,
  Title,
  Box,
  Stack,
  Flex,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState, useContext } from "react";
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
import { UserContext } from "../../App.jsx";

function Recipe() {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();
  const { sendEdamamRequest, derivedLevelofDiff, formattedCategories } =
    useEdamam();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);
  const location = useLocation();
  const pathId = location.pathname.includes("edam")
    ? location.pathname.split("/")[2].slice(0, -4)
    : location.pathname.split("/")[2];

  useEffect(() => {
    console.log(user);
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      let fetchedData;
      if (location.pathname.includes("edam")) {
        const edamamRecp = await sendEdamamRequest(
          `https://api.edamam.com/api/recipes/v2/${pathId}?type=public&app_id=06f16e1e&app_key=c06c81514c5f0c114da3fa25ac9cc76a&field=label&field=image&field=images&field=source&field=url&field=yield&field=healthLabels&field=ingredientLines&field=ingredients&field=calories&field=totalTime&field=dishType`
        );
        // console.log(edamamRecp);

        fetchedData = {
          edamamId: `${pathId}`,
          name: edamamRecp.recipe.label,
          category: formattedCategories(edamamRecp.recipe.dishType[0]),
          levelOfDiff: derivedLevelofDiff(edamamRecp.recipe.ingredientLines),
          timeRequired: edamamRecp.recipe.totalTime,
          servings: edamamRecp.recipe.yield,
          ingredients: edamamRecp.recipe.ingredients.map((ingredient) => {
            return {
              quantity: ingredient.quantity,
              unit: ingredient.measure !== "<unit>" ? ingredient.measure : "",
              name: ingredient.food,
              key: ingredient.foodId,
            };
          }),
          instructions: "",
          description: "",
          source: edamamRecp.recipe.source,
          image: { imgName: edamamRecp.recipe.image },
          healthLabels: edamamRecp.recipe.healthLabels,
          calories: edamamRecp.recipe.calories,
          bookmarked: [],
          url: edamamRecp.recipe.url,
        };
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
              {data.image && data.image.imgName && (
                <Image
                  src={data.image.imgName}
                  alt={data.name}
                  className={classes.image}
                  w="90%"
                  h="auto"
                  mt="lg"
                  radius="md"
                ></Image>
              )}
              <UserActions recipeData={data} user={user} pathId={pathId} />
              <Text mt="md">
                {data.description === "" ? (
                  <>
                    {" "}
                    This recipe is from <a href={data.source}>
                      {data.source}
                    </a>{" "}
                    and is associated with {data.healthLabels[0]},{" "}
                    {data.healthLabels[1]} and {data.healthLabels[2]} diets,
                    amongst others. It packs a total of{" "}
                    {parseInt(data.calories)} calories for the each serving.
                    Give it a try if it appeals to you today!
                  </>
                ) : (
                  data.description
                )}
              </Text>
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
              <Flex direction="row" mt="5px">
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
                  <Text>
                    {data.instructions === "" ? (
                      <>
                        Visit{" "}
                        <a href={data.url} target="_blank">
                          {data.url}
                        </a>{" "}
                        for baking instructions.
                      </>
                    ) : (
                      data.instructions
                    )}
                  </Text>
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
