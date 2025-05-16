import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Card, message } from "antd";
import {
  UserOutlined,
  ArrowRightOutlined,
  LockFilled,
  LockOutlined,
} from "@ant-design/icons";
import "./Login.css";

import colors from "../../theme/color";
import Password from "antd/es/input/Password";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = () => {
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("Logged in", userEmail, Password);
    navigate("/");
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        fontSize: "56px",
      }}
    >
      <div className="login-wrapper">
        <Title
          level={1}
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "bold",
            color: colors.secondary,
            fontSize: "56px",
          }}
        >
          Login.
        </Title>

        <Card variant={false} className="login-card">
          <Form
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<UserOutlined style={{ color: "#000" }} />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<LockOutlined style={{ color: "#000" }} />}
              />
            </Form.Item>
            <Form.Item
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                icon={<ArrowRightOutlined />}
                size="large"
                style={{ backgroundColor: colors.secondary }}
                className="login-button"
              />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
