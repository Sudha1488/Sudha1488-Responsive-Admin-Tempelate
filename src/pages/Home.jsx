import React from "react";
import { Layout, Card, Row, Col, Typography, Progress } from "antd";
import {
  MessageOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  FileOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import colors from "../theme/color";
import usePageTitle from "../hooks/usePageTitle";

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  usePageTitle("Dashboard")
  const blogTrafficData = [
    { month: "Jan", visitors: 3200, pageViews: 4800 },
    { month: "Feb", visitors: 3800, pageViews: 5600 },
    { month: "Mar", visitors: 4100, pageViews: 6300 },
    { month: "Apr", visitors: 5400, pageViews: 7900 },
    { month: "May", visitors: 7200, pageViews: 9500 },
    { month: "Jun", visitors: 8700, pageViews: 12400 },
  ];

  const blogsByCategoryData = [
    { name: "Technology", value: 42, fill: "#1890ff" },
    { name: "Marketing", value: 28, fill: "#52c41a" },
    { name: "Design", value: 18, fill: "#722ed1" },
    { name: "Business", value: 22, fill: "#fa8c16" },
    { name: "Tutorials", value: 15, fill: "#eb2f96" },
  ];

  const DataCard = ({ icon, title, value, percentage, color, suffix = "" }) => {
    return (
      <Card
        bordered={false}
        style={{
          minHeight: 150,
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.3s, box-shadow 0.3s",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 20 }}
        hoverable
        className="data-card"
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <span style={{ fontSize: 24, color }}>{icon}</span>
                </div>
                <Text
                  style={{ fontSize: 14, color: "#8c8c8c", fontWeight: 500 }}
                >
                  {title}
                </Text>
              </div>
              <Title level={3} style={{ margin: "4px 0 0 0", fontSize: 28 }}>
                {value.toLocaleString()}
                {suffix}
              </Title>
            </div>
            <Progress
              type="circle"
              percent={percentage}
              strokeColor={color}
              strokeWidth={8}
              width={65}
              style={{ transition: "all 0.3s ease-in-out" }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "60%",
            height: "100%",
            background: `linear-gradient(45deg, transparent, ${color}05)`,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
        />
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: colors.secondary }}>
      <Content >
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
            Dashboard
          </h2>
          <Text style={{ color: "#1890ff", fontWeight: 500 }}>
              <RiseOutlined style={{ marginRight: 8 }} /> 
              24% growth this month
            </Text>
        </div>
      </div>
<div style={{backgroundColor:"#f5f5f5", padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
         }}>
 <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<MessageOutlined />}
              title="TOTAL ENQUIRIES"
              value={247}
              percentage={78}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<FileTextOutlined />}
              title="BLOGS"
              value={125}
              percentage={92}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<AppstoreOutlined />}
              title="CATEGORIES"
              value={18}
              percentage={64}
              color="#fa8c16"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<FileOutlined />}
              title="PAGES"
              value={34}
              percentage={86}
              color="#722ed1"
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card
              bordered={false}
              style={{
                height: 420,
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Title
                  level={4}
                  style={{ color: "#262626", marginBottom: 0, fontWeight: 600 }}
                >
                  Blog Traffic Growth
                </Title>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#1890ff",
                        marginRight: 8,
                      }}
                    />
                    <Text style={{ color: "#8c8c8c" }}>Visitors</Text>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#52c41a",
                        marginRight: 8,
                      }}
                    />
                    <Text style={{ color: "#8c8c8c" }}>Page Views</Text>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={330}>
                <AreaChart
                  data={blogTrafficData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#1890ff"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorPageViews"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#52c41a"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#8c8c8c" />
                  <YAxis stroke="#8c8c8c" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#52c41a"
                    fillOpacity={1}
                    fill="url(#colorPageViews)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#1890ff"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card
              bordered={false}
              style={{
                height: 420,
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Title
                level={4}
                style={{ color: "#262626", marginBottom: 24, fontWeight: 600 }}
              >
                Blogs by Category
              </Title>
              <ResponsiveContainer width="100%" height={330}>
                <PieChart>
                  <Pie
                    data={blogsByCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: "#d9d9d9", strokeWidth: 1 }}
                  >
                    {blogsByCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} blogs`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
</div>
       
      </Content>
    </Layout>
  );
};

export default Dashboard;
