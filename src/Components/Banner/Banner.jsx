
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
} from "antd";
const { Option } = Select;
const { TextArea } = Input;

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import colors from "../../theme/color"



const bannersData = [
  {
    id: 1,
    name: "Mastering React",
    imagePath: "https://via.placeholder.com/60?text=React",
    status: 2,
  },
  {
    id: 2,
    name: "JavaScript Fundamentals",
    imagePath: "https://via.placeholder.com/60?text=JS",
    status: 1, 
  },
  {
    id: 3,
    name: "Intro to Web Development",
    imagePath: "https://via.placeholder.com/60?text=HTML",
    status: 0, 
  },
  {
    id: 4,
    name: "Understanding TypeScript",
    imagePath: "https://via.placeholder.com/60?text=TS",
    status: 2, 
  },
  {
    id: 5,
    name: "Deploying with Vercel",
    imagePath: "https://via.placeholder.com/60?text=Vercel",
    status: 1, 
  },
];

const Banner = () => {
  const [banners, setBanners] = useState(bannersData);
  const [loading, setLoading] = useState(false);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedBanner(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedBanner(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      const formData = {
        ...values,
        imagePath: "/api/placeholder/100/100",
      };
      
      if (isEditing && selectedBanner) {
        const updated = banners.map((banner) =>
          banner.id === selectedBanner.id ? { ...banner, ...formData } : banner
        );
        setBanners(updated);
        toast.success("Banner updated successfully");
      } else {
        const newBanner = {
          ...formData,
          id: Math.max(...banners.map((b) => b.id)) + 1,
        };
        const updated = [...banners, newBanner];
        setBanners(updated);
        toast.success("Banner added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save banner");
    }
  };

  const openEditDrawer = (banner) => {
    setSelectedBanner(banner);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(banner);
  };

  const viewBanner = (banner) => {
    setSelectedBanner(banner);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(banner);
  };

  const deleteBanner = (id) => {
    try {
      const updated = banners.filter((b) => b.id !== id);
      setBanners(updated);
      toast.success("Banner deleted successfully");
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const renderStatusTag = (status) => {
    let color, text;
    
    switch (status) {
      case 0:
        color = "red";
        text = "INACTIVE";
        break;
      case 1:
        color = "orange";
        text = "DRAFT";
        break;
      case 2:
        color = "green";
        text = "PUBLISHED";
        break;
      default:
        color = "gray";
        text = "UNKNOWN";
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "imagePath",
      key: "imagePath",
      render: (imagePath) => (
        <Image
          src={imagePath}
          alt="Banner"
          style={{ width: 60, height: 60, objectFit: "cover" }}
          preview={false}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Actions",
      key: "actions",
      width:150,
      fixed:"right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewBanner(record)}
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
            title="Delete the Banner"
            description="Are you sure to delete this banner?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteBanner(record.id)}
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


  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Input.Search
              placeholder="Search by name or description"
              allowClear
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              style={{ width: 250 }}
            />

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
              Add Banner
            </Button>
          </div>
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
        <div style={{ overflowX: "auto" }}>

        <Table
          dataSource={banners.filter(
            (banner) =>
              banner.name.toLowerCase().includes(searchTerm) ||
              banner.description.toLowerCase().includes(searchTerm)
          )}
          columns={columns}
          loading={loading}
          rowKey="id"
          scroll={{x:900}}
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
            {viewMode ? "View Banner" : isEditing ? "Edit Banner" : "Add New Banner"}
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
            status: 1, 
          }}
        >
          <Form.Item
            name="name"
            label="Banner Name"
            rules={[{ required: true, message: "Please enter the banner name" }]}
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
            name="image"
            label="Image"
            valuePropName="fileList"
          >
            {viewMode ? (
              selectedBanner && (
                <Image
                  src={selectedBanner.imagePath}
                  alt="Banner"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
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
              <Option value={0}>Inactive</Option>
              <Option value={1}>Draft</Option>
              <Option value={2}>Published</Option>
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

export default Banner;