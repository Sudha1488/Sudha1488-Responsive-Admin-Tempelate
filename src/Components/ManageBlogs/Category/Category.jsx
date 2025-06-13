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
import colors from "../../../theme/color";
import usePageTitle from "../../../hooks/usePageTitle";
import {
  fetchCategories,
  fetchCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
  clearSelectedCategory,
  updateCategoryStatus,
  clearError,
} from "../../../store/slice/category/categorySlice";
import CategoryViewDetails from "./CategoryViewDetails";

const Category = () => {
  usePageTitle("Category");

  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categories);
  const selectedCategoryFromStore = useSelector(
    (state) => state.categories.selectedCategory
  );
  const loading = useSelector((state) => state.categories.loading);
  const categoryLoading = useSelector(
    (state) => state.categories.categoryLoading
  );
  const error = useSelector((state) => state.categories.error);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (drawerVisible && currentCategoryId && (isEditing || viewMode)) {
      dispatch(fetchCategoryById(currentCategoryId));
    } else if (!drawerVisible) {
      dispatch(clearSelectedCategory());
      form.resetFields();
    }
  }, [drawerVisible, currentCategoryId, isEditing, viewMode, dispatch, form]);


  useEffect(() => {
    if (selectedCategoryFromStore) {
      const fileList = selectedCategoryFromStore.imagePath
        ? [
            {
              uid: selectedCategoryFromStore.id || "-1",
              name: selectedCategoryFromStore.name || "image.png",
              status: "done",
              url: selectedCategoryFromStore.imagePath,
            },
          ]
        : [];

      form.setFieldsValue({
        ...selectedCategoryFromStore,
        status: selectedCategoryFromStore.status ? "active" : "inactive",
        image: fileList,
      });
    } else if (!isEditing && !viewMode) {
      form.resetFields();
      form.setFieldsValue({ status: "active", parentId: null });
    }
  }, [selectedCategoryFromStore, form, isEditing, viewMode]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showDrawer = (mode = "add", categoryId = null) => {
    form.resetFields();
    dispatch(clearSelectedCategory());
    setCurrentCategoryId(categoryId);
    setIsEditing(mode === "edit");
    setViewMode(mode === "view");
    setDrawerVisible(true);
    if (mode === "add") {
      form.setFieldsValue({ status: "active", parentId: null });
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setIsEditing(false);
    setViewMode(false);
    setCurrentCategoryId(null);
    form.resetFields();
    dispatch(clearSelectedCategory());
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.parentId) {
        formData.append("parent_id", values.parentId);
      } else {
        formData.append("parent_id", 0);
      }
      formData.append("status", values.status === "active" ? 1 : 0);

      if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
        formData.append("cat_img", values.image[0].originFileObj);
      } else if (isEditing && selectedCategoryFromStore?.imagePath && !(values.image && values.image.length > 0)) {
      }


      if (isEditing && selectedCategoryFromStore) {
        await dispatch(
          updateCategory({
            id: selectedCategoryFromStore.id,
            categoryFormData: formData,
          })
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(addCategory(formData)).unwrap();
        toast.success("Category added successfully");
      }
      closeDrawer();
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(
        error.payload || error.message || "An unexpected error occurred during form submission."
      );
      console.error("Unhandled error during form submission:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const resultAction = await dispatch(deleteCategory(id));
      if (deleteCategory.fulfilled.match(resultAction)) {
        toast.success("Category deleted successfully.");
        dispatch(fetchCategories());
      } else {
        toast.error(resultAction.payload?.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("An unexpected error occurred during deletion.");
    }
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? 1 : 0;
    const resultAction = await dispatch(
      updateCategoryStatus({ id: record.id, status: newStatus })
    );
    if (updateCategoryStatus.fulfilled.match(resultAction)) {
      toast.success(
        `Category status updated to ${newStatus === 1 ? "Active" : "Inactive"}.`
      );
      dispatch(fetchCategories());
    } else {
      toast.error(resultAction.payload || "Failed to update Category status.");
    }
  };

  const getParentCategoryName = (parentId) => {
    const parent = categories.find((cat) => cat.id === parentId);
    return parent ? parent.name : "None";
  };

  const getParentCategoryOptions = () => {
    const currentCategoryId = form.getFieldValue('id');
    return categories.filter(cat => cat.id !== currentCategoryId && cat.parentId !== currentCategoryId);
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
      width: 120,
      render: (status, record) => {
        const isCurrentlyActive = status === 1 || status === true;
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
            title="Delete the Category"
            description="Are you sure to delete this category?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteCategory(record.id)}
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

  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchTerm) ||
      category.description?.toLowerCase().includes(searchTerm)
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
            List of Categories
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
            Add Category
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
            dataSource={filteredCategories}
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
            {viewMode
              ? "View Category"
              : isEditing
              ? "Edit Category"
              : "Add New Category"}
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
        {categoryLoading && (isEditing || viewMode) ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Loading category data...</p>
          </div>
        ) : viewMode && selectedCategoryFromStore ? (
          <CategoryViewDetails category={selectedCategoryFromStore} />
        ) : (
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
              rules={[
                { required: true, message: "Please enter the category name" },
              ]}
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

            <Form.Item name="parentId" label="Parent Category">
              <Select
                placeholder="Select parent category"
                disabled={viewMode}
                allowClear
              >
                <Option value={null}>None</Option>
                {getParentCategoryOptions().map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="image" label="Image" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
              {viewMode ? (
                selectedCategoryFromStore && selectedCategoryFromStore.imagePath && (
                  <Image
                    src={selectedCategoryFromStore.imagePath}
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
                      loading={loading}
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

export default Category;