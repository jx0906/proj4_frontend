/* eslint-disable react/prop-types */
import {
  ActionIcon,
  Table,
  ScrollArea,
  Text,
  Anchor,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IconBookmarkOff, IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import useFetch from "../../hooks/useFetch.jsx";
import LoaderDots from "../../components/parts/Loader.jsx";
import useToast from "../../hooks/useToast.jsx";
import { UserContext } from "../../App.jsx";

function Th({ children }) {
  return (
    <Table.Th>
      <Text fw={700} fz="sm">
        {children}
      </Text>
    </Table.Th>
  );
}

function UserBookmarks() {
  const [data, setData] = useState([]);
  const [dataToUpdate, setdataToUpdate] = useState([]);
  const { sendRequest } = useFetch();
  const { successToast, errorToast } = useToast();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getBookmarks();
    if (!user) {
      navigate("/signin");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBookmarks = async () => {
    const bookmarks = await sendRequest(
      `${import.meta.env.VITE_API_URL}/recipe/search?bookmarkedUser=${user.id}`,
      "GET"
    );
    setData(bookmarks.recipes);
    setLoading(false);
  };

  const removeBookmark = async () => {
    const updatedBookmarks = await sendRequest(
      `${import.meta.env.VITE_API_URL}/recipe/search?bookmarkedUser=${user.id}`,
      "POST",
      {
        // using filter instead of splice because i want a new array
        bookmarked: recipeData.bookmarked.filter((id) => id !== user.id),
      }
    );
    // Success feedback
    notifications.show({
      message: "Bookmark removed!",
      autoClose: 1000,
    });
  };

  const rows =
    // () => {
    //   if (!data) {
    //     return null;
    //   } else {
    data.map((row) => (
      <Table.Tr key={row._id}>
        <Table.Td>
          <Anchor component={Link} to={`/recipe/${row._id}`}>
            {row.name ? row.name : "Recipe"}
          </Anchor>
        </Table.Td>

        <Table.Td>{row.description}</Table.Td>
        <Table.Td>{dayjs(row.createdAt).format("DD/MM/YYYY")}</Table.Td>
        {/* <Table.Td>{row.pax}</Table.Td>
      <Table.Td>{row.request}</Table.Td> */}

        <Table.Td w="85px">
          <ActionIcon
            variant="default"
            size="md"
            onClick={() => {
              setDataToUpdate(row);
            }}
          >
            <IconBookmarkOff size="input-sm" stroke={1.5} />
          </ActionIcon>
        </Table.Td>
        <Table.Td w="85px">
          <ActionIcon
            variant="default"
            size="md"
            onClick={() => {
              navigate(`/recipe/${row._id}/edit`);
            }}
          >
            <IconEdit size="input-sm" stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));
  //   }
  // };

  return (
    <>
      <Title order={2} ta="center" mb="lg">
        My Bookmarks
      </Title>
      {loading ? (
        <LoaderDots />
      ) : rows.length === 0 ? (
        <Text fw={500} ta="center">
          You have not bookmarked any recipes yet. <br />
          <Anchor component={Link} to="/">
            Find one that interests you today!
          </Anchor>
        </Text>
      ) : (
        <>
          <ScrollArea>
            <Table verticalSpacing="xs" miw={700}>
              <Table.Tbody>
                <Table.Tr>
                  <Th>Recipe Name</Th>
                  <Th>Description</Th>
                  {/* {/* <Th>Time</Th> */}
                  {/* <Th>Pax</Th> */}
                  {/* <Th>Date Created</Th> */}
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </>
      )}
    </>
  );
}

export default UserBookmarks;
