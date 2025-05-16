import {
  LeftCircleOutlined,
  RightCircleOutlined
} from "@ant-design/icons";
import colors from "../../theme/color";

const SiderTriggerTop = ({collapsed, onToggle}) => {
  return (
    <div
      style={{
        height: 63,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        backgroundColor: colors.primary
      }}
      onClick={onToggle}
    >
        {!collapsed && (
        <div style={{ fontWeight: 600, fontSize: 16, padding:"0px 40px 0px 0px" }}>

          MyCompany
        </div>
      )}
      {collapsed ? <RightCircleOutlined style={{ fontSize: 22}}/> : <LeftCircleOutlined style={{ fontSize: 22}}/>}{" "}
    </div>
  );
};

export default SiderTriggerTop;
