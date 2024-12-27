import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, message } from 'antd';


const App = (props) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const key = 'updatable';

    const onCreate = async (values) => {
        setFormValues(values);
        setConfirmLoading(true);
        messageApi.open({
            key,
            type: 'loading',
            content: 'Validating Your Request...',
        });
        props.addFunction(values, props.route).then((response) => {
            console.log(response)
            setConfirmLoading(false);
            setOpen(false);
            props.setParentState(!props.parentState);
            messageApi.open({
                key,
                type: 'success',
                content: `${response.data.message}`,
                duration: 1,
                onClose: () => {
                    console.log(response);
                },
            });
        }).catch((error) => {
            console.log(error)
            setConfirmLoading(false);
            setOpen(false);
            messageApi.open({
                key,
                type: 'error',
                content: `SomeThing Went Wrong,${error?.response?.data?.data || 'Submit failed!'}`,
                duration: 1,
                onClose: () => {
                    console.log(error.response)
                },
            });
        });
        // setTimeout(() => {
        //     setOpen(false);
        //     setConfirmLoading(false);
        // }, 2000);
        console.log('Received values of form: ', values);
    };

    return (
        <>
            {contextHolder}
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
                {props.children}
            </Modal>
        </>
    );
};
export default App;