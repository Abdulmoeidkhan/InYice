import React, { useEffect, useState, useId } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, message, InputNumber, Select } from 'antd';
const { Option } = Select;

const App = (props) => {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [formInitialValues, setFormInitialValues] = useState({});
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectOptionData, setSelectOptionData] = useState({});

    const uniqueId = useId();

    const key = 'updatable';

    const onSubmit = async (values) => {
        setConfirmLoading(true);
        messageApi.open({
            key,
            type: 'loading',
            content: 'Validating Your Request...',
        });
        let temporaryIdKey = props?.initialValues?.id || props?.initialValues?.uuid
        props.workingFunction(values, props.route, temporaryIdKey).then((response) => {
            setConfirmLoading(false);
            setOpen(false);
            console.log(response.data.data,props?.initialValues)
            setFormInitialValues(temporaryIdKey ? response.data.data : {});
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
                content: `SomeThing Went Wrong,${JSON.stringify(error?.response?.data?.data) || 'Submit failed!'}`,
                duration: 1,
                onClose: () => {
                    console.log(error.response)
                },
            });
        });
       
    };

    useEffect(() => {
       
        if (props?.initialValues) {
            setFormInitialValues(props.initialValues)
        }
    }, [])

    useEffect(() => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        props.frm.map((value) => {
            if (value.type == 'select') {
                axios.get(`${domanWithPort}/${value.dataRoute}`)
                    .then(function (response) {
                       
                        setSelectOptionData((prevState) => ({
                            ...prevState,
                            [value.dataRoute]: response.data.data,
                        }));
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            } 
       
        })
    }, [])


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
                        initialValues={formInitialValues}
                        clearOnDestroy
                        onFinish={(values) => onSubmit(values)}
                    >
                        {dom}
                    </Form>
                )}
            >
                {props.frm ? props.frm.map((item, i) =>
                    <Form.Item key={i} label={item.label}
                
                        name={item.name}
                        rules={item.rule.map((ruleItem) => { return { required: ruleItem.required, message: ruleItem.message } })}>
                        {item.type === 'textArea' && <Input.TextArea />}
                        {item.type === 'number' && <InputNumber style={{ width: '100%' }} />}
                        {(item.type === 'text' || item.type === 'email') && <Input />}
                        {item.type === 'select' && <Select placeholder={item.rule[0].message} allowClear>
                            {selectOptionData.hasOwnProperty(item.dataRoute) && selectOptionData[item.dataRoute].map((optData, index) => <Option key={`${uniqueId}-${index}`} value={optData.id}>{optData.display_name}</Option>)}
                        </Select>}
        
                    </Form.Item>) : ''}
                    
            </Modal >
        </>
    );
};
export default App;