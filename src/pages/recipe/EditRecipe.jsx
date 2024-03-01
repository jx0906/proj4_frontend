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
import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDisclosure, randomId } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import Modal from "../../components/parts/Modal";
import useFetch from "../../hooks/useFetch";
import useToast from "../../hooks/useToast";
import LoaderDots from "../../components/parts/Loader";
import ImageDropzone from "../../components/parts/Dropzone";
import { UserContext } from "../../App.jsx";
import { notifications } from "@mantine/notifications";

function EditRecipe() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { sendRequest } = useFetch();
  const { successToast, errorToast } = useToast();
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const pathId = location.pathname.split("/")[2];
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);

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

  useEffect(() => {
    if (!user) {
      notifications.show({
        message: "You can only create/edit recipes if you are logged in.",
        autoClose: 1000,
      });
      navigate("/signin");
      return;
    }

    const getData = async () => {
      const recpData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/${pathId}`,
        "GET"
      );

      if (!recpData || recpData.length === 0) {
        navigate("/recipe");
        return;
      }
      setLoading(false);
      setData(recpData);
      console.log(recpData);
      form.setValues({
        name: recpData.name,
        category: recpData.category,
        description: recpData.description,
        levelOfDiff: recpData.levelOfDiff,
        timeRequired: recpData.timeRequired,
        servings: recpData.servings,
        image: recpData.image
          ? { imgName: recpData.image.imgName || recpData.image.imgname || "" }
          : {}, // Conditional rendering of image name
        ingredients: recpData.ingredients.map((ingredient) => {
          return {
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            name: ingredient.name,
            key: ingredient.key ? ingredient.key : randomId(),
          };
        }),
        instructions: recpData.instructions,
      });
    };
    console.log(user);
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/${pathId}/edit`,
        "POST",
        payload
      );
      console.log(res);
      navigate(`/recipe/${pathId}`);
      close();
      successToast({
        title: "You did it!",
        message: "Your recipe has been updated. ",
      });
    } catch (err) {
      console.log(err);
      close();
      errorToast();
    } finally {
      close();
    }
  };

  const inputIngredient = form.values.ingredients.map((ingredient, index) => (
    <Box
      key={ingredient.key}
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

  const confirmInput = (input) => {
    const formSubmit = {
      name: input.name,
      description: input.description,
      category: input.category,
      ingredients: input.ingredients.map((ingredient) => {
        return {
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          name: ingredient.name,
        };
      }),
      levelOfDiff: input.levelOfDiff,
      timeRequired: input.timeRequired,
      servings: input.servings,
      instructions: input.instructions,
    };

    setPayload({
      ...formSubmit,
      image: {
        imgName: convertedFile ? convertedFile : "",
        imgLabel: file ? file.name : "",
        imgContentType: file ? file.type : "",
      },
    });
  };

  function renderIngredients(ingredientArray) {
    return ingredientArray.map((ingredient) => {
      return `${ingredient.quantity} ${
        ingredient.unit ? ingredient.unit : ""
      } ${ingredient.name}`;
    });
  }

  // get user edited info
  const compareData = (var1, var2) => {
    const displayData = {};

    Object.keys(var1).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(var2, key)) {
        // separate comparison for ingredients as it is stored as an array in the backend db unlike the rest
        if (key === "ingredients") {
          if (var1.ingredients) {
            const isIngredientsEqual =
              var1.ingredients.length === var2.ingredients.length &&
              var1.ingredients.every((ingredient) =>
                var2.ingredients.includes(ingredient)
              );

            if (!isIngredientsEqual) {
              displayData[key] = var1[key];
            }
          } else {
            return; //var1.ingredients would be undefined if the field is not edited (from console.logs)
          }
        } else if (var1[key] !== var2[key]) {
          // Check if the value is different
          displayData[key] = var1[key];
        }
      }
    });

    if (Object.keys(displayData).length === 0) {
      return "No differing values. Pls update the relevant fields.";
    } else {
      return (
        <ul>
          {Object.entries(displayData).map(([key, value]) => (
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
    }
  };

  const handleClickToDelete = async () => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/${pathId}/`,
        "DELETE"
      );
      close();
      successToast({
        title: "Success!",
        message: "Recipe deleted!",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
      close();
      errorToast();
    }
  };

  return (
    <>
      {loading ? (
        <LoaderDots />
      ) : (
        <>
          <Title order={2} ta="center">
            Update Your Recipe
          </Title>
          <Box maw={500} mx="auto" mt="xl">
            <form
              onSubmit={form.onSubmit(() => {
                if (form.isValid) {
                  confirmInput(form.values);
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
              <ImageDropzone
                file={file}
                setFile={setFile}
                convertedFile={convertedFile}
                setConvertedFile={setConvertedFile}
              />

              <Group justify="center" mt="xl">
                <Button
                  type="button"
                  component={Link}
                  to={`/recipe/${data._id}`} //return to Owner Dashboard
                  variant="outline"
                >
                  Cancel
                </Button>
                <ActionIcon
                  variant="default"
                  size="md"
                  onClick={handleClickToDelete}
                >
                  <IconTrash size="input-sm" stroke={1.5} />
                </ActionIcon>
                <Button type="submit">Update</Button>
              </Group>
            </form>

            <Modal
              opened={opened}
              title="Update Recipe"
              modalContent={compareData(payload, data)}
              toggle={toggle}
              close={close}
              handleSubmit={handleSubmit}
            />
          </Box>
        </>
      )}
    </>
  );
}

export default EditRecipe;
