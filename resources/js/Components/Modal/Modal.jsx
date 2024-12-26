import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input } from 'antd';


const App = (props) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCreate = async (values) => {
        setFormValues(values);
        setConfirmLoading(true);
        props.addFunction(values).then(() => {
            setConfirmLoading(false);
            setOpen(false);
        }).catch(() => {
            setConfirmLoading(false);
            setOpen(false);
        });
        // setTimeout(() => {
        //     setOpen(false);
        //     setConfirmLoading(false);
        // }, 2000);
        console.log('Received values of form: ', values);
    };

    return (
        <>
            <Button size='large' onClick={() => setOpen(true)} color="primary" variant="solid" icon={<PlusOutlined />}>Add</Button>
            <Modal
                open={open}
                title={`Add ${props.title}`}
                okText="Add"
                cancelText="Cancel"
                okButtonProps={{
                    autoFocus: true,
                    htmlType: 'submit',
                }}
                onCancel={() => setOpen(false)}
                confirmLoading={confirmLoading}
                destroyOnClose
                modalRender={(dom) => (
                    <Form
                        layout="vertical"
                        form={form}
                        name="form_in_modal"
                        clearOnDestroy
                        onFinish={(values) => onCreate(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Form.Item
                    label={`${props.title} Name`}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Role name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Display Name"
                    name="display_name"
                    rules={[
                        {
                            required: false,
                            message: 'Please input Display name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input type="textarea" />
                </Form.Item>
            </Modal>
        </>
    );
};
export default App;