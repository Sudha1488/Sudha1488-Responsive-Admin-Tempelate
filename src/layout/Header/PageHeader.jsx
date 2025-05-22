import React from "react";
import { Button } from "antd";
import colors from "../../theme/color"; 

const PageHeader = ({ 
  title, 
  buttonText, 
  buttonIcon, 
  onButtonClick, 
  showButton = true,
  additionalContent = null 
}) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        marginBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "600",
            color: colors.primary,
            margin: 0,
          }}
        >
          {title}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {additionalContent}
          {showButton && (
            <Button
              icon={buttonIcon}
              type="primary"
              size="middle"
              style={{
                backgroundColor: colors.secondary,
                border: "none",
                padding: "0 16px",
              }}
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;