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
const { TextArea } = Input;

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import colors from "../../theme/color";
import usePageTitle from "../../hooks/usePageTitle";

const pagesData = [
  {
    id: 1,
    title: "Dashboard",
    slug: "dashboard",
    meta_title: "Dashboard - Admin Panel",
    meta_keywords: "dashboard, analytics, overview, admin",
    meta_description: "Main dashboard with key analytics and system overview for admin panel",
    status: 2,
  },
  {
    id: 2,
    title: "User",
    slug: "user",
    meta_title: "User Management - Admin Panel",
    meta_keywords: "user, profile, account, management",
    meta_description: "User management and account settings administration",
    status: 2,
  },
  {
    id: 3,
    title: "Permissions",
    slug: "permissions",
    meta_title: "Permissions Management - Admin Panel",
    meta_keywords: "permissions, access control, security, admin",
    meta_description: "Manage system permissions and access control settings",
    status: 2,
  },
  {
    id: 4,
    title: "Roles",
    slug: "roles",
    meta_title: "User Roles - Admin Panel",
    meta_keywords: "roles, user roles, access levels, permissions",
    meta_description: "Define and manage user roles and their permissions",
    status: 2,
  },
  {
    id: 5,
    title: "Banner",
    slug: "banner",
    meta_title: "Banner Management - Admin Panel",
    meta_keywords: "banner, promotion, display, marketing",
    meta_description: "Banner management for website display and promotions",
    status: 1,
  },
  {
    id: 6,
    title: "Blogs",
    slug: "blogs",
    meta_title: "Blog Management - Admin Panel",
    meta_keywords: "blogs, articles, posts, content",
    meta_description: "Manage blog articles and content posts",
    status: 2,
  },
  {
    id: 7,
    title: "Category",
    slug: "category",
    meta_title: "Category Management - Admin Panel",
    meta_keywords: "category, classification, grouping, organization",
    meta_description: "Manage content categories and classifications",
    status: 2,
  },
  {
    id: 8,
    title: "City",
    slug: "city",
    meta_title: "City Management - Admin Panel",
    meta_keywords: "city, location, urban, geography",
    meta_description: "City management for regional settings and location data",
    status: 1,
  },
  {
    id: 9,
    title: "Country",
    slug: "country",
    meta_title: "Country Management - Admin Panel",
    meta_keywords: "country, nation, global, international",
    meta_description: "Country management for international settings",
    status: 2,
  },
  {
    id: 10,
    title: "State",
    slug: "state",
    meta_title: "State Management - Admin Panel",
    meta_keywords: "state, province, region, geography",
    meta_description: "State/province management for regional settings",
    status: 1,
  },
  {
    id: 11,
    title: "Settings",
    slug: "settings",
    meta_title: "System Settings - Admin Panel",
    meta_keywords: "settings, configuration, preferences, system",
    meta_description: "System settings and configuration options",
    status: 2,
  },
  {
    id: 12,
    title: "Login",
    slug: "login",
    meta_title: "Login - Admin Panel",
    meta_keywords: "login, authentication, security, access",
    meta_description: "User login and authentication page for admin access",
    status: 2,
  }
];

const Pages = () => {
  usePageTitle("Pages")
  const [pages, setPages] = useState(pagesData);
  const [loading, setLoading] = useState(false);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedPage(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedPage(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      const formData = {
        ...values,
      };
      
      if (isEditing && selectedPage) {
        const updated = pages.map((page) =>
          page.id === selectedPage.id ? { ...page, ...formData } : page
        );
        setPages(updated);
        toast.success("Page updated successfully");
      } else {
        const newPage = {
          ...formData,
          id: Math.max(...pages.map((p) => p.id)) + 1,
        };
        const updated = [...pages, newPage];
        setPages(updated);
        toast.success("Page added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save page");
    }
  };

  const openEditDrawer = (page) => {
    setSelectedPage(page);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(page);
  };

  const viewPage = (page) => {
    setSelectedPage(page);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(page);
  };

  const deletePage = (id) => {
    try {
      const updated = pages.filter((p) => p.id !== id);
      setPages(updated);
      toast.success("Page deleted successfully");
    } catch (error) {
      toast.error("Failed to delete page");
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
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
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewPage(record)}
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
            title="Delete the Page"
            description="Are you sure to delete this page?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deletePage(record.id)}
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

  const generateSlug = (title) => {
    return title
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
            List of Pages
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
            Add Page
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
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}>
          <Input.Search
            placeholder="Search by title or slug"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{ width: 250 }}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table
            dataSource={pages.filter(
              (page) =>
                page.title.toLowerCase().includes(searchTerm) ||
                page.slug.toLowerCase().includes(searchTerm)
            )}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ x: 600 }}
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
            {viewMode ? "View Page" : isEditing ? "Edit Page" : "Add New Page"}
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
            name="title"
            label="Page Title"
            rules={[{ required: true, message: "Please enter the page title" }]}
          >
            <Input 
              placeholder="Enter page title" 
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
            label="Slug"
            rules={[{ required: true, message: "Please enter the slug" }]}
          >
            <Input placeholder="Enter page slug" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="meta_title"
            label="Meta Title"
            rules={[{ required: true, message: "Please enter meta title" }]}
          >
            <Input placeholder="Enter meta title" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="meta_keywords"
            label="Meta Keywords"
            rules={[{ required: true, message: "Please enter meta keywords" }]}
          >
            <Input placeholder="Enter meta keywords (comma separated)" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="meta_description"
            label="Meta Description"
            rules={[{ required: true, message: "Please enter meta description" }]}
          >
            <TextArea rows={4} placeholder="Enter meta description" disabled={viewMode} />
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

export default Pages;