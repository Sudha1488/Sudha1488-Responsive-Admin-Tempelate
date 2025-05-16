import React from "react";
import { Typography, Space, Layout } from "antd";
const { Header } = Layout;
import {
  MenuOutlined,
  BellOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const MainHeader = ({isMobile, toggleDrawer}) => {
  return (
    <Header
      style={{
        background: "#B2C6B6",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(3, 3, 3, 0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isMobile && (
          <MenuOutlined
            onClick={toggleDrawer}
            style={{ fontSize: 20, cursor: "pointer", color: "#000" }}
          />
        )}
        <Text strong style={{ fontSize: 18 }}>
          My Admin Dashboard
        </Text>
      </div>

      <Space size="large">
        <BellOutlined style={{ fontSize: 16, cursor: "pointer" }} />
        <UserSwitchOutlined style={{ fontSize: 16, cursor: "pointer" }} />
      </Space>
    </Header>
  );
};

export default MainHeader;
