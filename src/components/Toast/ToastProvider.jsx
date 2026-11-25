import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: {
          background: "#491225",
          color: "#F5E8D5",
          border: "1px solid #F5E8D5",
          borderRadius: "4px",
          padding: "14px 18px",
          fontSize: "13px",
        },
      }}
    />
  );
}