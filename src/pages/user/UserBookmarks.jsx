/* eslint-disable react/prop-types */
import {
  ActionIcon,
  Table,
  ScrollArea,
  Text,
  Anchor,
  Title,
  Tooltip,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IconBookmarkOff, IconCirclePlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import useFetch from "../../hooks/useFetch.jsx";
import LoaderDots from "../../components/parts/Loader.jsx";
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
  const [dataToUpdate, setDataToUpdate] = useState([]);
  const { sendRequest } = useFetch();
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

  const removeBookmark = async (row) => {
    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/${row._id}/updatebookmark`,
        "POST",
        {
          // using filter instead of splice because i want a new array
          bookmarked:
            row.bookmarked.length === 1
              ? []
              : row.bookmarked.filter((userId) => userId !== user.id),
        }
      );
      setData((prevData) =>
        prevData.filter((recipe) => recipe._id !== row._id)
      );

      // Success feedback
      notifications.show({
        message: "Bookmark removed!",
        autoClose: 1000,
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const rows = () => {
    return data.map((row) => (
      <Table.Tr key={row._id}>
        <Table.Td>
          <Anchor component={Link} to={`/recipe/${row._id}`}>
            {row.name ? row.name : "Recipe"}
          </Anchor>
        </Table.Td>
        <Table.Td>{row.description}</Table.Td>
        <Table.Td>{row.source}</Table.Td>
        <Table.Td w="30px">
          <Tooltip label="Remove bookmark">
            <ActionIcon
              variant="default"
              size="md"
              onClick={() => removeBookmark(row)}
            >
              <IconBookmarkOff size="input-sm" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
        <Table.Td w="30px">
          <Tooltip label="(COMING SOON!) Add notes">
            <ActionIcon variant="default" size="md" disabled>
              <IconCirclePlus size="input-sm" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    ));
  };

  return (
    <>
      <Title order={2} ta="center" mb="lg">
        My Bookmarks
      </Title>
      {loading ? (
        <LoaderDots />
      ) : rows().length === 0 ? (
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
                  <Th>Source of Recipe</Th>
                  {/* <Th>Pax</Th> */}
                  {/* <Th>Date Created</Th> */}
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody>{rows()}</Table.Tbody>
            </Table>
          </ScrollArea>
        </>
      )}
    </>
  );
}

export default UserBookmarks;
