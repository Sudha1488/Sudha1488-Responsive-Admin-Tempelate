import React from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Progress,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
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
  const userStatusData = [
    { name: "Active", value: 32592, fill: "#52c41a" },
    { name: "Inactive", value: 25228, fill: "#faad14" },
  ];

  const userRoleData = [
    { name: "Admin", value: 15, fill: "#1890ff" },
    { name: "Manager", value: 30, fill: "#69c0ff" },
    { name: "User", value: 200, fill: "#91d5ff" },
  ];

  const DataCard = ({ icon, title, value, percentage, color }) => {
  return (
    <Card bordered={false} style={{ minHeight: 140, position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 20, marginRight: 8, color }}>{icon}</span>
            <Text type="secondary" style={{ fontSize: 13 }}>{title}</Text>
          </div>
          <Title level={4} style={{ margin: "4px 0" }}>{value.toLocaleString()}</Title>
        </div>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>Percentage%</Text>
          <Progress
            type="circle"
            percent={percentage}
            strokeColor={color}
            strokeWidth={10}
            width={60}
            style={{ marginTop: 4 }}
          />
        </div>
      </div>
    </Card>
  );
};


  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ padding: "16px" }}>
        <div>
          <Title level={3} style={{ marginBottom: 16 }}>Dashboard</Title>
        </div>

        {/* Data card Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
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
              percentage={86}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<ClockCircleOutlined />}
              title="INACTIVE USERS"
              value={11}
              percentage={86}
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

        {/* Chart Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card bordered={false} style={{ height: 280 }}>
              <Title level={5} style={{ marginBottom: 12, color: "#555" }}>
                ACTIVE VS INACTIVE USERS
              </Title>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userStatusData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card bordered={false} style={{ height: 280 }}>
              <Title level={5} style={{ marginBottom: 12, color: "#555" }}>
                USERS BY ROLE
              </Title>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
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
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
