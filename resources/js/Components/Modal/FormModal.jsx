import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, message } from 'antd';


const App = (props) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const key = 'updatable';

    const onSubmit = async (values) => {
        setConfirmLoading(true);
        messageApi.open({
            key,
            type: 'loading',
            content: 'Validating Your Request...',
        });
        props.workingFunction(values, props.route, props.initialValues.id).then((response) => {
            console.log(response)
            setConfirmLoading(false);
            setOpen(false);
            props.setParentState ? props.setParentState(!props.parentState) : null;
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
        // console.log('Received values of form: ', values);
    };

    useEffect(() => {
        // console.log(form)
        // console.log(props.initialValues)
        // console.log(props.frm)
        if (props.frm?.length > 0) {

            console.log(props.frm?.map((fieldName) => { console.log(fieldName?.name) }))
        }
    }, []);


    return (
        <>
            {contextHolder}
            <Button size='large' onClick={() => setOpen(true)} color={props.buttonDetails.danger ? 'danger' : "primary"} variant={props.buttonDetails.variant} icon={props.buttonDetails.icon} danger={props.buttonDetails.danger}>{props.buttonDetails.title}</Button>
            <Modal
                open={open}
                title={`${props.okText ? props.okText : "Add"} ${props.title}`}
                okText={props.okText ? props.okText : "Add"}
                okType={props.okType ? props.okType : 'primary'}
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
                        onFinish={(values) => onSubmit(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                {props.frm ? props.frm.map((item, i) =>
                    <Form.Item key={i} label={item.label} name={item.name}
                        rules={item.rule.map((ruleItem) => { return { required: ruleItem.required, message: ruleItem.message } })}>
                        {item.type !== 'textArea' ? <Input /> : <Input.TextArea />}
                    </Form.Item>) : ''}
            </Modal >
        </>
    );
};
export default App;