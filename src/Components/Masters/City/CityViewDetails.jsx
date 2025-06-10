import { Space, Typography } from 'antd';
import React from 'react';

const CityViewDetails = ({ city }) => {
  if (!city) {
    return <Typography.Text>No city data available.</Typography.Text>;
  }
  const displayCode = city.code ? city.code : `${city.name}_code`;


  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Paragraph>
        <strong>Name:</strong> {city.name}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Code:</strong> {displayCode}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>State:</strong> {city.stateId?.name || 'N/A'}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Status:</strong>{" "}
        {city.status === 1 || city.status === true ? "Active" : "Inactive"}
      </Typography.Paragraph>
    </Space>
  );
};

export default CityViewDetails;