import { ActionIcon, rem, Tooltip } from "@mantine/core";
import {
  IconBookmarkPlus,
  IconCirclePlus,
  IconShare,
  IconEdit,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

export default function UserActions() {
  function handleClickToShare(evt) {
    evt.preventDefault();
    // Get the URL field
    var getURL = window.location.href;
    // Select the text field
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(getURL.value);

    // Alert the copied text
    notifications.show({
      message: "URL copied!",
      autoClose: 1000,
    });
  }

  return (
    <ActionIcon.Group>
      <Tooltip label="Bookmark to Collection">
        <ActionIcon variant="default" size="lg">
          <IconBookmarkPlus style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <Tooltip label="Copy URL for sharing">
        <ActionIcon variant="default" size="lg" onClick={handleClickToShare}>
          <IconShare style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      {/* if user is logged on and creator of recipe - can edit */}
      <Tooltip label="Edit Recipe">
        <ActionIcon variant="default" size="lg">
          <IconEdit style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      {/* if user is logged on - can add notes */}
      <Tooltip label="Add notes">
        <ActionIcon variant="default" size="lg">
          <IconCirclePlus style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    </ActionIcon.Group>
  );
}
