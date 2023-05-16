import { useState } from "react";
import { toast } from "react-hot-toast";

export default function usePersistentToast(message = "", type: any = "default") {
  const [persistentToastID, setPersistentToastID] = useState<any>();

  const trigger = () => {
    toast.dismiss(persistentToastID);
    let toastID = toast.error(message, { duration: Infinity, style: { marginTop: 5 } });
    setPersistentToastID(toastID);
  };

  const dismiss = () => {
    setPersistentToastID(undefined);
    toast.dismiss(persistentToastID);
  };

  return { trigger, dismiss };
}
