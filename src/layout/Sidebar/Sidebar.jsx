import React from "react";
import { Menu, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";

const { Title } = Typography;

const Sidebar = ({ collapsed, isMobile }) => {
  const location = useLocation();

  return (
    <div
      style={{
        width: isMobile ? "100%" : collapsed ? 80 : 200,
        height: "100vh",
        backgroundColor: "#B2C6B6",
        overflow: "auto",
        boxShadow: isMobile ? "none" : "2px 0 6px rgba(0,21,41,0.35)",
      }}
    >
      {!collapsed && (
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#B2C6B6",
          }}
        >
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Admin Panel
          </Title>
        </div>
      )}

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["employee"]}
        theme="dark"
        style={{ backgroundColor: "#B2C6B6" }}
        className="custom-sidebar-menu"
        items={[
          {
            key: "/",
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
          },
          {
            key: "/login",
            icon: <LoginOutlined />,
            label: <Link to="/login">Login</Link>,
          },
          {
            key: "employee",
            icon: <TeamOutlined />,
            label: "Employee",
            children: [
              {
                key: "/employee/details",
                icon: <UserOutlined />,
                label: <Link to="/employee/details">Details</Link>,
              },
              {
                key: "/employee/add",
                icon: <UserAddOutlined />,
                label: <Link to="/employee/add">Add Employee</Link>,
              },
            ],
          },
          {
            key: "/leave",
            icon: <CalendarOutlined />,
            label: <Link to="/leave">Leave</Link>,
          },
        ]}
      />
    </div>
  );
};

export default Sidebar;
