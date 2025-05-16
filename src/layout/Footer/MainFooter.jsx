import React from "react";
import { Layout } from "antd";
const {Footer} = Layout;

const MainFooter = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        color: "rgba(0,0,0,0.45)",
        padding: "8px 0",
        fontSize: "12px",
        lineHeight: "1.4",
        background:"transparent"
      }}
    >
      © {new Date().getFullYear()} My Admin Template App - All Rights Reserved
    </Footer>
  );
};

export default MainFooter;
