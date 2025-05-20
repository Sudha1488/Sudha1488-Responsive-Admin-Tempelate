import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Space,
  Row,
  Col,
  Popconfirm,
} from "antd";
const { Option } = Select;

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import colors from "../../../theme/color";

const staticStates = [
  { id: 1, name: "California", code: "CA", countryId: 1 },
  { id: 2, name: "Texas", code: "TX", countryId: 1 },
  { id: 3, name: "New York", code: "NY", countryId: 1 },
  { id: 4, name: "England", code: "ENG", countryId: 2 },
  { id: 5, name: "Scotland", code: "SCO", countryId: 2 },
  { id: 6, name: "Ontario", code: "ON", countryId: 3 },
  { id: 7, name: "Queensland", code: "QLD", countryId: 4 },
  { id: 8, name: "Bavaria", code: "BAV", countryId: 5 },
];

// Dummy city data
const staticCities = [
  { id: 1, name: "Los Angeles", code: "LA", stateId: 1, status: "active" },
  { id: 2, name: "Dallas", code: "DAL", stateId: 2, status: "inactive" },
  { id: 3, name: "London", code: "LDN", stateId: 4, status: "active" },
];

const City = () => {
  const [cities, setCities] = useState(staticCities);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState(null);

  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedCity(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedCity(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      if (isEditing && selectedCity) {
        const updated = cities.map((city) =>
          city.id === selectedCity.id ? { ...city, ...values } : city
        );
        setCities(updated);
        toast.success("City updated successfully");
      } else {
        const newCity = {
          ...values,
          id: Math.max(...cities.map((c) => c.id)) + 1,
        };
        const updated = [...cities, newCity];
        setCities(updated);
        toast.success("City added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save city");
    }
  };

  const openEditDrawer = (city) => {
    setSelectedCity(city);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(city);
  };

  const viewCity = (city) => {
    setSelectedCity(city);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(city);
  };

  const deleteCity = (id) => {
    try {
      const updated = cities.filter((c) => c.id !== id);
      setCities(updated);
      toast.success("City deleted successfully");
    } catch (error) {
      toast.error("Failed to delete city");
    }
  };

  const getStateName = (stateId) => {
    const state = staticStates.find((s) => s.id === stateId);
    return state ? state.name : "Unknown";
  };

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm) ||
      city.code.toLowerCase().includes(searchTerm);
    const matchesState = stateFilter ? city.stateId === stateFilter : true;
    return matchesSearch && matchesState;
  });

  const columns = [
    {
      title: "City Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "State",
      dataIndex: "stateId",
      key: "stateId",
      render: (id) => getStateName(id),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      width:150,
      fixed:"right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewCity(record)}
            style={{
              backgroundColor: colors.buttonPrimaryBg,
              color: colors.buttonText,
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditDrawer(record)}
            style={{
              backgroundColor: colors.buttonEditBg,
              color: colors.buttonText,
            }}
          />
          <Popconfirm
            title="Delete the City"
            description="Are you sure to delete this city?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteCity(record.id)}
          >
            <Button
              icon={<DeleteOutlined />}
              style={{
                backgroundColor: colors.buttonDeleteBg,
                color: colors.buttonText,
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Top Panel */}
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
            List of Cities
          </h2>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Search by name or code"
              allowClear
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              style={{ width: 200 }}
            />

            <Select
              placeholder="Filter by State"
              allowClear
              style={{ width: 160 }}
              onChange={(value) => setStateFilter(value)}
            >
              {staticStates.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.name}
                </Option>
              ))}
            </Select>

            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={showDrawer}
              style={{
                backgroundColor: colors.secondary,
                border: "none",
                padding: "0 16px",
              }}
            >
              Add City
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        }}
      >
        <Table
          dataSource={filteredCities}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Drawer
        title={
          <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#fff" }}>
            {viewMode ? "View City" : isEditing ? "Edit City" : "Add New City"}
          </div>
        }
        width={360}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose
        headerStyle={{
          backgroundColor: colors.secondary,
          borderBottom: "1px solid #444",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "active" }}
        >
          <Form.Item
            name="stateId"
            label="State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select placeholder="Select state" disabled={viewMode}>
              {staticStates.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="City Name"
            rules={[{ required: true, message: "Please enter the city name" }]}
          >
            <Input placeholder="Enter city name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="code"
            label="City Code"
            rules={[
              { required: true, message: "Please enter city code" },
              { min: 2, max: 5, message: "City code must be 2-5 characters" },
            ]}
          >
            <Input
              placeholder="e.g., NYC"
              disabled={viewMode}
              maxLength={5}
              style={{ textTransform: "uppercase" }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select disabled={viewMode}>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          {!viewMode && (
            <Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Button
                    onClick={closeDrawer}
                    style={{ width: "100%", backgroundColor: "#FFFFFF" }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%", backgroundColor: colors.secondary }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default City;
