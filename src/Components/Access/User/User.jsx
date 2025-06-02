import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Space,
  message,
  Row,
  Col,
  Popconfirm,
  Upload,
} from "antd";
const { Option } = Select;

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import colors from "../../../theme/color";
import usePageTitle from "../../../hooks/usePageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../../store/slice/users/usersSlice";

const User = () => {
  usePageTitle("User");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { action, id } = useParams();

  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if ((action === "edit" || action === "view") && id && users.length === 0) {
      dispatch(fetchUsers());
      return;
    }
    if (action) {
      if (action === "add") {
        showDrawer();
      } else if (action === "edit" && id && users.length > 0) {
        const user = users.find((u) => u.id.toString() === id);
        if (user) {
          openEditDrawer(user);
        }
      } else if (action === "view" && id && users.length > 0) {
        const user = users.find((u) => u.id.toString() === id);
        if (user) {
          viewUser(user);
        }
      }
    } else {
      setDrawerVisible(false);
    }
  }, [action, id]);

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedUser(null);
    setViewMode(false);
    setFileList([]);
    setDrawerVisible(true);
    navigate("/access/users/add");
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedUser(null);
    setViewMode(false);
    setFileList([]);
    form.resetFields();
    navigate("/access/users");
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'profile_img') {
          formData.append(key, values[key]);
        }
      });
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('profile_img', fileList[0].originFileObj);
      }

      if (isEditing && selectedUser) {
        await dispatch(updateUser({ id: selectedUser.id, user: formData }));
        toast.success("User updated successfully");
      } else {
        await dispatch(addUser(formData));
        toast.success("User added successfully");
      }
      closeDrawer();
      dispatch(fetchUsers());
    } catch (error) {
      toast.error("Failed to upload data");
    }
  };

  const openEditDrawer = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setViewMode(false);
    setDrawerVisible(true);
    form.setFieldsValue(user);
    
    if (user.profile_img) {
      setFileList([{
        uid: '-1',
        name: 'profile_img',
        status: 'done',
        url: user.profile_img,
      }]);
    }
    
    navigate(`/access/users/edit/${user.id}`);
  };

  const viewUser = (user) => {
    setSelectedUser(user);
    setViewMode(true);
    setIsEditing(false);
    setDrawerVisible(true);
    form.setFieldsValue(user);
    
 
    if (user.profile_img) {
      setFileList([{
        uid: '-1',
        name: 'profile_img',
        status: 'done',
        url: user.profile_img,
      }]);
    }
    
    navigate(`/access/users/view/${user.id}`);
  };

  const handleDeleteUser = async (id) => {
    try {
      await dispatch(deleteUser(id));
      toast.success("User deleted successfully.");
      dispatch(fetchUsers());
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return false;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role_id",
      width: 100,
      render: (role_id) => {
        const roles = {
          1: "Admin",
          2: "User",
          3: "Manager",
        };
        return roles[role_id] || "Unknown";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,

      render: (status) => {
        const isActive = status === 1 || status === true;
        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewUser(record)}
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
            title="Delete the User"
            description="Are you sure to delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteUser(record.id)}
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
            List of Users
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
            Add User
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
            placeholder="Search by name, email or phone"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{ width: 250 }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={users.filter(
              (user) =>
                user.name?.toLowerCase().includes(searchTerm) ||
                user.email?.toLowerCase().includes(searchTerm) ||
                user.phone?.toLowerCase().includes(searchTerm)
            )}
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 900 }}
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
            {viewMode ? "View User" : isEditing ? "Edit User" : "Add New User"}
          </div>
        }
        width={400}
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
            role_id: 2,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter full name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter the phone no." }]}
          >
            <Input placeholder="Enter phone number" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="profile_img"
            label="Profile Image"
          >
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
              disabled={viewMode}
            >
              {!viewMode && (
                <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
              )}
            </Upload>
          </Form.Item>

          {!isEditing && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <Input.Password placeholder="Enter password" disabled={viewMode} />
            </Form.Item>
          )}

          <Form.Item
            name="date_of_birth"
            label="Date of Birth"
          >
            <Input 
              type="date" 
              placeholder="Select date of birth" 
              disabled={viewMode} 
            />
          </Form.Item>

          <Form.Item
            name="country_id"
            label="Country"
          >
            <Input placeholder="Enter country" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="state_id"
            label="State"
          >
            <Input placeholder="Enter state" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="city_id"
            label="City"
          >
            <Input placeholder="Enter city" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea 
              rows={3}
              placeholder="Enter full address" 
              disabled={viewMode} 
            />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select disabled={viewMode}>
              <Option value={1}>Admin</Option>
              <Option value={2}>User</Option>
              <Option value={3}>Manager</Option>
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

export default User;