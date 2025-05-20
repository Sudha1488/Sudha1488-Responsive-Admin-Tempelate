import React from "react";
import { Layout, Card, Row, Col, Typography, Progress } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const { Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const userGrowthData = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 200 },
    { month: "Mar", users: 280 },
    { month: "Apr", users: 350 },
    { month: "May", users: 420 },
    { month: "Jun", users: 510 },
  ];

  const userRoleData = [
    { name: "Admin", value: 15, fill: "#1890ff" },
    { name: "Manager", value: 30, fill: "#69c0ff" },
    { name: "User", value: 200, fill: "#91d5ff" },
  ];

  const DataCard = ({ icon, title, value, percentage, color }) => {
    return (
      <Card
        bordered={false}
        style={{
          minHeight: 150,
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.2s",
        }}
        bodyStyle={{ padding: 20 }}
        hoverable
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 6 }}
            >
              <span style={{ fontSize: 22, marginRight: 8, color }}>
                {icon}
              </span>
              <Text type="secondary" style={{ fontSize: 14 }}>
                {title}
              </Text>
            </div>
            <Title level={4} style={{ margin: 0 }}>
              {value.toLocaleString()}
            </Title>
          </div>
          <Progress
            type="circle"
            percent={percentage}
            strokeColor={color}
            strokeWidth={10}
            width={60}
            style={{ transition: "all 0.3s ease-in-out" }}
          />
        </div>
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9fafc" }}>
      <Content style={{ padding: "24px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Title level={3} style={{ marginBottom: 24, color: "#1f1f1f" }}>
              Dashboard Overview
            </Title>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<TeamOutlined />}
              title="TOTAL USERS"
              value={101}
              percentage={86}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<UserOutlined />}
              title="ACTIVE USERS"
              value={90}
              percentage={89}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<ClockCircleOutlined />}
              title="INACTIVE USERS"
              value={11}
              percentage={11}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<CalendarOutlined />}
              title="AVERAGE AGE"
              value={34}
              percentage={61}
              color="#722ed1"
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{
                height: 320,
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Title level={5} style={{ color: "#555", marginBottom: 16 }}>
                User Growth Over Past Months
              </Title>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#1890ff"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{
                height: 320,
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Title level={5} style={{ color: "#555", marginBottom: 16 }}>
                Users by Role
              </Title>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
