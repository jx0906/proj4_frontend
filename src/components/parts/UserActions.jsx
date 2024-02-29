import { ActionIcon, rem, Tooltip } from "@mantine/core";
import {
  IconBookmarkPlus,
  IconCirclePlus,
  IconShare,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import useFetch from "../../hooks/useFetch";

export default function UserActions({ recipeData, user, pathId }) {
  const navigate = useNavigate();
  const { sendRequest } = useFetch();
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

  async function handleClickToBookmark(evt) {
    evt.preventDefault();

    let existingRecipe, res;
    try {
      // Check if data.source is "AppUser" (ie, created originally in app). bookmark directly if yes.
      if (recipeData.source === "AppUser") {
        res = await sendRequest(
          `${import.meta.env.VITE_API_URL}/recipe/${pathId}/addbookmark`,
          "POST",
          {
            bookmarked: recipeData.bookmarked
              ? [...recipeData.bookmarked, user.id] //array.push will return the length and not the array itself!
              : [user.id],
          }
        );
      } else {
        // Check if external recipe already exists (ie, created when other users bookmarked it) to prev creating duplicates
        // check if edamamId field = pathId
        existingRecipe = await sendRequest(
          `${import.meta.env.VITE_API_URL}/recipe/find?edamamId=${pathId}`,
          "GET"
        );

        if (!existingRecipe) {
          // if yes, update bookmark directly
          res = await sendRequest(
            `${import.meta.env.VITE_API_URL}/recipe/${
              existingRecipe._id
            }/addbookmark`,
            "POST",
            {
              bookmarked: existingRecipe.bookmarked
                ? [...existingRecipe.bookmarked, user.id] //array.push will return the length and not the array itself!
                : [user.id],
            }
          );
        } else {
          //  else, create recipe with user ID = admin ID and relevant user info in bookmarked field.
          res = await sendRequest(
            `${import.meta.env.VITE_API_URL}/recipe/create`,
            "POST",
            {
              ...recipeData, // Spread operator includes all existing data, ie, data we had mapped from Edamam in Recipe.jsx for FE render
              bookmarked: [user.id],
              user: "65d443ddbe873f42ef4ca680", // admin user ID
            }
          );
        }
      }

      console.log(res);
      notifications.show({
        message: "Saved recipe to your bookmarks!",
        autoClose: 1000,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <ActionIcon.Group>
      <Tooltip label="Copy URL for sharing">
        <ActionIcon variant="default" size="lg" onClick={handleClickToShare}>
          <IconShare style={{ width: rem(20) }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      {/* if user is logged on - can save bookmark and add notes */}
      {user && (
        <>
          <Tooltip label="Bookmark to Collection">
            <ActionIcon
              variant="default"
              size="lg"
              onClick={handleClickToBookmark}
              // Check if data.bookmarked is defined and if yes, whether it includes user.id
              disabled={recipeData.bookmarked.includes(user.id)}
            >
              <IconBookmarkPlus style={{ width: rem(20) }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Add notes">
            <ActionIcon variant="default" size="lg">
              <IconCirclePlus
                style={{ width: rem(20) }}
                stroke={1.5}
                // onClick={() => navigate("/user/notes")}
              />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </ActionIcon.Group>
  );
}
