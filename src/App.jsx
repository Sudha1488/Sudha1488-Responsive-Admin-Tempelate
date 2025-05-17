import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import AppRoutes from "./routes/AppRoutes";
import colors from "./theme/color";
import { ConfigProvider } from "antd";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colors.primary,
          colorTextBase: colors.text,
          colorBgBase: colors.background,
        },
      }}
    >
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
          },
          duration: 4000,
        }}
      />
    </ConfigProvider>
  );
}

export default App;
