import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Table,
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
import { fetchRoles } from "../../../store/slice/helper/helperSlice";

import UserViewDetails from "./UserViewDetails";
import moment from "moment";

const User = () => {
  usePageTitle("User");
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.users);
  const selectedUserFromStore = useSelector(
    (state) => state.users.selectedUser
  );
  const loading = useSelector((state) => state.users.loading);
  const userLoading = useSelector((state) => state.users.userLoading);
  const error = useSelector((state) => state.users.error);
  const roles = useSelector((state) => state.helper.rolesList);
  const rolesLoading = useSelector((state) => state.helper.loading);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileList, setFileList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (drawerVisible && currentUserId && (isEditing || viewMode)) {
      dispatch(fetchUserById(currentUserId));
    } else if (!drawerVisible) {
      dispatch(clearSelectedUser());
      form.resetFields();
      setFileList([]);
    }
  }, [drawerVisible, currentUserId, isEditing, viewMode, dispatch, form]);

  useEffect(() => {
    if (selectedUserFromStore) {
      form.setFieldsValue({
        ...selectedUserFromStore,
        status:
          selectedUserFromStore.status === 1 ||
          selectedUserFromStore.status === true
            ? "active"
            : "inactive",
        role_id: Number(selectedUserFromStore.roleId?.id),
        date_of_birth: selectedUserFromStore.dateOfBirth
          ? moment(selectedUserFromStore.dateOfBirth).format("YYYY-MM-DD")
          : undefined,
      });

      if (selectedUserFromStore.profile_img) {
        setFileList([
          {
            uid: "-1",
            name: selectedUserFromStore.profile_img.split("/").pop(),
            status: "done",
            url: selectedUserFromStore.profile_img,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else if (!isEditing && !viewMode) {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
      setFileList([]);
    }
  }, [selectedUserFromStore, form, isEditing, viewMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const showDrawer = (mode = "add", userId = null) => {
    form.resetFields();
    setFileList([]);
    setCurrentUserId(userId);
    setIsEditing(mode === "edit");
    setViewMode(mode === "view");
    setDrawerVisible(true);
    dispatch(clearSelectedUser());
    if (mode === "add") {
      form.setFieldsValue({ status: "active" });
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setCurrentUserId(null);
    setFileList([]);
    form.resetFields();
    dispatch(clearSelectedUser());
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
        if (
          key !== "profile_img" &&
          processedValues[key] !== undefined &&
          processedValues[key] !== null
        ) {
          formData.append(key, String(processedValues[key]));
        }
      });

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_img", fileList[0].originFileObj);
      } else if (
        isEditing &&
        !fileList.length &&
        selectedUserFromStore?.profile_img
      ) {
        formData.append("clear_profile_img", "true");
      }

      if (isEditing && selectedUserFromStore) {
        const resultAction = await dispatch(
          updateUser({ id: selectedUserFromStore.id, user: formData })
        );
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

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? 1 : 0;
    const resultAction = await dispatch(
      updateStatus({ id: record.id, status: newStatus })
    );

    if (updateStatus.fulfilled.match(resultAction)) {
      toast.success(
        `User status updated to ${newStatus === 1 ? "Active" : "Inactive"}.`
      );
    } else {
      toast.error(resultAction.payload || "Failed to update user status.");
    }
  };

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
      dataIndex: "roleId",
      key: "roleId",
      width: 100,
      render: (roleIdObject) => {
        return roleIdObject?.name || "Unknown";
      },
      sorter: (a, b) => (a.roleId?.name || "").localeCompare(b.roleId?.name || ""),
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
            onClick={() => showDrawer("view", record.id)}
            style={{
              backgroundColor: colors.buttonPrimaryBg,
              color: colors.buttonText,
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showDrawer("edit", record.id)}
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
            onClick={() => showDrawer("add")}
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
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading user data...</p>
          </div>
        ) : viewMode && selectedUserFromStore ? (
          <UserViewDetails user={selectedUserFromStore} />
        ) : !viewMode || selectedUserFromStore ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              status: "active",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input placeholder="Enter full name" disabled={viewMode} />
                </Form.Item>
              </Col>

              <Col span={12}>
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
              </Col>

              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    { required: true, message: "Please enter the phone no." },
                  ]}
                >
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
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter the password" },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter password"
                      disabled={viewMode}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col span={12}>
                <Form.Item name="date_of_birth" label="Date of Birth">
                  <Input
                    type="date"
                    placeholder="Select date of birth"
                    disabled={viewMode}
                  />
                </Form.Item>
              </Col>

              {!isEditing && (
                <>
                  <Col span={12}>
                    <Form.Item name="country_id" label="Country">
                      <Input placeholder="Enter country" disabled={viewMode} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="state_id" label="State">
                      <Input placeholder="Enter state" disabled={viewMode} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="city_id" label="City">
                      <Input placeholder="Enter city" disabled={viewMode} />
                    </Form.Item>
                  </Col>
                </>
              )}

              <Col span={12}>
                <Form.Item
                  name="role_id"
                  label="Role"
                  rules={[{ required: true, message: "Please select a role" }]}
                >
                  <Select
                    disabled={viewMode || rolesLoading}
                    showSearch
                    placeholder="Select a role"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    loading={rolesLoading}
                  >
                    {roles.map((role) => (
                      <Option key={role.id} value={role.id}>
                        {role.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
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
              </Col>

              <Col span={24}>
                <Form.Item name="address" label="Address">
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter full address"
                    disabled={viewMode}
                  />
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
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>User data not found.</p>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default User;