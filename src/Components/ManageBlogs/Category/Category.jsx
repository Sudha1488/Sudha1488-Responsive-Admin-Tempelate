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
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    parentId: null,
    imagePath: "/api/placeholder/100/100",
    status: "active",
  },
  {
    id: 2,
    name: "Smartphones",
    description: "Mobile phones and accessories",
    parentId: 1,
    imagePath: "/api/placeholder/100/100",
    status: "active",
  },
  {
    id: 3,
    name: "Laptops",
    description: "Portable computers",
    parentId: 1,
    imagePath: "/api/placeholder/100/100",
    status: "active",
  },
  {
    id: 4,
    name: "Clothing",
    description: "Apparel and fashion items",
    parentId: null,
    imagePath: "/api/placeholder/100/100",
    status: "inactive",
  },
  {
    id: 5,
    name: "Men's Wear",
    description: "Clothing for men",
    parentId: 4,
    imagePath: "/api/placeholder/100/100",
    status: "active",
  },
];

const Category = () => {
  const [categories, setCategories] = useState(staticCategories);
  const [loading, setLoading] = useState(false);
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [form] = Form.useForm();

  const showDrawer = () => {
    form.resetFields();
    setIsEditing(false);
    setSelectedCategory(null);
    setViewMode(false);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setSelectedCategory(null);
    setViewMode(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    try {
      const formData = {
        ...values,
        imagePath: "/api/placeholder/100/100",
      };
      
      if (isEditing && selectedCategory) {
        const updated = categories.map((category) =>
          category.id === selectedCategory.id ? { ...category, ...formData } : category
        );
        setCategories(updated);
        toast.success("Category updated successfully");
      } else {
        const newCategory = {
          ...formData,
          id: Math.max(...categories.map((c) => c.id)) + 1,
        };
        const updated = [...categories, newCategory];
        setCategories(updated);
        toast.success("Category added successfully");
      }
      closeDrawer();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const openEditDrawer = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setDrawerVisible(true);
    form.setFieldsValue(category);
  };

  const viewCategory = (category) => {
    setSelectedCategory(category);
    setViewMode(true);
    setDrawerVisible(true);
    form.setFieldsValue(category);
  };

  const deleteCategory = (id) => {
    try {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const getParentCategoryName = (parentId) => {
    if (!parentId) return "None";
    const parent = categories.find((c) => c.id === parentId);
    return parent ? parent.name : "Unknown";
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
      title: "Parent Category",
      dataIndex: "parentId",
      key: "parentId",
      render: (parentId) => getParentCategoryName(parentId),
    },
    {
      title: "Image",
      dataIndex: "imagePath",
      key: "imagePath",
      render: (imagePath) => (
        <Image
          src={imagePath}
          alt="Category"
          style={{ width: 50, height: 50, objectFit: "cover" }}
          preview={false}
        />
      ),
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
            onClick={() => viewCategory(record)}
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
            title="Delete the Category"
            description="Are you sure to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteCategory(record.id)}
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

  const getParentCategoryOptions = () => {
    if (!isEditing) return categories;
    return categories.filter((cat) => cat.id !== selectedCategory?.id);
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
            List of Categories
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
              Add Category
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
          dataSource={categories.filter(
            (category) =>
              category.name.toLowerCase().includes(searchTerm) ||
              category.description.toLowerCase().includes(searchTerm)
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
            {viewMode ? "View Category" : isEditing ? "Edit Category" : "Add New Category"}
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
            parentId: null,
          }}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please enter the category name" }]}
          >
            <Input placeholder="Enter category name" disabled={viewMode} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter description"
              disabled={viewMode}
            />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="Parent Category"
          >
            <Select 
              placeholder="Select parent category" 
              disabled={viewMode}
              allowClear
            >
              <Option value={null}>None</Option>
              {getParentCategoryOptions().map(category => (
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
              selectedCategory && (
                <Image
                  src={selectedCategory.imagePath}
                  alt="Category"
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

export default Category;