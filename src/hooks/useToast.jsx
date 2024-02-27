import { notifications } from "@mantine/notifications";

function useToast() {
  const successToast = (obj) => {
    notifications.show({
      title: obj.title,
      message: obj.message,
      autoClose: 3000,
    });
  };

  const errorToast = (err) => {
    if (err) {
      notifications.show({
        title: err,
        message: "Please try again",
        autoClose: 3000,
        color: "red",
      });
      return;
    }
    notifications.show({
      title: "Something went wrong!",
      message: "Please try again later",
      autoClose: 3000,
      color: "red",
    });
  };

  return {
    successToast,
    errorToast,
  };
}

export default useToast;
