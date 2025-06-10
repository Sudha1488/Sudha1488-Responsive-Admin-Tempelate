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
  fetchCities,
  fetchCityById,
  addCity,
  updateCity,
  deleteCity,
  updateCityStatus,
  clearError,
  clearSelectedCity,
} from "../../../store/slice/city/citySlice";
import { fetchStates } from "../../../store/slice/helper/helperSlice";
import CityViewDetails from "./CityViewDetails";

const City = () => {
  usePageTitle("City");

  const dispatch = useDispatch();

  const cities = useSelector((state) => state.cities.cities);
  const selectedCityFromStore = useSelector(
    (state) => state.cities.selectedCity
  );
  const stateList = useSelector((state) => state.helper.statesList);
  const loading = useSelector((state) => state.cities.loading);
  const cityLoading = useSelector((state) => state.cities.cityLoading);
  const error = useSelector((state) => state.cities.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCityId, setCurrentCityId] = useState(null);
  const [stateFilter, setStateFilter] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (drawerVisible && currentCityId && (isEditing || viewMode)) {
      dispatch(fetchCityById(currentCityId));
    } else if (!drawerVisible) {
      dispatch(clearSelectedCity());
      form.resetFields();
    }
  }, [drawerVisible, currentCityId, isEditing, viewMode, dispatch, form]);

  useEffect(() => {
    if (selectedCityFromStore) {
      form.setFieldsValue({
        ...selectedCityFromStore,
        stateId: selectedCityFromStore.stateId?.id,
        status:
          selectedCityFromStore.status === 1 ||
          selectedCityFromStore.status === true
            ? "active"
            : "inactive",
      });
    } else if (!isEditing && !viewMode) {
      form.resetFields();
      form.setFieldsValue({ status: "active" });
    }
  }, [selectedCityFromStore, form, isEditing, viewMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showDrawer = (mode = "add", cityId = null) => {
    form.resetFields();
    setCurrentCityId(cityId);
    setIsEditing(mode === "edit");
    setViewMode(mode === "view");
    setDrawerVisible(true);
    dispatch(clearSelectedCity());
    if (mode === "add") {
      form.setFieldsValue({ status: "active" });
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setCurrentCityId(null);
    form.resetFields();
    dispatch(clearSelectedCity());
  };

  const onFinish = async (values) => {
    try {
      const processedValues = {
        ...values,
        status: values.status === "active" ? 1 : 0,
        code: values.code === undefined ? null : values.code,
        state_id: values.stateId,
      };
      if (isEditing && selectedCityFromStore) {
        try {
          const result = await dispatch(
            updateCity({
              id: selectedCityFromStore.id,
              cityData: processedValues,
            })
          ).unwrap();
          toast.success("City updated successfully");
          closeDrawer();
          dispatch(fetchCities());
        } catch (error) {
          toast.error(
            error.payload || error.message || "Failed to update citye."
          );
        }
      } else {
        try {
          await dispatch(addCity(processedValues)).unwrap();
          toast.success("City added successfully");
          closeDrawer();
          dispatch(fetchCities());
        } catch (error) {
          toast.error(error.payload || error.message || "Failed to add city.");
        }
      }
      closeDrawer();
    } catch (error) {
      toast.error("An unexpected error occurred during form submission.");
      console.error("Unhandled error during form submission:", error);
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      const resultAction = await dispatch(deleteCity(id));
      if (deleteCity.fulfilled.match(resultAction)) {
        toast.success("City Deleted successfully.");
        dispatch(fetchCities()); 
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete city");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? 1 : 0;
    const resultAction = await dispatch(
      updateCityStatus({ id: record.id, status: newStatus })
    );
    if (updateCityStatus.fulfilled.match(resultAction)) {
      toast.success(
        `City status updated to ${newStatus === 1 ? "Active" : "Inactive"}.`
      );
      dispatch(fetchCities());
    } else {
      toast.error(resultAction.payload || "Failed to update City status.");
    }
  };
  const getStateName = (stateId) => {
    if (!stateList || !Array.isArray(stateList) || stateList.length === 0) {
        return "Loading States...";
    }
    const state = stateList.find((s) => s.id === stateId);
    return state ? state.name : "Unknown State";
};

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => {
        return record.code ? record.code : `${record.name}_code`;
      },
    },
    {
      title: "State",
      dataIndex: ["stateId", "name"],
      key: "stateId",
      render: (text, record) => {
        return record.stateId?.name || getStateName(record.stateId);
      },
      sorter: (a, b) => (getStateName(a.stateId) || "").localeCompare(getStateName(b.stateId) || ""),
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
            title="Delete the City"
            description="Are you sure to delete this city?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteCity(record.id)}
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

  const filteredCities = cities.filter(
    (city) =>
      city.name?.toLowerCase().includes(searchTerm) ||
      String(city.code || "")
        .toLowerCase()
        .includes(searchTerm)
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
            loading={!stateList.length}
          >
            {stateList.map((state) => (
              <Option key={state.id} value={state.id}>
                {state.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table
          dataSource={filteredCities}
          columns={columns}
          loading={loading}
          rowKey="id"
          scroll={{ x: 900 }}
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
      >{cityLoading ? (<div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading state data...</p>
          </div>): viewMode && selectedCityFromStore? (<CityViewDetails city={selectedCityFromStore}/>):(<Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "active" }}
        >
          <Form.Item
            name="name"
            label="City Name"
            rules={[{ required: true, message: "Please enter the city name" },
              { min: 2, message: "State name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter city name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="code"
            label="City Code"
            rules={[
              // { required: true, message: "Please enter city code" },
            ]}
          >
            <Input
              placeholder="Enter city code"
              disabled={viewMode}
              maxLength={10}
              // style={{ textTransform: "uppercase" }}
            />
          </Form.Item>

          <Form.Item
            name="stateId"
            label="State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select placeholder="Select state" disabled={viewMode} showSearch>
              {stateList.map((state) => (
                <Option key={state.id} value={state.id}>
                  {state.name}
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
                    style={{ width: "100%", backgroundColor: colors.secondary }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          )}
        </Form>)}
        
      </Drawer>
    </div>
  );
};

export default City;
