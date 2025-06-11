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
  fetchStates,
  fetchStateById,
  addState,
  updateState,
  deleteState,
  updateStateStatus,
  clearSelectedState,
  clearError,
} from "../../../store/slice/state/stateSlice";
import { fetchCountries } from "../../../store/slice/helper/helperSlice";
import StateViewDetails from "./StateViewDetails";

const State = () => {
  usePageTitle("State");

  const dispatch = useDispatch();

  const states = useSelector((state) => state.states.states);
  const selectedStateFromStore = useSelector(
    (state) => state.states.selectedState
  );
  const countriesList = useSelector((state) => state.helper.countriesList);
  const loading = useSelector((state) => state.states.loading);
  const stateLoading = useSelector((state) => state.states.stateLoading);
  const error = useSelector((state) => state.states.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStateId, setCurrentStateId] = useState(null);
  const [countryFilter, setCountryFilter] = useState(null); // Added country filter state

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (drawerVisible && currentStateId && (isEditing || viewMode)) {
      dispatch(fetchStateById(currentStateId));
    } else if (!drawerVisible) {
      dispatch(clearSelectedState());
      form.resetFields();
    }
  }, [drawerVisible, currentStateId, isEditing, viewMode, dispatch, form]);

  useEffect(() => {
    if (selectedStateFromStore) {
      form.setFieldsValue({
        ...selectedStateFromStore,
        countryId: selectedStateFromStore.countryId?.id,
        status:
          selectedStateFromStore.status === 1 ||
          selectedStateFromStore.status === true
            ? "active"
            : "inactive",
      });
    } else if (!isEditing && !viewMode) {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
    }
  }, [selectedStateFromStore, form, isEditing, viewMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError);
    }
  }, [error, dispatch]);

  const showDrawer = (mode = "add", stateId = null) => {
    form.resetFields();
    setCurrentStateId(stateId);
    setIsEditing(mode === "edit");
    setViewMode(mode === "view");
    setDrawerVisible(true);
    dispatch(clearSelectedState());
    if (mode === "add") {
      form.setFieldsValue({ status: "active" });
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setCurrentStateId(null);
    form.resetFields();
    dispatch(clearSelectedState());
  };

  const onFinish = async (values) => {
    try {
      const processedValues = {
        ...values,
        status: values.status === "active" ? 1 : 0,
        country_id: values.countryId,
      };

      if (isEditing && selectedStateFromStore) {
        try {
          const result = await dispatch(
            updateState({
              id: selectedStateFromStore.id,
              stateData: processedValues,
            })
          ).unwrap();
          toast.success("State updated successfully");
          closeDrawer();
          dispatch(fetchStates());
        } catch (error) {
          toast.error(
            error.payload || error.message || "Failed to update state."
          );
        }
      } else {
        try {
          await dispatch(addState(processedValues)).unwrap();
          toast.success("State added successfully");
          closeDrawer();
          dispatch(fetchStates());
        } catch (error) {
          toast.error(error.payload || error.message || "Failed to add state.");
        }
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred during form submission."
      );
      console.error("Unhandled error during form submission:", error);
    }
  };

  const handleDeleteState = async (id) => {
    try {
      const resultAction = await dispatch(deleteState(id));
      if (deleteState.fulfilled.match(resultAction)) {
        toast.success("State Deleted successfully.");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete state");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? 1 : 0;
    const resultAction = await dispatch(
      updateStateStatus({ id: record.id, status: newStatus })
    );
    if (updateStateStatus.fulfilled.match(resultAction)) {
      toast.success(
        `State status updated to ${newStatus === 1 ? "Active" : "Inactive"}.`
      );
    } else {
      toast.error(resultAction.payload || "Failed to update State status.");
    }
  };

  const getCountryName = (countryId) => {
    if (!countriesList || !Array.isArray(countriesList)) {
      return "Loading Countries...";
    }
    const country = countriesList.find((c) => c.id === countryId);
    return country ? country.name : "Unknown Country";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Country",
      dataIndex: ["countryId", "name"],
      key: "countryId",
      render: (text, record) => {
        return record.countryId?.name || getCountryName(record.countryId);
      },
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
      sorter: (a, b) => (a.status ? 1 : 0) - (b.status ? 1 : 0),
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
            title="Delete the State"
            description="Are you sure to delete this state?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteState(record.id)}
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

  const filteredStates = states.filter(
    (state) =>
      state.name?.toLowerCase().includes(searchTerm) &&
      (countryFilter ? state.countryId?.id === countryFilter : true)
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
            List of States
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
            Add State
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
            gap: "12px", 
          }}
        >
          <Input.Search
            placeholder="Search by name"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{ width: 200 }}
          />

          <Select
            placeholder="Filter by Country"
            allowClear
            style={{ width: 180 }}
            onChange={(value) => setCountryFilter(value)}
            loading={!countriesList.length}
          >
            {countriesList.map((country) => (
              <Option key={country.id} value={country.id}>
                {country.name}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={filteredStates}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ x: 900 }}
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
            {viewMode
              ? "View State"
              : isEditing
              ? "Edit State"
              : "Add New State"}
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
        {stateLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading state data...</p>
          </div>
        ) : viewMode && selectedStateFromStore ? (
          <StateViewDetails state={selectedStateFromStore} />
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
              label="State Name"
              rules={[
                { required: true, message: "Please enter the state name" },
                { min: 2, message: "State name must be at least 2 characters" },
              ]}
            >
              <Input
                placeholder="Enter state name"
                disabled={viewMode}
                // style={{ textTransform: "uppercase" }}
              />
            </Form.Item>

            <Form.Item
              name="countryId"
              label="Country"
              rules={[{ required: true, message: "Please select a country" }]}
            >
              <Select
                placeholder="Select country"
                disabled={viewMode}
                loading={!countriesList.length}
                showSearch
              >
                {countriesList.map((country) => (
                  <Option key={country.id} value={country.id}>
                    {country.name}
                  </Option>
                ))}
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
        )}
      </Drawer>
    </div>
  );
};

export default State;