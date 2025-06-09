import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Switch,
  Space,
  Row,
  Col,
  Popconfirm,
  Checkbox,
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
  fetchPermissions,
  fetchPermissionsById,
  addPermission,
  updatePermission,
  deletePermission,
  clearSelectedPermission,
  updateStatus,
} from "../../../store/slice/permissions/permissionsSlice";

const Permissions = () => {
  usePageTitle("Permissions");

  const dispatch = useDispatch();

  const permissions = useSelector((state) => state.permissions.permissions);
  const selectedPermissionFromStore = useSelector(
    (state) => state.permissions.selectedPermission
  );
  const loading = useSelector((state) => state.permissions.loading);
  const permissionLoading = useSelector(
    (state) => state.permissions.permissionLoading
  );
  const error = useSelector((state) => state.permissions.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPermissionId, setCurrentPermissionId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (drawerVisible && currentPermissionId && (isEditing || viewMode)) {
      dispatch(fetchPermissionsById(currentPermissionId));
    } else if (!drawerVisible) {
      dispatch(clearSelectedPermission());
      form.resetFields();
    }
  }, [drawerVisible, currentPermissionId, isEditing, viewMode, dispatch, form]);

  useEffect(() => {
    if (selectedPermissionFromStore) {
      form.setFieldsValue({
        ...selectedPermissionFromStore,
        status:
          selectedPermissionFromStore.status === 1 ||
          selectedPermissionFromStore.status === true
            ? "active"
            : "inactive",
      });
    } else if (!isEditing && !viewMode) {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
    }
  }, [selectedPermissionFromStore, form, isEditing, viewMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const showDrawer = (mode = "add", permissionId = null) => {
    form.resetFields();
    setCurrentPermissionId(permissionId);
    setIsEditing(mode === "edit");
    setViewMode(mode === "view");
    setDrawerVisible(true);
    dispatch(clearSelectedPermission());
    if (mode === "add") {
      form.setFieldsValue({ status: "active" });
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setCurrentPermissionId(null);
    form.resetFields();
    dispatch(clearSelectedPermission());
  };

  const onFinish = async (values) => {
    try {
      const processedValues = {
        ...values,
        status: values.status === "active" ? 1 : 0,
      };

      let resultAction;
      if (isEditing && selectedPermissionFromStore) {
        resultAction = await dispatch(
          updatePermission({
            id: selectedPermissionFromStore.id,
            permissionData: processedValues,
          })
        );
        if (updatePermission.fulfilled.match(resultAction)) {
          toast.success("Permission updated successfully");
          closeDrawer();
          dispatch(fetchPermissions());
        } else {
          toast.error(
            resultAction.payload?.message || "Failed to update permission"
          );
        }
      } else {
        resultAction = await dispatch(addPermission(processedValues));
        if (addPermission.fulfilled.match(resultAction)) {
          toast.success("Permission added successfully");
          closeDrawer();
          dispatch(fetchPermissions());
        } else {
          toast.error(resultAction.payload?.message || "Failed to add Permission");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred during form submission.");
    }
  };

  const handleDeletePermission = async (id) => {
    try {
      const resultAction = await dispatch(deletePermission(id));
      if (deletePermission.fulfilled.match(resultAction)) {
        toast.success("Permission deleted successfully.");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete permission");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? 1 : 0;
    const resultAction = await dispatch(
      updateStatus({ id: record.id, status: newStatus })
    );
    if (updateStatus.fulfilled.match(resultAction)) {
      toast.success(
        `Permission status updated to ${newStatus === 1 ? "Active" : "Inactive"}.`
      );
    } else {
      toast.error(resultAction.payload || "Failed to update permission status.");
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
            title="Delete the Permission"
            description="Are you sure to delete this permission?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeletePermission(record.id)}
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

  const filteredPermissions = permissions.filter(
    (permission) =>
      permission.name?.toLowerCase().includes(searchTerm) ||
      permission.description?.toLowerCase().includes(searchTerm)
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
            onClick={() => showDrawer("add")}
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
            dataSource={filteredPermissions}
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
            {permissionLoading ? (
              <p>Loading...</p>
            ) : viewMode ? (
              "View Permission"
            ) : isEditing ? (
              "Edit Permission"
            ) : (
              "Add New Permission"
            )}
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
        {permissionLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading permission data...</p>
          </div>
        ) : viewMode && !selectedPermissionFromStore ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Permission data not found.</p>
          </div>
        ) : (
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
        )}
      </Drawer>
    </div>
  );
};

export default Permissions;