import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Tabs,
  Switch,
  Select,
  Upload,
  Divider,
  InputNumber,
  Row,
  Col,
  message,
  Typography,
} from "antd";
import {
  SettingOutlined,
  MailOutlined,
  GlobalOutlined,
  UploadOutlined,
  SaveOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";
import colors from "../../theme/color";
import usePageTitle from "../../hooks/usePageTitle";


const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Settings = () => {
  usePageTitle('Settings');

  const [generalForm] = Form.useForm();
  const [smtpForm] = Form.useForm();
  const [smsForm] = Form.useForm();

  const onGeneralFinish = (values) => {
    console.log("General settings:", values);
    toast.success("General settings saved successfully!");
  };

  const onSmtpFinish = (values) => {
    console.log("SMTP Settings:", values);
    toast.success("SMTP Settings saved successfully!");
  };

  const onSmsFinish = (values) => {
    console.log("SMS Settings:", values);
    toast.success("SMS settings saved successfully!");
  };

  return (
    <Layout
      className="settings-layout"
      style={{  backgroundColor: colors.secondary }}
    >
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
            <SettingOutlined style={{ marginRight: "0.5rem" }} />
            Settings
          </h2>

          {/* <Button
            type="default"
            danger
            onClick={() => {
              generalForm.resetFields();
              smtpForm.resetFields();
              smsForm.resetFields();
              toast.success("Settings reset to default!");
            }}
          >
            Reset to Default
          </Button> */}
        </div>
      </div>
      <Card bordered={false} style={{backgroundColor:"#ffffff"}}>
        <Tabs defaultActiveKey="general" type="card" style={{backgroundColor:"#ffffff"}}>
          <TabPane
            tab={
              <span>
                <GlobalOutlined />
                General
              </span>
            }
            key="general"
          >
            <Form
              layout="vertical"
              form={generalForm}
              onFinish={onGeneralFinish}
              initialValues={{
                siteName: "My Admin Dashboard",
                siteUrl: "https://1Hero.com",
                language: "en",
                timezone: "UTC+0",
                dateFormat: "MM/DD/YYYY",
                maintenance: false,
              }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Site Name"
                    name="siteName"
                    rules={[
                      { required: true, message: "Please input site name!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Site URL"
                    name="siteUrl"
                    rules={[
                      { required: true, message: "Please input site URL!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="Default Language" name="language">
                    <Select>
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Time Zone" name="timezone">
                    <Select>
                      <Option value="UTC-12">UTC-12</Option>
                      <Option value="UTC-11">UTC-11</Option>
                      <Option value="UTC-10">UTC-10</Option>
                      <Option value="UTC-9">UTC-9</Option>
                      <Option value="UTC-8">UTC-8</Option>
                      <Option value="UTC-7">UTC-7</Option>
                      <Option value="UTC-6">UTC-6</Option>
                      <Option value="UTC-5">UTC-5</Option>
                      <Option value="UTC-4">UTC-4</Option>
                      <Option value="UTC-3">UTC-3</Option>
                      <Option value="UTC-2">UTC-2</Option>
                      <Option value="UTC-1">UTC-1</Option>
                      <Option value="UTC+0">UTC+0</Option>
                      <Option value="UTC+1">UTC+1</Option>
                      <Option value="UTC+2">UTC+2</Option>
                      <Option value="UTC+3">UTC+3</Option>
                      <Option value="UTC+4">UTC+4</Option>
                      <Option value="UTC+5">UTC+5</Option>
                      <Option value="UTC+5:30">UTC+5:30</Option>
                      <Option value="UTC+6">UTC+6</Option>
                      <Option value="UTC+7">UTC+7</Option>
                      <Option value="UTC+8">UTC+8</Option>
                      <Option value="UTC+9">UTC+9</Option>
                      <Option value="UTC+10">UTC+10</Option>
                      <Option value="UTC+11">UTC+11</Option>
                      <Option value="UTC+12">UTC+12</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Date Format" name="dateFormat">
                    <Select>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="YYYY.MM.DD">YYYY.MM.DD</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Logo" name="logo">
                    <Upload name="logo" action="/upload.do" listType="picture">
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="favicon" name="favicon">
                    <Upload
                      name="favicon"
                      action="/upload.do"
                      listType="picture"
                    >
                      <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Maintenance Mode"
                name="maintenance"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save General Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <MailOutlined />
                SMTP
              </span>
            }
            key="smtp" style={{backgroundColor:"#ffffff"}}
          >
            <Form
              layout="vertical"
              form={smtpForm}
              onFinish={onSmtpFinish}
              initialValues={{
                smtpEnabled: true,
                smtpHost: "smtp.example.com",
                smtpPort: 587,
                smtpEncryption: "tls",
                smtpAuth: true,
              }}
            >
              <Form.Item
                label="Enable SMTP"
                name="smtpEnabled"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="SMTP Host"
                    name="smtpHost"
                    rules={[
                      { required: true, message: "Please input SMTP host!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="SMTP Port"
                    name="smtpPort"
                    rules={[
                      { required: true, message: "Please input SMTP port!" },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Encryption" name="smtpEncryption">
                    <Select>
                      <Option value="none">None</Option>
                      <Option value="ssl">SSL</Option>
                      <Option value="tls">TLS</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Authentication"
                    name="smtpAuth"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Username"
                    name="smtpUsername"
                    rules={[
                      { required: true, message: "Please input username!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="smtpPassword"
                    rules={[
                      { required: true, message: "Please input password!" },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="From Email"
                    name="fromEmail"
                    rules={[
                      { required: true, message: "Please input from email!" },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="From Name"
                    name="fromName"
                    rules={[
                      { required: true, message: "Please input from name!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save SMTP Settings
                </Button>

                <Button
                  style={{ marginLeft: "10px" }}
                  onClick={() => message.info("Test email sent!")}
                >
                  Send Test Email
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <MobileOutlined />
                SMS
              </span>
            }
            key="sms" style={{backgroundColor:"#ffffff"}}
          >
            <Form
              layout="vertical"
              form={smsForm}
              onFinish={onSmsFinish}
              initialValues={{
                smsEnabled: false,
                provider: "twilio",
              }}
            >
              <Form.Item
                label="Enable SMS Notifications"
                name="smsEnabled"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Form.Item
                label="SMS Provider"
                name="provider"
                rules={[
                  { required: true, message: "Please select SMS provider!" },
                ]}
              >
                <Select>
                  <Option value="twilio">Twilio</Option>
                  <Option value="nexmo">Nexmo (Vonage)</Option>
                  <Option value="aws">AWS SNS</Option>
                  <Option value="messagebird">MessageBird</Option>
                </Select>
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="API Key / Account SID"
                    name="apiKey"
                    rules={[
                      { required: true, message: "Please input API key!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="API Secret / Auth Token"
                    name="apiSecret"
                    rules={[
                      { required: true, message: "Please input API secret!" },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="From Number / Sender ID"
                    name="fromNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please input sender number!",
                      },
                    ]}
                  >
                    <Input placeholder="+1234567890" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Default Country Code"
                    name="defaultCountryCode"
                  >
                    <Input placeholder="+1" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Message Template" name="messageTemplate">
                <Input.TextArea
                  rows={4}
                  placeholder="Your message template. Use {{variables}} for dynamic content."
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  Save SMS Settings
                </Button>
                <Button
                  style={{ marginLeft: "10px" }}
                  onClick={() => message.info("Test SMS sent!")}
                >
                  Send Test SMS
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </Layout>
  );
};

export default Settings;
