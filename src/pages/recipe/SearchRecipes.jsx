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

  const form = useForm({
    // validate: {
    //   category: (value) =>
    //     !value && "Please choose a category which best represents your recipe.",
    //   levelOfDiff: (value) =>
    //     !value &&
    //     "Please choose an area which best represents the difficulty of this recipe.",
    //   timeRequired: (value) => !value && "Please enter a time",
    // },
  });

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
                      <Image
                        src={
                          recipe.image && recipe.image.imgname
                            ? recipe.image.imgname
                            : "https://edamam-product-images.s3.amazonaws.com/web-img/564/5648dc3132160f07414fb225f45c1d09.gif?X-Amz-Security-Token=IQoJb3JpZ2luX2VjECcaCXVzLWVhc3QtMSJHMEUCIQCjLwixnaB0iiv3W%2BiHFA5q%2B72wlDdXsWwp2P9c0au5ZgIgBUItkmVyzgD7pZzDvVsEFZE%2F9kTZOzWj59ivjaAZB8gquQUIIBAAGgwxODcwMTcxNTA5ODYiDK9j%2F6XSJKhaHTaaryqWBWHVI9OtYu8i8cvJfiBXwJcdDhsOOWRgA2GJmk6ao1ouKg8Zj9dioXhWoF9eXOn%2B7V4bnbCpg2hKY5tZVN9Vph%2Ba9n%2FSfQiqySqgy%2FN1ctiBwNU6MeEjmXmFZeNSFaBRzw99RMZPDUxaLQeb02NKyy4D45fTyiiokjOkBsiynLah%2FbdThB6FuEkBDjlI2ieY%2FMzcJ68ljAdU%2FKyTOS1pf6%2FZV1lt6lWb3duil1IaWCP%2FB5g7YGL5JFNx5Teezf5%2FhLsJGGFr%2F8PPAZiqQ%2FSpg1wlgcklWIi8KN8iVawTaSHgiiXSs9l6p9ovWxuYQk%2BvLZjSRtjo5kgEOtCpM%2BvHwaUpk3iywT8%2B%2FNzPuOT9WuKLRzFSfl97fyg7L7r3%2Bwx0UfT%2FX7WxNipkts2Ks2eRRlYBZJQ%2FiAcxn2sXYWDPJAX7BuaCBnn7IZ3Qgq9jD51Nkz6g32qh4IuV0N5zBR4DfSH%2BfepUhzbUR4ZMVXFZ%2FYEe1c0OIC9lq2A4T0ZZ6Vth6uQcEziuUuERJZ0qiFM%2F4JMOB3MZEMbUv%2FcZIJcW3UShx46iXd1klc0wgJi7p84Q2CVjcHn2%2Fqt%2FTmdwekIas4Wq1B7vaCHuh5B9Gk7M4U%2Fa5eP3kgGWlMGLNaB0X2VFG6r5wcnOMejfjZ%2FzD47EuCkrhzseNtgBhuitF8uV91DD%2BMRxOJ8hUu%2F8O%2FKFQlTliqZVSUttFbr4b6kZKD9wBW%2FnCNR49lhjakm60hHOORKok48I8naIQtaOeMkhi9pcqrn1oNdhoOyzSHJkj5iqL6RcgUV6kWf1zXdwtN7moz33SGiwmbbaWEeNJ4vNyoarqEQf0KF0lfVQxnjkiezbicqI0etq65lurVfD%2Fu5RPIcchy4%2Bu6x%2FMIiUhK8GOrEB72GjOwKq%2FW4lIdLg5WJtFiFMV1ig08BoipzS70fQy%2B%2BqFp7E4wLbXlZ75cV9UQtQg4q%2FjgZwCXno48hhKyBpDa22dtj2MoDDwTPjZb9O%2BogxwNSuurMJ6DaBuUQw3N1c8PCpk2Dh0%2B6iDjkNiwEHe7llPFb8CN89Lu%2BxrfaFaUM6FxbefRbglTGURiBC7DL46pE%2F7d9TP1nN9IVJIpRCXoazmh6rdBkq27%2BEwx8MZgJD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240301T001941Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFMGKP6OIS%2F20240301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=eb03192290be82cc4ff01bb2776ced5e030d21a13696923a6ec1261013a3e5ea"
                        }
                        alt={recipe.name}
                        height={100}
                      />
                    </Card.Section>

                    <Stack
                      h={100}
                      bg="var(--mantine-color-body)"
                      align="flex-start"
                      gap="xs"
                    >
                      <Text size="md" fw={600}>
                        {recipe.name}
                      </Text>
                      <Box w="20%">
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
