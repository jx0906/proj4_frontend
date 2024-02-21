import { Container, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LoadingOverlay, Button, Group, Box } from "@mantine/core";

// default page loader
export default function LoaderDots() {
  return (
    <Container ta="center" mt="xl">
      <Loader color="orange" type="dots" size={40} />;
    </Container>
  );
}

// loader for file upload
function LoaderInComponent() {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={visible}
          loaderProps={{ children: "Loading..." }}
        />
      </Box>

      <Group position="center">
        <Button onClick={toggle}>Toggle overlay</Button>
      </Group>
    </>
  );
}
