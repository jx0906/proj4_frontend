import {
  ActionIcon,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Text,
  Box,
  Title,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useDisclosure, randomId } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Modal from "../../components/parts/Modal";
import useFetch from "../../hooks/useFetch";
import useToast from "../../hooks/useToast";
import LoaderDots from "../../components/parts/Loader";

function NewRecipe() {
  // manage the state of whether a component (such as a modal) is open or closed.
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { sendRequest } = useFetch();
  const { successToast, errorToast } = useToast();
  // const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("Modal opened:", opened);
  }, [opened]);

  //   useEffect(() => {
  //     if (!user) {
  //       navigate("/signin");
  //       return;
  //     }

  // //     const fetchRecipeData = async () => {
  //       // try {
  // //         const resData = await sendRequest(
  // //           `${import.meta.env.VITE_API_URL}/recipe/user`,
  // //           "GET"
  // //         );
  // //         if (resData) {
  // //           navigate("/owner/Recipe");
  // //           return;
  // //         }
  //         setLoading(false);
  //       // } catch (err) {
  //       //   console.log(err);
  //       // }
  //     // };

  // //     fetchRecipeData();
  //     eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  const form = useForm({
    initialValues: {
      ingredients: [],
    },
    validate: {
      category: (value) =>
        value === undefined &&
        "Please choose a category which best represents your recipe.",
      levelOfDiff: (value) =>
        value === undefined &&
        "Please choose an area which best represents the difficulty of this recipe.",
      ingredients: (value) => [
        {
          quantity:
            value === undefined && "Please provide the required quantity.",
          unit: value === undefined && "Please provide the required unit",
          name:
            value === undefined &&
            "Please provide the required ingredient name",
        },
      ],
      servings: (value) =>
        value === undefined &&
        "Please enter a number for the no. of servings this recipe can serve.",
      timeRequired: (value) => value === undefined && "Please enter a time",
      description: (value) =>
        value?.length > 500 && "Please enter less than 500 characters",
      instructions: (value) =>
        value === undefined &&
        "Please provide the baking instructions for this recipe.",
    },
  });

  const handleSubmit = async () => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/create`,
        "POST",
        {
          name: form.values.name,
          description: form.values.description,
          // image: form.values.image,
          category: form.values.category,
          ingredients: form.values.ingredients,
          levelOfDiff: form.values.levelOfDiff,
          timeRequired: form.values.timeRequired,
          servings: form.values.servings,
          instructions: form.values.instructions,
        }
      );
      console.log(res);
      navigate("/");
      close();
      successToast({
        title: "Recipe Successfully Created!",
        message:
          "Your Recipe is now listed for sharing. Thank you for your contribution!",
      });
    } catch (err) {
      console.log(err);
      close();
      errorToast();
    } finally {
      close();
    }
  };

  const inputIngredient = form.values.ingredients.map((item, index) => (
    <Box
      key={item.key}
      mt="xs"
      style={{
        display: "grid",
        gridTemplateColumns: "0.5fr 0.5fr 1fr 0.25fr",
        gap: "5px",
      }}
    >
      <NumberInput
        {...form.getInputProps(`ingredients.${index}.quantity`)}
        min={1}
      />
      <TextInput {...form.getInputProps(`ingredients.${index}.unit`)} />
      <TextInput {...form.getInputProps(`ingredients.${index}.name`)} />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("ingredients", index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Box>
  ));

  const modalContent = (form) => {
    const recpDetails = {
      // add user info in req body
      Name: form.values.name,
      Description: form.values.description,
      // image: form.values.image,
      Category: form.values.category,
      levelOfDiff: form.values.levelOfDiff,
      timeRequired: form.values.maxPax,
      Servings: form.values.servings
        ? form.values.servings
        : "No info on servings provided",
      Ingredients: form.values.ingredients,
      Instructions: form.values.instruction,
    };

    return (
      <ul>
        {Object.entries(recpDetails).map(([key, value]) => (
          <li key={key}>
            {key === "levelofDiff"
              ? `Level of Difficulty: ${value}`
              : key === "timeRequired"
              ? `Time Required: ${value} min`
              : `${key}: ${value}`}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {loading ? (
        <LoaderDots />
      ) : (
        <>
          <Title order={2} ta="center">
            Create Recipe
          </Title>
          <Box maw={500} mx="auto" mt="xl">
            <form
              onSubmit={form.onSubmit(() => {
                if (form.isValid) {
                  toggle();
                }
              })}
            >
              <TextInput
                label="Name"
                withAsterisk
                placeholder="Rainbow Bread"
                {...form.getInputProps("name")}
              />
              <Textarea
                label="Description"
                mt="md"
                placeholder="Easy peasy cake recipe for a perfect afternoon tea date."
                autosize="true"
                minRows={3}
                {...form.getInputProps("description")}
              />
              <Select
                label="Category"
                withAsterisk
                placeholder="Pick one"
                data={["Pastries", "Biscuits", "Bread", "Cakes"]}
                mt="md"
                searchable
                {...form.getInputProps("category")}
              />
              <Select
                label="Level of Difficulty"
                withAsterisk
                placeholder="Pick one"
                data={["Easy", "Intermediate", "Advanced"]}
                mt="md"
                searchable
                {...form.getInputProps("levelOfDiff")}
              />
              <NumberInput
                label="No. of Servings"
                placeholder="10"
                min={1}
                mt="md"
                {...form.getInputProps("servings")}
              />
              <NumberInput
                label="Time Required"
                placeholder="in minutes"
                min={1}
                mt="md"
                {...form.getInputProps("timeRequired")}
              />

              <Box
                mt="xs"
                ta="center"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 0.5fr 1fr 0.25fr",
                }}
              >
                <Text size="sm">Quantity</Text>
                <Text size="sm">Unit</Text>
                <Text size="sm">Ingredient Name</Text>
              </Box>

              {inputIngredient}

              <Group justify="center" mt="sm">
                <Button
                  onClick={() =>
                    form.insertListItem("ingredients", {
                      quantity: "",
                      unit: "",
                      name: "",
                      key: randomId(),
                    })
                  }
                >
                  Add ingredient
                </Button>
              </Group>

              <Textarea
                label="Instructions"
                mt="md"
                placeholder="Mix all ingredients and bake at 180 deg C. Cool and serve."
                autosize="true"
                minRows={5}
                {...form.getInputProps("instructions")}
              />

              <Group justify="center" mt="xl">
                <Button
                  type="button"
                  component={Link}
                  to={`/`} //return to landing page
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit}>
                  Create
                </Button>
              </Group>
            </form>

            {/* <Modal
              opened={opened}
              title="Create Your Recipe"
              modalContent={modalContent(form)}
              toggle={toggle}
              close={close}
              handleSubmit={handleSubmit}
            /> */}
          </Box>
        </>
      )}
    </>
  );
}

export default NewRecipe;
