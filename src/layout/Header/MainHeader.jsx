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
import { logout } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const { Text } = Typography;

const MainHeader = ({ isMobile, toggleDrawer, collapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state)=>state.auth)
  // console.log("🔍 Auth State:", auth);

  const siderWidth = isMobile ? 0 : collapsed ? 80 : 200;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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
        left: siderWidth,
        width: isMobile ? "100vw" : `calc(100vw - ${siderWidth}px)`,
        zIndex: 1000,
        transition: "all 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isMobile && (
          <MenuOutlined
            onClick={toggleDrawer}
            style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
          />
        )}
        {/* <Text strong style={{ fontSize: 18, color: "#ffffff" }}>
          Admin Dashboard
        </Text> */}
      </div>

      <div>
        <Space size="large">
          <BellOutlined
            style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
          />
          <UserSwitchOutlined
            style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
            onClick={handleLogout}
          />
        </Space>
      </div>
    </Header>
  );
};

export default MainHeader;
