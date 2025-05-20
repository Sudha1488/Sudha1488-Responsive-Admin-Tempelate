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

const staticRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all modules",
    permission: ["read", "write", "update", "delete"],
    status: "active",
  },
  {
    id: 2,
    name: "Editor",
    description: "Can edit and update content",
    permission: ["read", "write", "update"],
    status: "active",
  },
  {
    id: 3,
    name: "Viewer",
    description: "Read-only access",
    permission: ["read"],
    status: "inactive",
  },
];

const Roles = () => {
  const [roles, setRoles] = useState(staticRoles);
  const [loading, setLoading] = useState(false);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedRole(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedRole(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      if (isEditing && selectedRole) {
        const updated = roles.map((role) =>
          role.id === selectedRole.id ? { ...role, ...values } : role
        );
        setRoles(updated);
        toast.success("Role updated successfully");
      } else {
        const newRole = {
          ...values,
          id: Math.max(...roles.map((r) => r.id)) + 1,
        };
        const updated = [...roles, newRole];
        setRoles(updated);
        toast.success("Role added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save role");
    }
  };

  const openEditDrawer = (role) => {
    setSelectedRole(role);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(role);
  };

  const viewRole = (role) => {
    setSelectedRole(role);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(role);
  };

  const deleteRole = (id) => {
    try {
      const updated = roles.filter((r) => r.id !== id);
      setRoles(updated);
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewRole(record)}
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
            title="Delete the Role"
            description="Are you sure to delete this role?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteRole(record.id)}
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
            List of Roles
          </h2>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Search by name or description"
              allowClear
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              style={{ width: 250 }}
            />

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
              Add Role
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
          dataSource={roles.filter(
            (role) =>
              role.name.toLowerCase().includes(searchTerm) ||
              role.description.toLowerCase().includes(searchTerm)
          )}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
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
            {viewMode ? "View Role" : isEditing ? "Edit Role" : "Add New Role"}
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
            permission: [],
          }}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter the role name" }]}
          >
            <Input placeholder="Enter role name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter description"
              disabled={viewMode}
            />
          </Form.Item>

          <Form.Item
            name="permission"
            label="Permissions"
            rules={[
              {
                required: true,
                message: "Please select at least one permission",
              },
            ]}
          >
            <Select
              mode="multiple"
              disabled={viewMode}
              placeholder="Select permissions"
            >
              <Option value="read">Read</Option>
              <Option value="write">Write</Option>
              <Option value="update">Update</Option>
              <Option value="delete">Delete</Option>
            </Select>
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

export default Roles;