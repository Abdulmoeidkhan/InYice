import React, { useState } from "react";
import { Form, Input, Select, Button, Card, Row, Col, Switch, Space } from "antd";

const { Option } = Select;

const  DynamicForm = ({formFields,onSubmit}) => {
    
    const [showAddress, setShowAddress] = useState(false);

    // const onFinish = (values) => {
    //     console.log("Form Submitted:", values);
    // };

    return (
        <Card style={{ maxWidth: "100%", margin: "30px auto", padding: "20px" }}>
            <Form layout="vertical" onFinish={onSubmit}>
                {formFields?.map((field) => (
                
                    <Form.Item key={field.name} label={field.label} name={field.name} rules={field.rule ? [field.rule] : []}>
                        {field.type === "text" && <Input placeholder={field.placeholder} />}
                        {field.type === "number" && <Input type="number" placeholder={field.placeholder} />}
                        {field.type === "select" && (
                            <Select placeholder={field.placeholder}>
                                {field.options.map((option) => (
                                    <Option key={option} value={option.toLowerCase()}>{option}</Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                ))}

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

                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default DynamicForm;