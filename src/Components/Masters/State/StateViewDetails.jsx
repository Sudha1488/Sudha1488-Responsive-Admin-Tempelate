import { Space, Typography } from 'antd';
import React from 'react'

const StateViewDetails = ({state}) => {
  if (!state) {
    return <Typography.Text>No state data available.</Typography.Text>;
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Paragraph>
        <strong>Name:</strong> {state.name}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Code:</strong> {state.code}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Country:</strong> {state.countryId?.name || 'N/A'}
      </Typography.Paragraph>
      <Typography.Paragraph>
        <strong>Status:</strong>{" "}
        {state.status === 1 || state.status === true ? "Active" : "Inactive"}
      </Typography.Paragraph>
    </Space>
  );
}

export default StateViewDetails
