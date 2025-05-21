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

const staticPermissions = [
  {
    id: 1,
    name: "User Management",
    description: "Create, update, and delete users",
    status: "active",
  },
  {
    id: 2,
    name: "Role Management",
    description: "Create, update, and delete roles",
    status: "active",
  },
  {
    id: 3,
    name: "Content Management",
    description: "Manage website content and pages",
    status: "inactive",
  },
  {
    id: 4,
    name: "System Settings",
    description: "Configure system settings and parameters",
    status: "active",
  },
];

const Permissions = () => {
  const [permissions, setPermissions] = useState(staticPermissions);
  const [loading, setLoading] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedPermission(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedPermission(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      if (isEditing && selectedPermission) {
        const updated = permissions.map((permission) =>
          permission.id === selectedPermission.id
            ? { ...permission, ...values }
            : permission
        );
        setPermissions(updated);
        toast.success("Permission updated successfully");
      } else {
        const newPermission = {
          ...values,
          id: Math.max(...permissions.map((p) => p.id)) + 1,
        };
        const updated = [...permissions, newPermission];
        setPermissions(updated);
        toast.success("Permission added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save permission");
    }
  };

  const openEditDrawer = (permission) => {
    setSelectedPermission(permission);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(permission);
  };

  const viewPermission = (permission) => {
    setSelectedPermission(permission);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(permission);
  };

  const deletePermission = (id) => {
    try {
      const updated = permissions.filter((p) => p.id !== id);
      setPermissions(updated);
      toast.success("Permission deleted successfully");
    } catch (error) {
      toast.error("Failed to delete permission");
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
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewPermission(record)}
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
            title="Delete the Permission"
            description="Are you sure to delete this permission?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deletePermission(record.id)}
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
            List of Permissions
          </h2>

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
            Add Permission
          </Button>
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
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Input.Search
            placeholder="Search by name or description"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{ width: 300 }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={permissions.filter(
              (permission) =>
                permission.name?.toLowerCase().includes(searchTerm) ||
                permission.description?.toLowerCase().includes(searchTerm)
            )}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ x: 900 }}
            pagination={{ pageSize: 5 }}
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
            {viewMode
              ? "View Permission"
              : isEditing
              ? "Edit Permission"
              : "Add New Permission"}
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
            name="name"
            label="Permission Name"
            rules={[
              { required: true, message: "Please enter the permission name" },
            ]}
          >
            <Input placeholder="Enter permission name" disabled={viewMode} />
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

export default Permissions;
