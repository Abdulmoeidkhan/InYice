import React, { useState, useEffect } from 'react';
import { LockOutlined, UserOutlined, MailOutlined, CheckOutlined, HomeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, Card, message, Spin } from 'antd';
import { useAuth } from "../utils/hooks/useAuth";
import axios from 'axios';

const App = () => {
    const [activeTabKey, setActiveTabKey] = useState('signIn');
    const [isLoading, setIsLoading] = useState(false);
    const { logIn } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    const key = 'updatable';

    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

    const tabListNoTitle = [
        {
            key: 'signIn',
            label: 'Sign In',
        },
        {
            key: 'signUp',
            label: 'Sign Up',
        },
        {
            key: 'reset',
            label: 'Password Reset',
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
        await axios.post(`${domanWithPort}/${route}`, values)
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
        requestSubmitFunction('reset', values)
        // messageApi.success('Sign In Successfully!', 2, () => console.log('Received values of form: ', values));
    };

    const onFinishSignIn = (values) => {
        setIsLoading(true);
        requestSubmitFunction('login', values)
        // messageApi.success('Sign In Successfully!', 2, () => console.log('Received values of form: ', values));
    };

    const onFinishSignUp = (values) => {
        setIsLoading(true);
        requestSubmitFunction('register', values)
        // messageApi.success('Sign Up Successfully!', 2, () => console.log('Received values of form: ', values));
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

    const LogInForm = () => {
        const [form] = Form.useForm();

        return (
            <Form
                name="login"
                form={form}
                initialValues={{
                    remember: true,
                }}
                style={{
                    maxWidth: '100vw',
                }}
                onFinish={onFinishSignIn}
                onFinishFailed={onFinishFailed}
                disabled={isLoading}
            >
                <Form.Item disabled={isLoading}
                    name="email"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email in proper Format!',
                            type: 'email',
                            min: 3
                        },
                    ]}
                >
                    <Input allowClear showCount prefix={<MailOutlined />} placeholder="Email Address" />
                </Form.Item>
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
                >
                    <Input.Password allowClear prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item disabled={isLoading}>
                    <Flex justify="space-between" align="center">
                        <Form.Item disabled={isLoading} name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a href="">Forgot password</a>
                    </Flex>
                </Form.Item>

                <Form.Item disabled={isLoading}>
                    <SubmitButton form={form}>Sign In</SubmitButton>
                </Form.Item>
            </Form>
        )
    }

    const SignUpForm = () => {
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
                onFinish={onFinishSignUp}
                onFinishFailed={onFinishFailed}
                disabled={isLoading}
            >
                <Form.Item disabled={isLoading}
                    name="name"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Name!',
                            type: 'string',
                            min: 3
                        },
                    ]}
                >
                    <Input allowClear prefix={<UserOutlined />} placeholder="John Doe" />
                </Form.Item>
                <Form.Item disabled={isLoading}
                    name="company_name"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Company Name!',
                            type: 'string',
                            min: 3
                        },
                    ]}
                >
                    <Input allowClear prefix={<HomeOutlined />} placeholder="XYZ CO ORP" />
                </Form.Item>
                <Form.Item disabled={isLoading}
                    name="email"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                            type: 'email',
                            min: 5
                        },
                    ]}
                >
                    <Input allowClear prefix={<MailOutlined />} placeholder="Abc@xyz.com" />
                </Form.Item>
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
                    <SubmitButton form={form}>Sign Up</SubmitButton>
                </Form.Item>
            </Form>
        )
    }

    const ResetForm = () => {
        const [form] = Form.useForm();

        return (
            <Form
                name="reset"
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
                    name="email"
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email in proper Format!',
                            type: 'email',
                            min: 3
                        },
                    ]}
                >
                    <Input allowClear showCount prefix={<MailOutlined />} placeholder="Email Address" />
                </Form.Item>

                <Form.Item disabled={isLoading}>
                    <SubmitButton form={form}>Reset Password</SubmitButton>
                </Form.Item>
            </Form>
        )
    }

    const contentListNoTitle = {
        signIn: <LogInForm />,
        signUp: <SignUpForm />,
        reset: <ResetForm />,
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