import React, { useEffect, useState } from "react";
import { Layout, Grid, Drawer } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import MainHeader from "./Header/MainHeader";
import MainFooter from "./Footer/MainFooter";
import colors from "../theme/color";
import {
  LeftCircleOutlined,
  RightCircleOutlined
} from "@ant-design/icons";
import SiderTriggerTop from "./Sidebar/SiderTriggerTop";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleDrawer = () => setDrawerVisible(!drawerVisible);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  useEffect(() => {
    if (!isMobile) setDrawerVisible(false);
  }, [isMobile]);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {isMobile ? (
        <Drawer
          open={drawerVisible}
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          styles={{ body: { padding: 0 } }}
        >
          <Sidebar
            collapsed={false}
            isMobile
            closeSidebar={() => setDrawerVisible(false)}
          />
        </Drawer>
      ) : (
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={200}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#3f4641",
            overflow: "hidden",
          }}
        >
          <SiderTriggerTop collapsed={collapsed} onToggle={toggleCollapsed}/>

          <Sidebar collapsed={collapsed} isMobile={false} />
        </Layout.Sider>
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: "all 0.3s",
          backgroundColor: colors.secondary,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <MainHeader
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
          toggleSidebar={toggleCollapsed}
          collapsed={collapsed}
        />

        <Content
          style={{
            margin: "16px 14px",
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
            height: "calc(100vh - 134px)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>

        <MainFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
