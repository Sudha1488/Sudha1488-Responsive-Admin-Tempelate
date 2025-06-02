import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import {
  UserOutlined,
  ArrowRightOutlined,
  LockOutlined,
} from "@ant-design/icons";
import "./Login.css";

import colors from "../../theme/color";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import usePageTitle from "../../hooks/usePageTitle";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slice/auth/authSlice";

const { Title } = Typography;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  usePageTitle("Login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.ok) {
        const token = data.data.token;
        console.log("Token", token)
        const permissionsResponse = await fetch(
          `${BASE_URL}/admin/auth/get-permissions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let permissions = [];
        if (permissionsResponse.ok) {
          const permissionsData = await permissionsResponse.json();
          permissions = permissionsData.permissions || permissionsData;
        } else {
          console.error(
            "Failed to fetch permissions:",
            permissionsResponse.status
          );
          toast.error("Login failed. Please try again.");
          return;
        }
        dispatch(
          login({
            user: {
              id: data.user?.id || data.id,
              name: data.user?.name || data.name,
              email: data.user?.email || data.email,
              permissions: permissions,
            },
            token: token,
          })
        );

        navigate("/");
        toast.success("Login Successful!");
      } else {
        toast.error(data.message || "Invalid Email or Password");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Email"
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
                loading={loading}
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
