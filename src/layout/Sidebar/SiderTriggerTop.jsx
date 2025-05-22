import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import colors from "../../theme/color";

const SiderTriggerTop = ({ collapsed, onToggle }) => {
  return (
    <div
      style={{
        height: 63,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        cursor: "pointer",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        backgroundColor: colors.primary,
        padding: "0 16px",
      }}
      onClick={onToggle}
    >
      {!collapsed && (
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            letterSpacing: 1.5,
            color: "#fff",
            // textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#00e5ff" }}>ONE</span>
          <span style={{ color: "#fff" }}>Hero</span>
        </div>
      )}

      {collapsed ? (
        <RightCircleOutlined style={{ fontSize: 22 }} />
      ) : (
        <LeftCircleOutlined style={{ fontSize: 22 }} />
      )}
    </div>
  );
};

export default SiderTriggerTop;
