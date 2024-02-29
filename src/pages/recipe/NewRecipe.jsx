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
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure, randomId } from "@mantine/hooks";
import { useEffect, useState, useContext } from "react";
import Modal from "../../components/parts/Modal";
import useFetch from "../../hooks/useFetch";
import useToast from "../../hooks/useToast";
import LoaderDots from "../../components/parts/Loader";
import ImageDropzone from "../../components/parts/Dropzone";
import { UserContext } from "../../App.jsx";

function NewRecipe() {
  // manage the state of whether a component (such as a modal) is open or closed.
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { sendRequest } = useFetch();
  const { successToast, errorToast } = useToast();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!user) {
      notifications.show({
        message: "You can only create a recipe if you are logged in.",
        autoClose: 1000,
      });
      navigate("/signin");
      return;
    }
    setLoading(false);
    window.scrollTo(0, 0);
  }, []);

  const form = useForm({
    initialValues: {
      ingredients: [{ quantity: "", unit: "", name: "", key: randomId() }],
    },
    validate: {
      category: (value) =>
        value === undefined &&
        "Please choose a category which best represents your recipe.",
      levelOfDiff: (value) =>
        value === undefined &&
        "Please choose an area which best represents the difficulty of this recipe.",
      ingredients: {
        quantity: (value) =>
          value === undefined && "Please enter a valid quantity.",
        name: (value) =>
          value === undefined &&
          "Please enter a valid ingredient name (string).",
      },
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

  // Function to handle file upload
  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/create`,
        "POST",
        {
          name: form.values.name,
          description: form.values.description,
          // image: file.map((properties) => {
          //   return {
          //     name: ingredient.quantity,
          //     data: ingredient.unit,
          //     contentType: ingredient.name,
          //   };
          // }),
          category: form.values.category,
          ingredients: form.values.ingredients.map((ingredient) => {
            return {
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              name: ingredient.name,
            };
          }),
          levelOfDiff: form.values.levelOfDiff,
          timeRequired: form.values.timeRequired,
          servings: form.values.servings,
          instructions: form.values.instructions,
          user: req.user.id,
        }
      );
      console.log(res);
      navigate("/");
      close();
      successToast({
        title: "Recipe Successfully Created!",
        message: "Your recipe is now listed. Thank you for your contribution!",
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
        withAsterisk
        {...form.getInputProps(`ingredients.${index}.quantity`)}
        min={0}
      />
      <TextInput {...form.getInputProps(`ingredients.${index}.unit`)} />
      <TextInput
        withAsterisk
        {...form.getInputProps(`ingredients.${index}.name`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("ingredients", index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Box>
  ));

  function renderIngredients(ingredientArray) {
    return ingredientArray.map((ingredient) => {
      return `${ingredient.quantity} ${
        ingredient.unit ? ingredient.unit : ""
      } ${ingredient.name}`;
    });
  }

  const modalContent = (form, file) => {
    const recpDetails = {
      // add user info in req body
      Name: form.values.name,
      Description: form.values.description,
      image: file && JSON.stringify(file),
      Category: form.values.category,
      levelOfDiff: form.values.levelOfDiff,
      timeRequired: form.values.timeRequired,
      Servings: form.values.servings && form.values.servings,
      Ingredients: form.values.ingredients.map((ingredient) => {
        return {
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          name: ingredient.name,
        };
      }),
      Instructions: form.values.instructions,
    };

    return (
      <ul>
        {Object.entries(recpDetails).map(([key, value]) => (
          <li key={key}>
            {key === "levelOfDiff"
              ? `Level of Difficulty: ${value}`
              : key === "timeRequired"
              ? `Time Required: ${value} min`
              : key === "ingredients"
              ? `Ingredients: ${renderIngredients(value)}`
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
                console.log();
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
                withAsterisk
                placeholder="10"
                min={1}
                mt="md"
                {...form.getInputProps("servings")}
              />
              <NumberInput
                label="Time Required"
                withAsterisk
                placeholder="in minutes"
                min={0}
                mt="md"
                {...form.getInputProps("timeRequired")}
              />

              <Text size="sm" mt="md">
                Ingredients*
              </Text>
              <Box
                mt="xs"
                ta="center"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.5fr 0.5fr 1fr 0.25fr",
                }}
              >
                <Text size="xs">Quantity</Text>
                <Text size="xs">Unit</Text>
                <Text size="xs">Ingredient Name</Text>
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
                withAsterisk
                placeholder="Mix all ingredients and bake at 180 deg C. Cool and serve."
                autosize="true"
                minRows={5}
                {...form.getInputProps("instructions")}
              />

              <Text size="sm" mt="md">
                Upload image
              </Text>
              <ImageDropzone handleFileUpload={handleFileUpload} />

              <Group justify="center" mt="xl">
                <Button
                  type="button"
                  component={Link}
                  to={`/`} //return to landing page
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    console.log(
                      `${JSON.stringify(form)} and File = ${JSON.stringify(
                        file
                      )}`
                    );
                    console.log(`Modal opened: ${opened}`);
                  }}
                >
                  Create
                </Button>
              </Group>
            </form>

            <Modal
              opened={opened}
              title="Create Your Recipe"
              modalContent={modalContent(form, file)}
              toggle={toggle}
              onClose={close}
              handleSubmit={handleSubmit}
            />
          </Box>
        </>
      )}
    </>
  );
}

export default NewRecipe;
