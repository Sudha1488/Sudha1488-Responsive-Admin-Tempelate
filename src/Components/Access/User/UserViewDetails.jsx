import React from 'react';
import { Card, Tag, Typography, Image, Row, Col } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import colors from '../../../theme/color';

const { Title, Text } = Typography;

const UserViewDetails = ({ user }) => {
    console.log(user)
    
  if (!user) {
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
        <UserOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '20px' }} />
        <Title level={4} type="secondary" style={{ marginBottom: '8px' }}>
          No user data to display
        </Title>
        <Text type="secondary">Please select a user or ensure data is loaded.</Text>
      </div>
    );
  }

  const getRoleName = (role_id) => {
    const roles = {
      1: 'Admin',
      2: 'User',
      3: 'Manager',
    };
    return roles[role_id] || 'Unknown Role';
  };

  const isActive = user.status === 1 || user.status === true;

  const InfoRow = ({ icon, label, value, copyable = false }) => (
    <Row style={{ marginBottom: '16px', alignItems: 'flex-start' }}>
      <Col xs={24} sm={8} md={6}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {icon && <span style={{ marginRight: '10px', color: colors.primary }}>{icon}</span>}
          <Text strong style={{ color: '#595959' }}>{label}:</Text>
        </div>
      </Col>
      <Col xs={24} sm={16} md={18}>
        <Text
          copyable={copyable ? { tooltips: ['copy', 'copied!'] } : false}
          style={{ fontSize: '15px', color: '#262626', whiteSpace: 'normal', wordBreak: 'break-word' }}
        >
          {value || 'Not provided'}
        </Text>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          maxWidth: '800px',
          margin: '0 auto',
          background: '#fff',
          overflow: 'hidden',
        }}
        bodyStyle={{ padding: '30px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {user.profileImg ? (
            <Image
              width={100}
              height={100}
              src={user.profileImg}
              alt="Profile"
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '25px',
                border: '3px solid #f0f0f0',
              }}
              preview={false}
            />
          ) : (
            <div
              style={{
                minWidth: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                border: '2px dashed #d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '25px',
              }}
            >
              <UserOutlined style={{ fontSize: '40px', color: '#8c8c8c' }} />
            </div>
          )}

          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: '0 0 8px 0', color: '#262626' }}>
              {user.name || 'User Name Not Provided'}
            </Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Tag color="blue" style={{ padding: '4px 10px', fontSize: '13px' }}>
                {getRoleName(user.role_id)}
              </Tag>
              <Tag color={isActive ? 'green' : 'red'} style={{ padding: '4px 10px', fontSize: '13px' }}>
                {isActive ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 10px' }}>
          <InfoRow
            icon={<IdcardOutlined />}
            label="User ID"
            value={user.id}
            copyable={true}
          />

          <InfoRow
            icon={<MailOutlined />}
            label="Email"
            value={user.email}
            copyable={true}
          />

          <InfoRow
            icon={<PhoneOutlined />}
            label="Phone"
            value={user.phone}
            copyable={true}
          />

          {user.dateOfBirth && user.dateOfBirth !== "" && (
            <InfoRow
              icon={<CalendarOutlined />}
              label="Date of Birth"
              value={moment(user.dateOfBirth).format('MMM DD, YYYY')}
            />
          )}

          {user.address && (
            <InfoRow
              icon={<EnvironmentOutlined />}
              label="Address"
              value={user.address}
            />
          )}

          {user.createdAt && (
            <InfoRow
              icon={<CalendarOutlined />}
              label="Member Since"
              value={moment(user.createdAt).format('MMM DD, YYYY')}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserViewDetails;