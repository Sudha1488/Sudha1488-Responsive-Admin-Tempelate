import React from 'react';
import { Card, Tag, Typography, Row, Col, Divider } from 'antd';
import {
  IdcardOutlined,
  FileTextOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import colors from '../../../theme/color';

const { Title, Text } = Typography;

const RoleViewDetails = ({ role }) => {
  if (!role) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '12px',
          margin: '20px auto',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <InfoCircleOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '20px' }} />
        <Title level={4} type="secondary" style={{ marginBottom: '8px' }}>
          No role data to display
        </Title>
        <Text type="secondary">Please select a role or ensure data is loaded.</Text>
      </div>
    );
  }

  const isActive = role.status === 1 || role.status === true;

  const InfoRow = ({ icon, label, children, renderValue }) => (
    <Row style={{ marginBottom: '16px', alignItems: 'flex-start' }}>
      <Col xs={24} sm={8} md={6}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {icon && <span style={{ marginRight: '10px', color: colors.primary }}>{icon}</span>}
          <Text strong style={{ color: '#595959', fontSize: '15px' }}>{label}:</Text>
        </div>
      </Col>
      <Col xs={24} sm={16} md={18}>
        {children || renderValue || (
          <Text style={{ fontSize: '15px', color: '#262626' }}>Not provided</Text>
        )}
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          maxWidth: '850px',
          margin: '0 auto',
          background: '#ffffff',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '25px',
            borderBottom: '1px solid #e8e8e8',
          }}
        >
          <div
            style={{
              minWidth: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#f0f2f5',
              border: '2px solid #d9d9d9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '25px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <IdcardOutlined style={{ fontSize: '36px', color: colors.primary }} />
          </div>

          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: '0 0 6px 0', color: '#262626', fontSize: '28px' }}>
              {role.name || 'Role Name Not Provided'}
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Tag color="blue" style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '4px' }}>
                ROLE
              </Tag>
              <Tag color={isActive ? 'green' : 'red'} style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '4px' }}>
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
              {role.createdAt && (
                <Tag color="default" style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '4px' }}>
                  Created: {new Date(role.createdAt).toLocaleDateString()}
                </Tag>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 10px' }}>
          <Title level={4} style={{ marginBottom: '25px', color: colors.primary }}>
            Role Details
          </Title>

          <InfoRow
            icon={<IdcardOutlined />}
            label="Role ID"
            renderValue={
              <Text copyable={{ tooltips: ['copy', 'copied!'] }} style={{ fontSize: '15px', color: '#262626' }}>
                {role.id || 'Not provided'}
              </Text>
            }
          />

          <InfoRow
            icon={<FileTextOutlined />}
            label="Description"
            renderValue={
              <Text style={{ fontSize: '15px', color: '#262626', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                {role.description || 'Not provided'}
              </Text>
            }
          />

          <InfoRow
            icon={<KeyOutlined />}
            label="Permissions"
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {role.permissions && Array.isArray(role.permissions) && role.permissions.length > 0
                ? role.permissions.map((permissionName, index) => (
                    <Tag key={index} color="geekblue" style={{ fontSize: '13px', padding: '4px 8px', borderRadius: '4px' }}>
                      {permissionName.replace(/_/g, ' ').toUpperCase()}
                    </Tag>
                  ))
                : <Text style={{ fontSize: '15px', color: '#262626' }}>None</Text>}
            </div>
          </InfoRow>

          <InfoRow
            icon={isActive ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
            label="Status"
            renderValue={
              <Text style={{ fontSize: '15px', color: isActive ? 'green' : 'red' }}>
                {isActive ? "Active" : "Inactive"}
              </Text>
            }
          />
          {role.updatedAt && (
             <InfoRow
               icon={<FileTextOutlined />}
               label="Last Updated"
               renderValue={
                 <Text style={{ fontSize: '15px', color: '#262626' }}>
                   {new Date(role.updatedAt).toLocaleDateString()}
                 </Text>
               }
             />
           )}
        </div>
      </Card>
    </div>
  );
};

export default RoleViewDetails;