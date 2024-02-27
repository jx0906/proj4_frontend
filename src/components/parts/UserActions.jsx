import { ActionIcon, rem, Tooltip } from "@mantine/core";
import {
  IconBookmarkPlus,
  IconCirclePlus,
  IconShare,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";

export default function UserActions() {
  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 500 });
  var getURL = window.location.href;

  function handleClickToShare(evt) {
    evt.preventDefault();
    // Copy the URL inside the text field
    clipboard.copy(getURL);

    // Success feedback
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

      {/* if user is logged on - can add notes */}
      <Tooltip label="Add notes">
        <ActionIcon variant="default" size="lg">
          <IconCirclePlus
            style={{ width: rem(20) }}
            stroke={1.5}
            // onClick={() => navigate("/user/notes")}
          />
        </ActionIcon>
      </Tooltip>
    </ActionIcon.Group>
  );
}
