import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Card, Row, Col, Switch, Space } from "antd";

const { Option } = Select;

const DynamicForm = ({ formFields, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues]);

    

    return (
        <Card variant="borderless" style={{ maxWidth: "100%", margin: "30px auto", padding: "20px" }}>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                {formFields?.map((field) => (
                    <Form.Item
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        rules={field.rule ? [field.rule] : []}
                    >
                        {field.type === "text" && <Input placeholder={field.placeholder}  />}
                        {field.type === "number" && <Input type="number" placeholder={field.placeholder} />}
                        {field.type === "email" && (
                            <Input
                                type="email"
                                placeholder={field.placeholder}
                                rules={[
                                    { required: true, message: "Please enter a valid email!" },
                                    { type: "email", message: "Please enter a valid email!" },
                                ]}
                            />
                        )}
                        {field.type === "select" && (
                            <Select placeholder={field.placeholder}>
                                {field.options.map((option) => (
                                    <Option key={option} value={option.toLowerCase()}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                ))}

                   

                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default DynamicForm;
