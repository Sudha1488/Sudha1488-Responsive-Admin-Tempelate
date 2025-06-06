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
  Switch,
} from "antd";
const { Option } = Select;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import colors from "../../../theme/color";
import usePageTitle from "../../../hooks/usePageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUser,
  deleteUser,
  clearSelectedUser,
  updateStatus,
} from "../../../store/slice/users/usersSlice";

import UserViewDetails from './UserViewDetails'; 

const User = () => {
  usePageTitle("User");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { action, id } = useParams();

  const users = useSelector((state) => state.users.users);
  const selectedUserFromStore = useSelector((state) => state.users.selectedUser);
  const loading = useSelector((state) => state.users.loading);
  const userLoading = useSelector((state) => state.users.userLoading);
  const error = useSelector((state) => state.users.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (action === "add") {
      showDrawer();
    } else if ((action === "edit" || action === "view") && id) {
      dispatch(fetchUserById(id));
      setDrawerVisible(true);
      setViewMode(action === "view");
      setIsEditing(action === "edit");
    } else {
      if (drawerVisible) {
        closeDrawer();
      }
    }
  }, [action, id, dispatch]);

  useEffect(() => {
    if (selectedUserFromStore) {
      form.setFieldsValue({
        ...selectedUserFromStore,
        status: selectedUserFromStore.status === 1 || selectedUserFromStore.status === true ? "active" : "inactive",
        role_id: Number(selectedUserFromStore.role_id), 
      });

      if (selectedUserFromStore.profileImg) {
        setFileList([
          {
            uid: "-1",
            name: "profile_img",
            status: "done",
            url: selectedUserFromStore.profileImg,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else if ((action === "edit" || action === "view") && !userLoading) {
    }
  }, [selectedUserFromStore, form, action, userLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setViewMode(false);
    setFileList([]);
    setDrawerVisible(true);
    dispatch(clearSelectedUser());
    navigate("/access/users/add");
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setFileList([]);
    form.resetFields();
    dispatch(clearSelectedUser());
    navigate("/access/users");
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      const processedValues = {
        ...values,
        status: values.status === "active" ? "1" : "0",
        role_id: String(values.role_id),
      };

      Object.keys(processedValues).forEach((key) => {
        if (key !== "profile_img" && processedValues[key] !== undefined && processedValues[key] !== null) {
          formData.append(key, String(processedValues[key]));
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_img", fileList[0].originFileObj);
      } 

      if (isEditing && selectedUserFromStore) {
        const resultAction = await dispatch(updateUser({ id: selectedUserFromStore.id, user: formData }));
        if (updateUser.fulfilled.match(resultAction)) {
          toast.success("User updated successfully");
          closeDrawer();
          dispatch(fetchUsers());
        } else {
          toast.error(resultAction.payload?.message || "Failed to update user");
        }
      } else {
        const resultAction = await dispatch(addUser(formData));
        if (addUser.fulfilled.match(resultAction)) {
          toast.success("User added successfully");
          closeDrawer();
          dispatch(fetchUsers());
        } else {
          toast.error(resultAction.payload?.message || "Failed to add user");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred during form submission.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const resultAction = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success("User deleted successfully.");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleStatusChange = async(checked, record)=>{
    const newStatus = checked ? 1: 0;
    await dispatch(updateStatus({id:record.id, status:newStatus}))
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      sorter: (a, b) => a.email.localeCompare(b.email),
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
      sorter: (a, b) => a.role_id - b.role_id,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status, record) => {
        const isActive = status === 1 || status === true;
        return (
          <Switch
            checked={isActive}
            onChange={(checked) => handleStatusChange(checked, record)}
            loading={loading}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            style={{
              backgroundColor: isActive ? colors.success : colors.error,
            }}
          />
        );
      },
      sorter: (a, b) => a.status - b.status,
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
            onClick={() => navigate(`/access/users/view/${record.id}`)}
            style={{
              backgroundColor: colors.buttonPrimaryBg,
              color: colors.buttonText,
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/access/users/edit/${record.id}`)}
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

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm) ||
      user.phone?.toLowerCase().includes(searchTerm)
  );

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
            dataSource={filteredUsers}
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
        width={800}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose={true}
        headerStyle={{
          backgroundColor: colors.secondary,
          borderBottom: "1px solid #444",
        }}
      >
        {userLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading user data...</p>
          </div>
        ) : viewMode && selectedUserFromStore ? (
          <UserViewDetails user={selectedUserFromStore} />
        ) : (
          (action === "add" || selectedUserFromStore) ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                status: "active",
                role_id: 2,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter the name" }]}>
                    <Input placeholder="Enter full name" disabled={viewMode} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="email" label="Email" rules={[
                    { required: true, message: "Please enter the email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}>
                    <Input placeholder="Enter email" disabled={viewMode} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter the phone no." }]}>
                    <Input placeholder="Enter phone number" disabled={viewMode} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="profile_img" label="Profile Image">
                    <Upload
                      fileList={fileList}
                      onChange={handleFileChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      accept="image/*"
                      disabled={viewMode}
                      listType="picture-card"
                    >
                      {!viewMode && fileList.length < 1 && (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>

                {!isEditing && (
                  <Col span={12}>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter the password" }]}>
                      <Input.Password placeholder="Enter password" disabled={viewMode} />
                    </Form.Item>
                  </Col>
                )}

                <Col span={12}>
                  <Form.Item name="date_of_birth" label="Date of Birth">
                    <Input type="date" placeholder="Select date of birth" disabled={viewMode} />
                  </Form.Item>
                </Col>

                {action === "add" && (
                  <>
                    <Col span={12}>
                      <Form.Item name="country_id" label="Country">
                        <Input placeholder="Enter country" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="state_id" label="State">
                        <Input placeholder="Enter state" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="city_id" label="City">
                        <Input placeholder="Enter city" />
                      </Form.Item>
                    </Col>
                  </>
                )}

                <Col span={12}>
                  <Form.Item name="role_id" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
                    <Select disabled={viewMode}>
                      <Option value={1}>Admin</Option>
                      <Option value={2}>User</Option>
                      <Option value={3}>Manager</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                    <Select disabled={viewMode}>
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="address" label="Address">
                    <Input.TextArea rows={3} placeholder="Enter full address" disabled={viewMode} />
                  </Form.Item>
                </Col>
              </Row>

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
                        loading={loading}
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
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>User data not found.</p>
            </div>
          )
        )}
      </Drawer>
    </div>
  );
};

export default User;