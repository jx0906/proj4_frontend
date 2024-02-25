import { useState } from "react";
import { Group, Text, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import useToast from "../../hooks/useToast";

export default function ImageDropzone({ handleFileUpload }) {
  const [file, setFile] = useState(null);
  const { successToast, errorToast } = useToast();

  const maxSizeInBytes = 10 * 1024 ** 2; // 10 MB in bytes

  function fileUpload(uploadedFile) {
    console.log("accepted files", uploadedFile);
    setFile(uploadedFile);
    handleFileUpload(uploadedFile); // Pass the uploaded file to the parent component
    successToast({
      title: "Success!",
      message: "Image Uploaded!",
    });
  }

  return (
    <Dropzone
      onDrop={fileUpload}
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
        </div>
      </Group>
    </Dropzone>
  );
}
