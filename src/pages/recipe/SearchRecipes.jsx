/* eslint-disable react/prop-types */
import {
  Anchor,
  Flex,
  Text,
  Card,
  Stack,
  Box,
  Image,
  Title,
  useMantineTheme,
  Group,
  Select,
  Button,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSchool, IconToolsKitchen3 } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import LoaderDots from "../../components/parts/Loader";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./RecipeList.module.css";

export default function searchRecipes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sendRequest } = useFetch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = location.search.slice(1); //location.search = ?{searchKeywords}
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);

  useEffect(() => {
    getData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const getData = async () => {
    try {
      const recpData = await sendRequest(
        `${
          import.meta.env.VITE_API_URL
        }/recipe/search?searchTerm=${searchTerm}`,
        "GET"
      );
      setData(recpData.recipes);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const form = useForm({});

  const handleClearFilter = () => {
    form.reset();
    setLoading(true);
  };

  const filterList = async () => {
    setLoading(true);
    let recpLevelOfDiff;
    let recpCategory;
    let recpTimeRequired;
    // let recpSource;

    const searchCriteria = {
      category: form.values.category,
      levelOfDiff: form.values.levelOfDiff,
    };

    const filterParams = (input) => {
      // Use reduce to accumulate the filter string
      // alternative - const filterParams = (input) => { return Object.entries(input).map(([key, value]) => `${key}=${value}&`).join('');};

      const filterString = Object.entries(input).reduce(
        (accumulator, [key, value]) => {
          return `${accumulator}${key}=${value}&`;
        },
        ""
      );

      // Remove the trailing ampersand
      return filterString.slice(0, -1);
    };

    const recpData = await sendRequest(
      `${import.meta.env.VITE_API_URL}/recipe/search?searchTerm=${filterParams(
        form.values
      )}`,
      "GET"
    );
    setData(resData);
    setLoading(false);
  };

  return (
    <>
      {/* <form
          onSubmit={form.onSubmit(() => {
            filterList();
          })}
        >
          <Group
            align="flex-start"
            mb="xl"
            miw={!isPc ? "calc(50% - 12px)" : "150px"}
          >
            <Select
              label="Category"
              placeholder="Pick one"
              data={["Pastries", "Biscuits", "Bread", "Cakes"]}
              searchable
              {...form.getInputProps("category")}
            />
            <Select
              label="Level of Difficulty"
              placeholder="Pick one"
              data={["Easy", "Intermediate", "Advanced"]}
              searchable
              {...form.getInputProps("levelOfDiff")}
            />
            <NumberInput
              label="Time Required"
              withAsterisk
              placeholder="in minutes"
              min={0}
              {...form.getInputProps("timeRequired")}
            />
  
            <Button type="submit" mt="25px">
              Filter
            </Button>
            <Button
              mt="25px"
              variant="outline"
              onClick={handleClearFilter}
              disabled={!form.isDirty()}
            >
              Clear
            </Button>
          </Group>
        </form> */}
      {loading ? (
        <LoaderDots />
      ) : !data || data.length === 0 ? (
        <Title order={3} mt="sm" lineClamp={2}>
          Sorry, there were no results for your query. Please try another
          search.
        </Title>
      ) : (
        <>
          <Title order={3} mt="sm" lineClamp={2}>
            Were you looking for these?
          </Title>
          <Flex
            gap="xs"
            justify="flex-start"
            align="center"
            wrap="wrap"
            mt="sm"
            h="100px"
          >
            {data.map((recipe) => (
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
                        className={classes.image}
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
          </Flex>
        </>
      )}
    </>
  );
}
