
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
import colors from "../../../theme/color";

const staticCategories = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Health & Wellness" },
  { id: 3, name: "Business" },
  { id: 4, name: "Lifestyle" },
  { id: 5, name: "Travel" },
];


const staticBlogs = [
  {
    id: 1,
    name: "The Future of AI",
    description: "Exploring the latest trends in artificial intelligence and machine learning.",
    slug: "future-of-ai",
    categoryId: 1,
    imagePath: "/api/placeholder/100/100",
    status: 2, 
  },
  {
    id: 2,
    name: "Healthy Eating Habits",
    description: "Tips for maintaining a balanced diet and healthy eating patterns.",
    slug: "healthy-eating-habits",
    categoryId: 2,
    imagePath: "/api/placeholder/100/100",
    status: 2, 
  },
  {
    id: 3,
    name: "Investment Strategies for 2025",
    description: "Expert advice on how to invest your money wisely in the current market.",
    slug: "investment-strategies-2025",
    categoryId: 3,
    imagePath: "/api/placeholder/100/100",
    status: 1,
  },
  {
    id: 4,
    name: "Minimalist Living",
    description: "How to embrace minimalism and simplify your lifestyle.",
    slug: "minimalist-living",
    categoryId: 4,
    imagePath: "/api/placeholder/100/100",
    status: 0,
  },
  {
    id: 5,
    name: "Hidden Gems in Southeast Asia",
    description: "Discover off-the-beaten-path destinations in Southeast Asia.",
    slug: "hidden-gems-southeast-asia",
    categoryId: 5,
    imagePath: "/api/placeholder/100/100",
    status: 2,
  },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState(staticBlogs);
  const [loading, setLoading] = useState(false);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedBlog(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedBlog(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      const formData = {
        ...values,
        imagePath: "/api/placeholder/100/100",
      };
      
      if (isEditing && selectedBlog) {
        const updated = blogs.map((blog) =>
          blog.id === selectedBlog.id ? { ...blog, ...formData } : blog
        );
        setBlogs(updated);
        toast.success("Blog updated successfully");
      } else {
        const newBlog = {
          ...formData,
          id: Math.max(...blogs.map((b) => b.id)) + 1,
        };
        const updated = [...blogs, newBlog];
        setBlogs(updated);
        toast.success("Blog added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save blog");
    }
  };

  const openEditDrawer = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(blog);
  };

  const viewBlog = (blog) => {
    setSelectedBlog(blog);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(blog);
  };

  const deleteBlog = (id) => {
    try {
      const updated = blogs.filter((b) => b.id !== id);
      setBlogs(updated);
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "None";
    const category = staticCategories.find((c) => c.id === categoryId);
    return category ? category.name : "Unknown";
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
      title: "Image",
      dataIndex: "imagePath",
      key: "imagePath",
      render: (imagePath) => (
        <Image
          src={imagePath}
          alt="Blog"
          style={{ width: 60, height: 60, objectFit: "cover" }}
          preview={false}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => getCategoryName(categoryId),
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
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewBlog(record)}
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
            title="Delete the Blog"
            description="Are you sure to delete this blog?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteBlog(record.id)}
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

  // Generate slug from name
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
            List of Blogs
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
              Add Blog
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
        <Table
          dataSource={blogs.filter(
            (blog) =>
              blog.name.toLowerCase().includes(searchTerm) ||
              blog.description.toLowerCase().includes(searchTerm)
          )}
          columns={columns}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
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
            {viewMode ? "View Blog" : isEditing ? "Edit Blog" : "Add New Blog"}
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
            label="Blog Name"
            rules={[{ required: true, message: "Please enter the blog name" }]}
          >
            <Input 
              placeholder="Enter blog name" 
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
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter description"
              disabled={viewMode}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter slug" }]}
          >
            <Input 
              placeholder="Enter blog slug" 
              disabled={viewMode}
              addonBefore="/"
            />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select 
              placeholder="Select category" 
              disabled={viewMode}
            >
              {staticCategories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
          >
            {viewMode ? (
              selectedBlog && (
                <Image
                  src={selectedBlog.imagePath}
                  alt="Blog"
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

export default Blogs;