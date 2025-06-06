import React, { useState, useEffect } from "react";
import { Menu, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  CalendarOutlined,
  KeyOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  PictureOutlined,
  SettingOutlined
} from "@ant-design/icons";
import "./Sidebar.css";
import colors from "../../theme/color";

const { Title } = Typography;

const Sidebar = ({ collapsed, isMobile, closeSidebar }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  const rootSubmenuKeys = [
    // "/employee",
    "/access",
    "/manage-blogs",
    "/masters",
  ];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.includes(latestOpenKey)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }
  };

  const handleClick = () => {
    if (isMobile && closeSidebar) {
      closeSidebar();
    }
  };

  const getSelectedKey = (path) => {
  const matchedKeys = [
    // "/employee/details",
    // "/employee/add",
    "/access/user",
    "/access/roles",
    "/access/permissions",
    "/manage-blogs/category",
    "/manage-blogs/list",
    "/masters/country",
    "/masters/state",
    "/masters/city",
    "/leave",
    "/pages",
    "/inquiries",
    "/banner",
    "/settings",
    "/login",
    "/"
  ];

  matchedKeys.sort((a, b) => b.length - a.length);

  return matchedKeys.find((key) => path.startsWith(key)) || "/";
};


  useEffect(() => {
    const basePath = "/" + location.pathname.split("/")[1];
    if (rootSubmenuKeys.includes(basePath)) {
      setOpenKeys([basePath]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  return (
    <div
      className="sidebar-container"
      style={{
        width: isMobile ? "100%" : collapsed ? 80 : 200,
        height: "100vh",
        backgroundColor: colors.primary,
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
            background: colors.primary,
          }}
        >
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Admin Panel
          </Title>
        </div>
      )}

      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[getSelectedKey(location.pathname)]}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={onOpenChange}
        style={{ backgroundColor: colors.primary, color: "#fff" }}
        className="custom-sidebar-menu"
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/" onClick={handleClick}>Home</Link>
        </Menu.Item>

        <Menu.SubMenu key="/access" icon={<KeyOutlined />} title="Access">
          <Menu.Item key="/access/users" icon={<UserOutlined />}>
            <Link to="/access/users" onClick={handleClick}>Users</Link>
          </Menu.Item>
          <Menu.Item key="/access/roles" icon={<UserAddOutlined />}>
            <Link to="/access/roles" onClick={handleClick}>Roles</Link>
          </Menu.Item>
          <Menu.Item key="/access/permissions" icon={<UserAddOutlined />}>
            <Link to="/access/permissions" onClick={handleClick}>Permissions</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="/manage-blogs" icon={<TeamOutlined />} title="Manage Blogs">
          <Menu.Item key="/manage-blogs/category" icon={<UserOutlined />}>
            <Link to="/manage-blogs/category" onClick={handleClick}>Category</Link>
          </Menu.Item>
          <Menu.Item key="/manage-blogs/list" icon={<UserAddOutlined />}>
            <Link to="/manage-blogs/list" onClick={handleClick}>Blogs</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="/masters" icon={<DatabaseOutlined />} title="Masters">
          <Menu.Item key="/masters/country" icon={<UserOutlined />}>
            <Link to="/masters/country" onClick={handleClick}>Country</Link>
          </Menu.Item>
          <Menu.Item key="/masters/state" icon={<UserAddOutlined />}>
            <Link to="/masters/state" onClick={handleClick}>State</Link>
          </Menu.Item>
          <Menu.Item key="/masters/city" icon={<UserAddOutlined />}>
            <Link to="/masters/city" onClick={handleClick}>City</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item key="/pages" icon={<FileTextOutlined/>}>
          <Link to="/pages" onClick={handleClick}>Pages</Link>
        </Menu.Item>

        <Menu.Item key="/inquiries" icon={<QuestionCircleOutlined />}>
          <Link to="/inquiries" onClick={handleClick}>Inquiries</Link>
        </Menu.Item>

        <Menu.Item key="/banner" icon={<PictureOutlined/>}>
          <Link to="/banner" onClick={handleClick}>Banner</Link>
        </Menu.Item>

        <Menu.Item key="/settings" icon={<SettingOutlined/>}>
          <Link to="/settings" onClick={handleClick}>Settings</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
