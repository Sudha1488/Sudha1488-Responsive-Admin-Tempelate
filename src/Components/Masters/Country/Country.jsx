import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Table,
  Space,
  Row,
  Col,
  Popconfirm,
  Switch,
  Typography,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import colors from "../../../theme/color";
import usePageTitle from "../../../hooks/usePageTitle";
import {
  fetchCountries,
  fetchCountryById,
  addCountry,
  updateCountry,
  deleteCountry,
  clearSelectedCountry,
  updateCountryStatus,
} from "../../../store/slice/country/countrySlice";

import CountryViewDetails from "./CountryViewDetails";

const Country = () => {
  usePageTitle("Country");

  const dispatch = useDispatch();

  const countries = useSelector((state) => state.countries.countries);
  const selectedCountryFromStore = useSelector(
    (state) => state.countries.selectedCountry
  );
  const loading = useSelector((state) => state.countries.loading);
  const countryLoading = useSelector(
    (state) => state.countries.countryLoading
  );
  const error = useSelector((state) => state.countries.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCountryFromStore) {
      form.setFieldsValue({
        ...selectedCountryFromStore,
        status:
          selectedCountryFromStore.status === 1 ||
          selectedCountryFromStore.status === true
            ? "active"
            : "inactive",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        status: "active",
      });
    }
  }, [selectedCountryFromStore, form]);

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
    dispatch(clearSelectedCountry());
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    form.resetFields();
    dispatch(clearSelectedCountry());
  };

  const onFinish = async (values) => {
    try {
      const processedValues = {
        ...values,
        status: values.status === "active" ? 1 : 0,
      };

      let resultAction;
      if (isEditing && selectedCountryFromStore) {
        resultAction = await dispatch(
          updateCountry({
            id: selectedCountryFromStore.id,
            countryFormData: processedValues,
          })
        );
        if (updateCountry.fulfilled.match(resultAction)) {
          toast.success("Country updated successfully");
          closeDrawer();
          dispatch(fetchCountries());
        } else {
          toast.error(resultAction.payload?.message || "Failed to update country");
        }
      } else {
        resultAction = await dispatch(addCountry(processedValues));
        if (addCountry.fulfilled.match(resultAction)) {
          toast.success("Country added successfully");
          closeDrawer();
          dispatch(fetchCountries());
        } else {
          toast.error(resultAction.payload?.message || "Failed to add country");
        }
      }
    } catch (submitError) {
      toast.error("An unexpected error occurred during form submission.");
      console.error("Form submission error:", submitError);
    }
  };

  const handleDeleteCountry = async (id) => {
    try {
      const resultAction = await dispatch(deleteCountry(id));
      if (deleteCountry.fulfilled.match(resultAction)) {
        toast.success("Country deleted successfully.");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete country");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? 1 : 0;
    const resultAction = await dispatch(updateCountryStatus({ id: record.id, status: newStatus }));
    if (updateCountryStatus.fulfilled.match(resultAction)){
      toast.success(`Country status updated to ${newStatus === 1 ? 'Active' : 'Inactive'}.`);
    } else {
      toast.error(resultAction.payload || "Failed to update country status.");
    }
  };

  const viewCountry = (record) => {
    setViewMode(true);
    setIsEditing(false);
    setDrawerVisible(true);
    dispatch(fetchCountryById(record.id));
  };

  const openEditDrawer = (record) => {
    setIsEditing(true);
    setViewMode(false);
    setDrawerVisible(true);
    dispatch(fetchCountryById(record.id));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
            onClick={() => viewCountry(record)}
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
            title="Delete the Country"
            description="Are you sure to delete this country?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteCountry(record.id)}
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

  const filteredCountries = countries.filter(
    (country) =>
      country.name?.toLowerCase().includes(searchTerm)
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
            List of Countries
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
            Add Country
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
            placeholder="Search by name"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{ width: 250 }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={filteredCountries}
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
              ? "View Country"
              : isEditing
              ? "Edit Country"
              : "Add New Country"}
          </div>
        }
        width={450}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose
        headerStyle={{
          backgroundColor: colors.secondary,
          borderBottom: "1px solid #444",
        }}
      >
        {countryLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading country data...</p>
          </div>
        ) : viewMode && selectedCountryFromStore ? (
          <CountryViewDetails country={selectedCountryFromStore} />
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
              label="Country Name"
              rules={[
                { required: true, message: "Please enter the country name" },
                { min: 2, message: "Country name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter country name" disabled={viewMode} />
            </Form.Item>

            <Form.Item
              name="country_code"
              label="Country Code"
            >
              <Input placeholder="Enter country code" disabled={viewMode} />
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

export default Country;