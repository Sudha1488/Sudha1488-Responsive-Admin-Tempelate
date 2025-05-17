import React from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  List,
  Avatar,
  Divider,
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
const { Title, TexT } = Typography;

const Home = () => {
  const DataCard = ({ icon, title, value, percentage, color }) => {
    return (
      <Card className="metrics-card" bordered={false}>
        <div style={{ textAlign: "right", marginBottom: "12px" }}>
          <Text type="secondary">Percentage%</Text>
        </div>
        <Progress
          type="circle"
          percent={percentage}
          strokeColor={color}
          strokeWidth={10}
          width={80}
          style={{ position: "absolute", right: 24, top: 50 }}
        />
        <div style={{ marginRight: 100 }}>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Title
          </Text>
          <Title level={3} style={{ margin: "8px 0" }}>
            Value
          </Title>
        </div>
      </Card>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fof2f5" }}>
      <Content style={{ padding: "24px" }}>
        <div>
          <Title></Title>
          <Text></Text>
        </div>

        {/*Data card Row */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<TeamOutlined />}
              title="TOTAL USERS"
              value={10}
              percentage={86}
              color="#52c41a"
            ></DataCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<UserOutlined />}
              title="ACTIVE USERS"
              value={10}
              percentage={86}
              color="#52c41a"
            ></DataCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<TeamOutlined />}
              title="INACTIVE USERS"
              value={10}
              percentage={86}
              color="#52c41a"
            ></DataCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <DataCard
              icon={<TeamOutlined />}
              title="AVE"
              value={10}
              percentage={86}
              color="#52c41a"
            ></DataCard>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
