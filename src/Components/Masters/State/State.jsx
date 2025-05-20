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

const staticCountries = [
  { id: 1, name: "United States", code: "US" },
  { id: 2, name: "United Kingdom", code: "UK" },
  { id: 3, name: "Canada", code: "CA" },
  { id: 4, name: "Australia", code: "AU" },
  { id: 5, name: "Germany", code: "DE" },
  { id: 6, name: "France", code: "FR" },
  { id: 7, name: "Japan", code: "JP" },
];

const staticStates = [
  {
    id: 1,
    name: "California",
    code: "CA",
    countryId: 1,
    status: "active",
  },
  {
    id: 2,
    name: "Texas",
    code: "TX",
    countryId: 1,
    status: "active",
  },
  {
    id: 3,
    name: "New York",
    code: "NY",
    countryId: 1,
    status: "inactive",
  },
  {
    id: 4,
    name: "England",
    code: "ENG",
    countryId: 2,
    status: "active",
  },
  {
    id: 5,
    name: "Scotland",
    code: "SCO",
    countryId: 2,
    status: "active",
  },
  {
    id: 6,
    name: "Ontario",
    code: "ON",
    countryId: 3,
    status: "active",
  },
  {
    id: 7,
    name: "Queensland",
    code: "QLD",
    countryId: 4,
    status: "inactive",
  },
  {
    id: 8,
    name: "Bavaria",
    code: "BAV",
    countryId: 5,
    status: "active",
  },
];

const State = () => {
  const [states, setStates] = useState(staticStates);
  const [loading, setLoading] = useState(false);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState(null);
  
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedState(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedState(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      if (isEditing && selectedState) {
        const updated = states.map((state) =>
          state.id === selectedState.id ? { ...state, ...values } : state
        );
        setStates(updated);
        toast.success("State updated successfully");
      } else {
        const newState = {
          ...values,
          id: Math.max(...states.map((s) => s.id)) + 1,
        };
        const updated = [...states, newState];
        setStates(updated);
        toast.success("State added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save state");
    }
  };

  const openEditDrawer = (state) => {
    setSelectedState(state);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(state);
  };

  const viewState = (state) => {
    setSelectedState(state);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(state);
  };

  const deleteState = (id) => {
    try {
      const updated = states.filter((s) => s.id !== id);
      setStates(updated);
      toast.success("State deleted successfully");
    } catch (error) {
      toast.error("Failed to delete state");
    }
  };

  const getCountryName = (countryId) => {
    const country = staticCountries.find(c => c.id === countryId);
    return country ? country.name : "Unknown";
  };

  const filteredStates = states.filter(state => {
    const matchesSearch = 
      state.name.toLowerCase().includes(searchTerm) ||
      state.code.toLowerCase().includes(searchTerm);
    const matchesCountry = countryFilter ? state.countryId === countryFilter : true;
    
    return matchesSearch && matchesCountry;
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Country",
      dataIndex: "countryId",
      key: "countryId",
      render: (countryId) => getCountryName(countryId),
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
            onClick={() => viewState(record)}
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
            title="Delete the State"
            description="Are you sure to delete this state?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteState(record.id)}
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
            List of States
          </h2>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Search by name or code"
              allowClear
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              style={{ width: 200 }}
            />

            <Select
              placeholder="Filter by Country"
              allowClear
              style={{ width: 160 }}
              onChange={(value) => setCountryFilter(value)}
            >
              {staticCountries.map(country => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>

            <Button
              icon={<PlusOutlined />}
              type="primary"
              size="middle"
              style={{
                backgroundColor: colors.secondary,
                border: "none",
                padding: "0 16px",
              }}
              onClick={showDrawer}
            >
              Add State
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
        <div style={{ overflowX: "auto" }}>

        <Table
          dataSource={filteredStates}
          columns={columns}
          loading={loading}
          rowKey="id"
          scroll={{x:900}}
          pagination={{ pageSize: 10 }}
        />
        </div>
      </div>

      <Drawer
        title={
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            {viewMode ? "View State" : isEditing ? "Edit State" : "Add New State"}
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
          initialValues={{
            status: "active",
          }}
        >
          <Form.Item
            name="countryId"
            label="Country"
            rules={[{ required: true, message: "Please select a country" }]}
          >
            <Select 
              placeholder="Select country" 
              disabled={viewMode}
            >
              {staticCountries.map(country => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="State/Province Name"
            rules={[
              { required: true, message: "Please enter the state name" },
              { min: 2, message: "State name must be at least 2 characters" }
            ]}
          >
            <Input placeholder="Enter state/province name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="code"
            label="State/Province Code"
            rules={[
              { required: true, message: "Please enter state code" },
              { min: 2, max: 5, message: "State code must be between 2-5 characters" },
            ]}
          >
            <Input 
              placeholder="Enter state code (e.g., CA, TX)" 
              disabled={viewMode}
              maxLength={5}
              style={{ textTransform: 'uppercase' }}
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
                    style={{
                      width: "100%",
                      backgroundColor: colors.secondary,
                    }}
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

export default State;