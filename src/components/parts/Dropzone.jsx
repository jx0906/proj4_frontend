import { Group, Text, rem, SimpleGrid } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import useToast from "../../hooks/useToast";

export default function ImageDropzone({
  file,
  setFile,
  convertedFile,
  setConvertedFile,
}) {
  const [visible, { toggle }] = useDisclosure(true);
  const { successToast, errorToast } = useToast();

  const maxSizeInBytes = 10 * 1024 ** 2; // 10 MB in bytes

  const preview = (file) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
    );
  };

  //read the uploaded file as a base64 string
  function fileUpload(uploadedFile) {
    console.log("accepted files", uploadedFile);
    setFile(uploadedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target.result;
      setConvertedFile(base64String);

      // console.log(`${uploadedFile}`); //[object File]
      // console.log(`${file}`); //null
      // console.log(`${convertedFile}`); //null

      successToast({
        title: "Success!",
        message: "Image Uploaded!",
      });
    };
    reader.readAsDataURL(uploadedFile);
  }

  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        toggle();
        fileUpload(acceptedFiles[0]); // Only handle the first file if multiple files are dropped
      }}
      onReject={() =>
        errorToast({
          title: "Oops!",
          message:
            "We can only accept one image file (png/jpeg) that is less than 10mb in size.",
        })
      }
      maxSize={maxSizeInBytes}
      accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
      multiple={false}
    >
      <Group
        justify="center"
        gap="sm"
        mih={50}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(25),
              height: rem(25),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(25),
              height: rem(25),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{
              width: rem(25),
              height: rem(25),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div align="center">
          <Text size="md" inline>
            Share a picture of the dish here!
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            We can only accept .png and .jpeg files that are less than 10mb in
            size.
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 4 }} mt={preview ? "xl" : 0}>
            {preview}
          </SimpleGrid>
        </div>
      </Group>
    </Dropzone>
  );
}
