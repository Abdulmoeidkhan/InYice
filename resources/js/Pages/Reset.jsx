import React, { useState, useEffect } from 'react';
import { LockOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex, Card, message, Spin } from 'antd';
import { useAuth } from "../utils/hooks/useAuth";
import { useSearchParams  } from "react-router";
import axios from 'axios';

const App = () => {
    const [activeTabKey, setActiveTabKey] = useState('resetPass');
    const [isLoading, setIsLoading] = useState(false);
    const { logIn } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const key = 'updatable';
    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

    const tabListNoTitle = [
        {
            key: 'resetPass',
            label: 'Reset Password',
        }
    ];

    const onFinishFailed = ({ values, errorFields, outOfDate }) => {
        messageApi.error('Submit failed!', 2, () => console.log('Received values of form: ', values, errorFields, outOfDate));
    };

    const requestSubmitFunction = async (route, values) => {
        // const domanWithPort = window.location.protocol + '//' + window.location.hostname + (window.location.port ? `:${window.location.port}` : '');
        const domanWithPort = import.meta.env.VITE_API_URL;
        messageApi.open({
            key,
            type: 'loading',
            content: 'Validating Your Request...',
        });
        await axios.post(`${domanWithPort}/${route}`, { email, token, ...values })
            .then(function (response) {
                messageApi.open({
                    key,
                    type: 'success',
                    content: `${response.data.message}`,
                    duration: 1,
                    onClose: () => {
                        console.log(response);
                        setIsLoading(false);
                        logIn(response.data.data);
                    },
                });
            })
            .catch(function (error) {
                messageApi.open({
                    key,
                    type: 'error',
                    content: `SomeThing Went Wrong,${error.response.data.data.error}`,
                    duration: 1,
                    onClose: () => {
                        console.log(error);
                        setIsLoading(false);
                    },
                });
            });

    }


    const onFinishReset = (values) => {
        setIsLoading(true);
        requestSubmitFunction('resetPassword', values)
        // messageApi.success('Sign In Successfully!', 2, () => console.log('Received values of form: ', values));
    };

    const SubmitButton = ({ form, children }) => {
        const [submittable, setSubmittable] = useState(false);

        // Watch all values
        const values = Form.useWatch([], form);
        useEffect(() => {
            form
                .validateFields({
                    validateOnly: true,
                })
                .then(() => setSubmittable(true))
                .catch(() => setSubmittable(false));
        }, [form, values, isLoading]);
        return (
            <Button type="primary" htmlType="submit" disabled={!submittable}>
                {isLoading ? <Spin indicator={<LoadingOutlined spin />} size="small" /> : children}
            </Button>
        );
    };

    const ResetPassForm = () => {
        const [form] = Form.useForm();

        return (
            <Form
                name="signUp"
                form={form}
                initialValues={{
                    remember: true,
                }}
                style={{
                    maxWidth: '100vw',
                }}
                onFinish={onFinishReset}
                onFinishFailed={onFinishFailed}
                disabled={isLoading}
            >
                <Form.Item disabled={isLoading}
                    name="password"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password of atleast 8 Character!',
                            min: 8
                        },
                    ]}
                    help="Should be combination of numbers & alphabets (min 8 character)"
                >
                    <Input.Password allowClear showCount prefix={<LockOutlined />} type="password" placeholder="Password..." />
                </Form.Item>
                <Form.Item disabled={isLoading}
                    hasFeedback
                    name="c_password"
                    dependencies={['password']}
                    help="Should be same as Password "
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Confirm Password of atleast 8 Character!',
                            min: 8
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                    ]}

                >
                    <Input.Password allowClear showCount prefix={<CheckOutlined />} type="password" placeholder="Confirm Password..." />
                </Form.Item>
                <Form.Item disabled={isLoading} >
                    <SubmitButton form={form}>Reset Password</SubmitButton>
                </Form.Item>
            </Form>
        )
    }


    const contentListNoTitle = {
        resetPass: <ResetPassForm />,
    };


    return (
        <Flex align='center' justify='center'>
            {contextHolder}
            <Card hoverable style={{ minWidth: 300, width: '80vw', maxWidth: 500, }} tabProps={{ centered: true }} tabList={tabListNoTitle} activeTabKey={activeTabKey} onTabChange={onTabChange} >
                {contentListNoTitle[activeTabKey]}
            </Card>
        </Flex>
    );
};
export default App;