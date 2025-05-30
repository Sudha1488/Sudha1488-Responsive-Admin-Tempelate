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
import toast from "react-hot-toast";
import usePageTitle from "../../hooks/usePageTitle";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slice/auth/authSlice";

const { Title } = Typography;

const Login = () => {
  usePageTitle("Login");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  // console.log("🔍 Auth State:", auth);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/users?email=${encodeURIComponent(
          userEmail
        )}&password=${encodeURIComponent(userPassword)}`
      );

      const users = await response.json();

      if (users.length === 1) {
        const user = users[0];

        dispatch(
          login({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            token: `dummy-token-${user.id}`,
          })
        );
        toast.success("Login Successfull!");
        navigate("/");
      } else {
        toast.error("Invalid Email or Passwrod");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="login-page">
      <div className="login-wrapper">
        <Title
          className="login-title"
          level={1}
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "bold",
            color: colors.primary,
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
                style={{ backgroundColor: colors.primary }}
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
