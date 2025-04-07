import React, { useState } from "react";
import { Form, Input, Select, Button, Card, Row, Col, Switch, Space } from "antd";

const { Option } = Select;

const OrganizationForm = () => {
    const [showAddress, setShowAddress] = useState(false);
    const onFinish = (values) => {
        console.log("Form Submitted:", values);
    };

    return (
        <>
            <Card style={{ maxWidth: "100%", margin: "30px auto", padding: "20px" }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Organization Name" name="orgName" rules={[{ required: true, message: "Please enter organization name!" }]}>
                        <Input placeholder="Enter Organization Name" />
                    </Form.Item>

                    <Form.Item label="Industry" name="industry" rules={[{ required: true, message: "Please select industry!" }]}>
                        <Select placeholder="Select Industry">
                            <Option value="it">IT</Option>
                            <Option value="finance">Finance</Option>
                            <Option value="healthcare">Healthcare</Option>
                            <Option value="education">Education</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Business Type" name="businessType" rules={[{ required: true, message: "Please select business type!" }]}>
                        <Select placeholder="Select Business Type">
                            <Option value="private">Private</Option>
                            <Option value="public">Public</Option>
                            <Option value="ngo">NGO</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Organization Location" name="location" rules={[{ required: true, message: "Please select location!" }]}>
                        <Select placeholder="Select Location">
                            <Option value="usa">USA</Option>
                            <Option value="uk">UK</Option>
                            <Option value="india">India</Option>
                            <Option value="pakistan">Pakistan</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Organization Address" name="orgAddress" rules={[{ required: true, message: "Please enter organization address!" }]}>
                        <Input placeholder="Street 1" />
                    </Form.Item>

                    <Form.Item>
                        <Input placeholder="Street 2" />
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="City">
                                <Input placeholder="City" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="Zip/Postal code">
                                <Input type="number" placeholder="Zip/Postal code" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="Phone">
                                <Input placeholder="Phone" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="State/County">
                                <Select placeholder="State/County">
                                    <Option value="option1">Option 1</Option>
                                    <Option value="option2">Option 2</Option>
                                    <Option value="option3">Option 3</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="Fax Number">
                        <Input placeholder="Fax Number" />
                    </Form.Item>

                    <Form.Item label="Website URL" name="Website URL" rules={[{ required: true, message: "Please enter Website URL!" }]}>
                        <Input placeholder="Enter Website URL" />
                    </Form.Item>
                </Form>
            </Card>

            <Card style={{ maxWidth: "100%", margin: "30px auto", padding: "20px" }}>
                <Form layout="vertical">
                    <Form.Item>
                        <Space style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <span>Would you like to add a different address from payment stubs?</span>
                            <Switch onChange={(checked) => setShowAddress(checked)} />
                        </Space>
                    </Form.Item>

                    {showAddress && (
                        <Form.Item label="Payment Stub Address" name="paymentStubAddress">
                            <Input.TextArea rows={3} placeholder="You can enter a maximum of 255 characters" />
                        </Form.Item>
                    )}
                </Form>
            </Card>

            <Card style={{ maxWidth: "100%", margin: "30px auto", padding: "20px" }}>
                <Form layout="vertical">
                    <Form.Item label="Base Currency" name="baseCurrency" rules={[{ required: true, message: "Please select a currency!" }]}>
                        <Select placeholder="Select Currency">
                            <Option value="usd">USD - US Dollar</Option>
                            <Option value="eur">EUR - Euro</Option>
                            <Option value="gbp">GBP - British Pound</Option>
                            <Option value="jpy">JPY - Japanese Yen</Option>
                            <Option value="inr">INR - Indian Rupee</Option>
                            <Option value="pkr">PKR - Pakistani Rupee</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default OrganizationForm;
