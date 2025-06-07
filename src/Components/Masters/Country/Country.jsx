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
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Country = () => {
  usePageTitle("Country");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { action, id } = useParams();

  const countries = useSelector((state)=> state.countries.countries);
  const selectedCountryFromStore = useSelector((state)=>state.countries.selectedCountry);
  const loading = useSelector((state) => state.countries.loading);
    const countryLoading = useSelector(
      (state) => state.countries.countryLoading
    );
    const error = useSelector((state) => state.countries.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form] = Form.useForm();

    useEffect(() => {
      dispatch(fetchCountries());
    }, [dispatch]);
  
    useEffect(() => {
      if (action === "add") {
        showDrawer();
      } else if ((action === "edit" || action === "view") && id) {
        dispatch(fetchCountryById(id));
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
      if (selectedCountryFromStore) {
        form.setFieldsValue({
          ...selectedCountryFromStore,
          status:
            selectedCountryFromStore.status === 1 ||
            selectedCountryFromStore.status === true
              ? "active"
              : "inactive",
          role_id: Number(selectedCountryFromStore.role_id),
        });
      } else if ((action === "edit" || action === "view") && !permissionLoading) {
      }
    }, [selectedPermissionFromStore, form, action, permissionLoading]);
  
    useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedCountry(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedCountry(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      if (isEditing && selectedCountry) {
        const updated = countries.map((country) =>
          country.id === selectedCountry.id
            ? { ...country, ...values }
            : country
        );
        setCountries(updated);
        toast.success("Country updated successfully");
      } else {
        const newCountry = {
          ...values,
          id: Math.max(...countries.map((c) => c.id)) + 1,
        };
        const updated = [...countries, newCountry];
        setCountries(updated);
        toast.success("Country added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save country");
    }
  };

  const openEditDrawer = (country) => {
    setSelectedCountry(country);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(country);
  };

  const viewCountry = (country) => {
    setSelectedCountry(country);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(country);
  };

  const deleteCountry = (id) => {
    try {
      const updated = countries.filter((c) => c.id !== id);
      setCountries(updated);
      toast.success("Country deleted successfully");
    } catch (error) {
      toast.error("Failed to delete country");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
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
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
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
            onConfirm={() => deleteCountry(record.id)}
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
            placeholder="Search by name or code"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{ width: 250 }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={countries.filter(
              (country) =>
                country.name.toLowerCase().includes(searchTerm) ||
                country.code.toLowerCase().includes(searchTerm)
            )}
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
            label="Country Name"
            rules={[
              { required: true, message: "Please enter the country name" },
              { min: 2, message: "Country name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Enter country name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="code"
            label="Country Code"
            rules={[
              { required: true, message: "Please enter country code" },
              {
                min: 2,
                max: 2,
                message: "Country code must be exactly 2 characters",
              },
              {
                pattern: /^[A-Z]+$/,
                message: "Country code must be uppercase letters only",
              },
            ]}
          >
            <Input
              placeholder="Enter country code (e.g., US, UK)"
              disabled={viewMode}
              maxLength={2}
              style={{ textTransform: "uppercase" }}
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

export default Country;
