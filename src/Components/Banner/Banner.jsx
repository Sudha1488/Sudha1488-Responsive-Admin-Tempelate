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
  Upload,
  Image,
  Switch,
} from "antd";
const { Option } = Select;
const { TextArea } = Input;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import colors from "../../theme/color";
import usePageTitle from "../../hooks/usePageTitle";
import {
  fetchBanners,
  fetchBannerById,
  addBanner,
  updateBanner,
  deleteBanner,
  clearSelectedBanner,
  updateBannerStatus,
  clearError,
} from "../../store/slice/banner/bannerSlice";

const Banner = () => {
  usePageTitle("Banner");

  const dispatch = useDispatch();

  const banners = useSelector((state) => state.banners.banners);
  const selectedBannerFromStore = useSelector(
    (state) => state.banners.selectedBanner
  );
  const loading = useSelector((state) => state.banners.loading);
  const bannerLoading = useSelector((state) => state.banners.bannerLoading);
  const error = useSelector((state) => state.banners.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBannerId, setCurrentBannerId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBannerFromStore && (isEditing || viewMode)) {
      const fileList = selectedBannerFromStore.banner
        ? [
            {
              uid: selectedBannerFromStore.id || '-1',
              name: selectedBannerFromStore.name || 'banner.png',
              status: 'done',
              url: selectedBannerFromStore.banner,
            },
          ]
        : [];

      form.setFieldsValue({
        ...selectedBannerFromStore,
        status: selectedBannerFromStore.status ? 1 : 0,
        image: fileList,
      });
    } else if (!drawerVisible) {
      form.resetFields();
      dispatch(clearSelectedBanner());
      form.setFieldsValue({ status: 1 });
    }
  }, [selectedBannerFromStore, form, isEditing, viewMode, drawerVisible, dispatch]);


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showDrawer = (mode = "add", bannerId = null) => {
    form.resetFields();
    dispatch(clearSelectedBanner());
    setCurrentBannerId(bannerId);
    setIsEditing(mode === "edit");
    setViewMode(mode === "view");
    setDrawerVisible(true);
    if (mode === "add") {
      form.setFieldsValue({ status: 1 });
    } else if (bannerId) {
        dispatch(fetchBannerById(bannerId));
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setCurrentBannerId(null);
    form.resetFields();
    dispatch(clearSelectedBanner());
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("status", values.status === 1 ? true : false);

      if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
        formData.append("banner", values.image[0].originFileObj);
      } else if (isEditing && selectedBannerFromStore && selectedBannerFromStore.banner && !(values.image && values.image.length > 0)) {
      }


      if (isEditing && selectedBannerFromStore) {
        await dispatch(
          updateBanner({
            id: selectedBannerFromStore.id,
            bannerFormData: formData,
          })
        ).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await dispatch(addBanner(formData)).unwrap();
        toast.success("Banner added successfully");
      }
      closeDrawer();
      dispatch(fetchBanners());
    } catch (error) {
      toast.error(
        error.payload || error.message || "An unexpected error occurred during form submission."
      );
      console.error("Unhandled error during form submission:", error);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      const resultAction = await dispatch(deleteBanner(id));
      if (deleteBanner.fulfilled.match(resultAction)) {
        toast.success("Banner deleted successfully.");
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete banner");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatusBoolean = checked;
    const resultAction = await dispatch(
      updateBannerStatus({ id: record.id, status: newStatusBoolean })
    );
    if (updateBannerStatus.fulfilled.match(resultAction)) {
      toast.success(
        `Banner status updated to ${newStatusBoolean ? "Active" : "Inactive"}.`
      );
    } else {
      toast.error(resultAction.payload || "Failed to update Banner status.");
    }
  };

  const renderStatusTag = (status) => {
    const isActive = status;
    let color, text;

    if (isActive) {
      color = "green";
      text = "ACTIVE";
    } else {
      color = "red";
      text = "INACTIVE";
    }
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Image",
      dataIndex: "banner",
      key: "banner",
      render: (imageUrl) => (
        <Image
          src={imageUrl}
          alt="Banner"
          style={{ width: 60, height: 60, objectFit: "cover" }}
          preview={true}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status, record) => {
        const isCurrentlyActive = status;
        return (
          <Switch
            checked={isCurrentlyActive}
            onChange={(checked) => handleStatusChange(checked, record)}
            loading={loading}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            style={{
              backgroundColor: isCurrentlyActive ? colors.success : colors.error,
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
            title="Delete the Banner"
            description="Are you sure to delete this banner?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteBanner(record.id)}
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

  const filteredBanners = banners.filter(
    (banner) =>
      banner.name?.toLowerCase().includes(searchTerm) ||
      banner.description?.toLowerCase().includes(searchTerm)
  );

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

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
            List of Banner
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
            Add Banner
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
            dataSource={filteredBanners}
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
              ? "View Banner"
              : isEditing
              ? "Edit Banner"
              : "Add New Banner"}
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
        {bannerLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading banner data...</p>
          </div>
        ) : viewMode && selectedBannerFromStore ? (
          <div>
            <p>
              <strong>Name:</strong> {selectedBannerFromStore.name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {renderStatusTag(selectedBannerFromStore.status)}
            </p>
            {selectedBannerFromStore.banner && (
              <Image
                src={selectedBannerFromStore.banner}
                alt="Banner"
                style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                preview={true}
              />
            )}
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              status: 1,
            }}
          >
            <Form.Item
              name="name"
              label="Banner Name"
              rules={[
                { required: true, message: "Please enter the banner name" },
              ]}
            >
              <Input
                placeholder="Enter banner name"
                disabled={viewMode}
                onChange={(e) => {
                  if (!isEditing && !viewMode) {
                    const slug = generateSlug(e.target.value);
                    form.setFieldsValue({ slug });
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Banner Slug"
              rules={[
                { required: true, message: "Please enter the banner slug" },
              ]}
            >
              <Input
                placeholder="Enter banner slug"
                disabled={viewMode || isEditing}
              />
            </Form.Item>

            <Form.Item
              name="image"
              label="Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e && e.fileList}
              rules={[
                { required: !isEditing, message: "Please upload an image" },
              ]}
            >
              {viewMode ? (
                selectedBannerFromStore && selectedBannerFromStore.banner && (
                  <Image
                    src={selectedBannerFromStore.banner}
                    alt="Banner"
                    style={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                    }}
                    preview={true}
                  />
                )
              ) : (
                <Upload
                  accept="image/*"
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                  disabled={viewMode}
                >
                  <Button icon={<UploadOutlined />} disabled={viewMode}>
                    Upload Image
                  </Button>
                </Upload>
              )}
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select disabled={viewMode}>
                <Option value={1}>Active</Option>
                <Option value={0}>Inactive</Option>
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

export default Banner;