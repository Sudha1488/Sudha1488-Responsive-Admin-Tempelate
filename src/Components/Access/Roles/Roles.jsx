import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  Space,
  Popconfirm,
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
  fetchRoles,
  fetchRoleById,
  addRole, 
  updateRole,
  deleteRole, 
  clearSelectedRole,
  updateStatus,
} from "../../../store/slice/roles/rolesSlice";
import { useNavigate, useParams } from "react-router-dom";
import RoleViewDetails from "./RoleViewDetails";



const Roles = () => {
  usePageTitle("Roles");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { action, id } = useParams();

  const roles = useSelector((state) => state.roles.roles);
  const selectedRoleFromStore = useSelector(
    (state) => state.roles.selectedRole
  );
  const loading = useSelector((state) => state.roles.loading);
  const roleLoading = useSelector((state) => state.roles.roleLoading);
  const error = useSelector((state) => state.roles.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (action === "add") {
      showDrawer();
    } else if ((action === "edit" || action === "view") && id) {
      dispatch(fetchRoleById(id));
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
    if (selectedRoleFromStore) {
      form.setFieldsValue({
        ...selectedRoleFromStore,
        status: selectedRoleFromStore.status === 1 || selectedRoleFromStore.status === true ? "active" : "inactive",
        role_id: Number(selectedRoleFromStore.role_id), 
      });

    } else if ((action === "edit" || action === "view") && !roleLoading) {
    }
  }, [selectedRoleFromStore, form, action, roleLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setViewMode(false);
    setDrawerVisible(true);
    dispatch(clearSelectedRole()); 
    navigate("/access/roles/add");
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    form.resetFields();
    dispatch(clearSelectedRole()); 
    navigate("/access/roles");
  };

  const onFinish = async (values) => {
    try {
      const processedValues = {
        ...values,
        status: values.status === "active" ? 1 : 0,
      };

      let resultAction;
      if (isEditing && selectedRoleFromStore) {
        resultAction = await dispatch(
          updateRole({ id: selectedRoleFromStore.id, role: processedValues })
        );
        if (updateRole.fulfilled.match(resultAction)) {
          toast.success("Role updated successfully");
          closeDrawer();
          dispatch(fetchRoles());
        } else {
          toast.error(resultAction.payload?.message || "Failed to update role");
        }
      } else {
        resultAction = await dispatch(addRole(processedValues));
        if (addRole.fulfilled.match(resultAction)) {
          toast.success("Role added successfully");
          closeDrawer();
          dispatch(fetchRoles());
        } else {
          toast.error(resultAction.payload?.message || "Failed to add role");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred during form submission.");
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      const resultAction = await dispatch(deleteRole(id));
      if (deleteRole.fulfilled.match(resultAction)) {
        toast.success("Role deleted successfully.");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete role");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
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
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/access/roles/view/${record.id}`)}
            style={{
              backgroundColor: colors.buttonPrimaryBg,
              color: colors.buttonText,
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/access/roles/edit/${record.id}`)}
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
            onConfirm={() => handleDeleteRole(record.id)}
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

  const filteredRoles = roles.filter(
    (role) =>
      role.name?.toLowerCase().includes(searchTerm) ||
      role.description?.toLowerCase().includes(searchTerm)
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
            List of Roles
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
            Add Role
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
            style={{ width: 250 }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={filteredRoles}
            columns={columns}
            loading={loading}
            scroll={{ x: 900 }}
            rowKey="id"
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
            {viewMode ? "View Role" : isEditing ? "Edit Role" : "Add New Role"}
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
        {roleLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading role data...</p>
          </div>
        ) : viewMode && selectedRoleFromStore ? (
          <RoleViewDetails role={selectedRoleFromStore} />
        ) : (
          (action === "add" || selectedRoleFromStore) ? (
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
                  <Space>
                    <Button
                      onClick={closeDrawer}
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={{
                        backgroundColor: colors.secondary,
                      }}
                    >
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              )}
            </Form>
          ) : (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Role data not found.</p>
            </div>
          )
        )}
      </Drawer>
    </div>
  );
};

export default Roles;