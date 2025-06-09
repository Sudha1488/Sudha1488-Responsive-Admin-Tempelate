import React from 'react'
import { Space, Typography } from 'antd';

const CountryViewDetails = ({ country }) => {
  if (!country) {
    return <Typography.Text>No country data available.</Typography.Text>;
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Paragraph>
        <strong>Name:</strong> {country.name}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Code:</strong> {country.code}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Status:</strong>{" "}
        {country.status === 1 || country.status === true ? "Active" : "Inactive"}
      </Typography.Paragraph>
    </Space>
  );
};

export default CountryViewDetails
