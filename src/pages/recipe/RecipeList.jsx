import {
  Flex,
  Title,
  Anchor,
  Image,
  Box,
  Text,
  Card,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import useEdamam from "../../hooks/useEdamam";
import LoaderDots from "../../components/parts/Loader.jsx";
import CarouselCards from "../../components/parts/CarouselCards.jsx";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./RecipeList.module.css";
import { IconSchool, IconToolsKitchen3 } from "@tabler/icons-react";

export default function RecipeList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sendRequest } = useFetch();
  const {
    sendEdamamRequest,
    derivedLevelofDiff,
    formattedCategories,
    edamamRecpUri,
  } = useEdamam();
  const theme = useMantineTheme();
  const isPc = useMediaQuery(`(min-width: ${theme.breakpoints.xs})`);

  useEffect(() => {
    let recipeCollection;

    const fetchData = async () => {
      /* need to set this up as async so the concatenation of both int and ext list would only
      start when both fetch processes are fulfilled, else we may run into the possibility of
      getting undefined because either/both processes are not completed in time for
      recipeCollection to run */
      try {
        const intData = await getInternalList();
        const extData = await getEdamamList();
        // console.log(extData);
        //recall that we had set both output as array of objects to facilitate the use of map
        {
          extData
            ? (recipeCollection = [...intData, ...extData])
            : (recipeCollection = [...intData]);
        }
        setData(recipeCollection);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    fetchData();
  }, []);

  const getInternalList = async () => {
    try {
      const recpData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe`,
        "GET"
      );
      // recpData returns as an object. need to get array to use map function below
      return recpData.recipes;
    } catch (err) {
      console.error("Error fetching internal recipe data:", err);
    }
  };

  const getEdamamList = async () => {
    try {
      const edamamRecp = await sendEdamamRequest(
        "https://api.edamam.com/api/recipes/v2?type=public&app_id=06f16e1e&app_key=c06c81514c5f0c114da3fa25ac9cc76a&dishType=Biscuits%20and%20cookies&dishType=Bread&random=true&field=label&field=image&field=ingredientLines&field=dishType"
      );

      const mappedEdamamRecp = edamamRecp.hits.map((hit) => {
        let recipe = hit.recipe;

        return {
          _id: `${edamamRecpUri(hit._links.self.href)}edam`,
          name: recipe.label,
          category: formattedCategories(recipe.dishType[0]),
          levelOfDiff: derivedLevelofDiff(recipe.ingredientLines),
          image: {
            imgname: recipe.image,
          },
        };
      });
      return mappedEdamamRecp;
    } catch (err) {
      console.error("Error fetching internal recipe data:", err);
    }
  };

  return (
    <>
      {loading ? (
        <LoaderDots />
      ) : (
        <>
          <CarouselCards />
          <Title order={3} mt="sm" lineClamp={2}>
            TRENDING NOW
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
                            : "https://edamam-product-images.s3.amazonaws.com/web-img/286/28635841b2d4c8c057dfa4191d322da1.png?X-Amz-Security-Token=IQoJb3JpZ2luX2VjECwaCXVzLWVhc3QtMSJHMEUCIQCPKGRUkwQ65IsOJ98Ke8wuiBOkiIdxz5JJuzclc%2BpG%2BwIgMc3ntlXStnoDi0LfB0iHvTBTmFkIrzYCWcC5hs27pIQquQUIJRAAGgwxODcwMTcxNTA5ODYiDN2o5V8kDt1fmipKAiqWBSUiKw4ikqBOV4LCXel13vMlzZ96eJ38iFGzkZe%2BsiaTqjbPVGkWsf5SRnVcf33yl2na7hvpGHFk6vmy8k79SBg2GFh3V%2FIj%2FR4LZyHlwzpY0ycMbNNwaoYE46xJLBdh3ZDw5OiSaxjzs5BRCNdHH9N5Dt8v2ST3dAjNBEeTHheteFSdDQh3Tn1aGXpnqRW9%2FZ5lwTDl3Yir1vxEJQwmtymMi4j%2Fw7Z%2FG8l4Y%2FEmPXOVEaPBVGg7GW7V7NwVtjIB1xS%2FybDRVB778tgEj%2B8X1XeycGshM1Ew5FlWuZ%2BvrTHcArMiYL0adyEM3%2BBW6hXNevI1l2dUIKh%2Fq6RJMs6xiD6wYNyIVHFRriYXk3%2B343AkuT9rGw1zBea%2B6abHobo4xUVBbbG0lwG2CWvQGvFkWU8J62mb3AyZxSirA68VPP9smeRc0xqslLHBNpyu2UFVWxsg427hXNYIhGrMxCsyJQkHXby4SfciXI9q1tSp9FHiNpzLF8j4ybOg79zWgNA9LPnl3ioWpC4NigLKNyqYdKIf2ajgJ2zxaJQei8a8k4ENCoQEwaQfRighPmCBznLOs%2Bjf5amDOUWHHZ6LbCiHOKDrfAlh7yyyhqn%2FiNpT4%2FZZq4%2FLDN6jQzvoNtt9r5R9NvSSKR%2B7SDk8NyM2QcSRV2LHpRaLqNr59m533aNQR%2Bjx%2FnLbfTGuB16T6CopjuSTjGrRX%2Fh%2Fa%2FLg4uXI9gl035PMAXA5CDs7EKjjxcHXgePQdtWLrPRRkZSidkobtOhpCzSW3%2Fh%2FsSUSvZrDbm9arxCu8n%2B9I05kCCLKpVaR%2FS5aAhKQ0tawBnITiFd6%2FMDBDyKl%2FNl2S%2Fe1AFFdw%2F4TayOpLBO%2BEFYk9T5ILn5afNMe1AxA23InMOKeha8GOrEBc7UdeSPUV5tT8B5BfuUiZ%2FnztQVJAgnYdvxZSy61vvYX4nBHMzu5Kj7GuHeo10f5M9GA%2FJ9nA8ZGP1duLCdTG3YQL17Hdm38ImJ4oanuEG6bCLktV4htkc5fx%2BU3f8tAEs%2B%2BuURSVnqs36QDnQdmYv2fY7oYI99BM1u8JXBmC7f5dPsmU3R71MI6NOGONQ1YAPyPChrv2g%2FdbfmqQGXSMEcEN2aeid2znTgDlR284CQZ&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240301T052748Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFPYUDP3F5%2F20240301%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1db82921ff5f93147dca960a573883e78deebd2a790ecc37cbae288c4582c3d5"
                        }
                        alt={recipe.name}
                        // className={classes.image}
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
