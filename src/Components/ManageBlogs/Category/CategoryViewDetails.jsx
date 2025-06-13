import { Space, Typography } from 'antd';
import React from 'react';

const CategoryViewDetails = ({ category }) => {
  if (!category) {
    return <Typography.Text>No category data available.</Typography.Text>;
  }

  const getParentCategoryName = (parentId) => {
    return parentId ? `Parent ID: ${parentId}` : 'None';
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Paragraph>
        <strong>Name:</strong> {category.name}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Description:</strong> {category.description}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Parent Category:</strong> {getParentCategoryName(category.parentId)}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Image:</strong>{" "}
        {category.imagePath ? (
          <img src={category.imagePath} alt="Category" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
        ) : (
          "N/A"
        )}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Status:</strong>{" "}
        {category.status === 1 || category.status === true ? "Active" : "Inactive"}
      </Typography.Paragraph>
    </Space>
  );
};

export default CategoryViewDetails;