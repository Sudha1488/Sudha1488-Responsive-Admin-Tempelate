import React from "react";
import { Typography, Space, Layout } from "antd";
const { Header } = Layout;
import {
  MenuOutlined,
  BellOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import colors from "../../theme/color";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const MainHeader = ({ isMobile, toggleDrawer }) => {
  const navigate = useNavigate();
  return (
    <Header
      style={{
        background: colors.primary,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(3, 3, 3, 0.08)",
        position: "fixed",
        top: 0,
        width: "85.5%",
        zIndex: 1000,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isMobile && (
          <MenuOutlined
            onClick={toggleDrawer}
            style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
          />
        )}
        <Text strong style={{ fontSize: 18, color: "#ffffff" }}>
          My Admin Dashboard
        </Text>
      </div>

      <div>
        <Space size="large">
          <BellOutlined
            style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
          />
          <UserSwitchOutlined
            style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
            onClick={() => navigate("/login")}
          />
        </Space>
      </div>
    </Header>
  );
};

export default MainHeader;
