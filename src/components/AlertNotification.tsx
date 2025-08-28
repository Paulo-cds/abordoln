import { useEffect } from "react";

const AlertNotification = ({
  message,
  type = "info",
  open = true,
  setOpen,
}: {
  message: string;
  type?: "success" | "error" | "info";
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  useEffect(() => {
    if (open && setOpen) {
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  }, [open, setOpen]);

  //   if (!open) return null;
  return (
    <div
      className={`${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-orange-500"
      } flex items-center justify-center fixed bottom-0 ${
        open ? "left-0" : "left-[-450px]"
      } m-2 p-2 rounded shadow-lg text-white min-w-[200px] ease-in-out transition-all duration-300`}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <span className="ms-2 text-white ">{message}</span>
      </div>
    </div>
  );
};

export default AlertNotification;
