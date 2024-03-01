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
import { useDisclosure } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import Modal from "../../components/parts/Modal.jsx";
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

function AdminRecipeMgt() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [data, setData] = useState([]);
  const [dataToCancel, setDataToCancel] = useState([]);
  const { sendRequest } = useFetch();
  const { successToast, errorToast } = useToast();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getList();
    window.scrollTo(0, 0);
    if (!user) {
      navigate("/signin");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getList = async () => {
    const recpdata = await sendRequest(
      `${import.meta.env.VITE_API_URL}/recipe/`,
      "GET"
    );
    setData(recpdata.recipes);
    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_API_URL}/recipe/${dataToCancel._id}/`,
        "DELETE"
      );
      setData((prev) =>
        prev.filter((recipe) => recipe._id !== dataToCancel._id)
      );
      close();
      successToast({
        title: "Success!",
        message: "Recipe deleted!",
      });
    } catch (err) {
      console.log(err);
      close();
      errorToast();
    }
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
        <Table.Td>{dayjs(row.createdAt).format("DD/MM/YYYY")}</Table.Td>

        {/* <Table.Td>{row.request}</Table.Td> */}

        <Table.Td w="30px">
          <Tooltip label="Delete recipe">
            <ActionIcon
              variant="default"
              size="md"
              onClick={() => {
                toggle();
                setDataToCancel(row);
              }}
            >
              <IconTrash size="input-sm" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
        <Table.Td w="30px">
          <Tooltip label="Edit recipe">
            <ActionIcon
              variant="default"
              size="md"
              onClick={() => {
                navigate(`/recipe/${row._id}/edit`);
              }}
            >
              <IconEdit size="input-sm" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Table.Td>
      </Table.Tr>
    ));
  };

  return (
    <>
      <Title order={2} ta="center" mb="lg">
        My Creations
      </Title>
      {loading ? (
        <LoaderDots />
      ) : (
        <>
          <ScrollArea>
            <Table verticalSpacing="xs" miw={700}>
              <Table.Tbody>
                <Table.Tr>
                  <Th>Recipe Name</Th>
                  {/* <Th></Th> */}
                  <Th>Description</Th>
                  <Th>Date Created</Th>
                </Table.Tr>
              </Table.Tbody>
              <Table.Tbody>{rows()}</Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Modal */}
          <Modal
            opened={opened}
            title="Delete a recipe"
            modalContent="You will not be able to undo this. Pls confirm if you would like to proceed with the deletion."
            toggle={toggle}
            close={close}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
}

export default AdminRecipeMgt;
