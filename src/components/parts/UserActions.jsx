import { ActionIcon, rem } from "@mantine/core";
import {
  IconBookmarkPlus,
  IconCirclePlus,
  IconShare,
  IconEdit,
} from "@tabler/icons-react";

export default function UserActions() {
  return (
    <ActionIcon.Group>
      <ActionIcon variant="default" size="lg" aria-label="Gallery">
        <IconBookmarkPlus style={{ width: rem(20) }} stroke={1.5} />
      </ActionIcon>
      <ActionIcon variant="default" size="lg" aria-label="Settings">
        <IconShare style={{ width: rem(20) }} stroke={1.5} />
      </ActionIcon>
      {/* if user is logged on and creator of recipe - can edit */}
      <ActionIcon variant="default" size="lg" aria-label="Likes">
        <IconEdit style={{ width: rem(20) }} stroke={1.5} />
      </ActionIcon>
      {/* if user is logged on - can add notes */}
      <ActionIcon variant="default" size="lg" aria-label="Likes">
        <IconCirclePlus style={{ width: rem(20) }} stroke={1.5} />
      </ActionIcon>
    </ActionIcon.Group>
  );
}
