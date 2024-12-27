import React, { useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex, Form, Input } from 'antd';
import Lists from '../Components/Lists/Lists';
import FormModal from '../Components/Modal/FormModal';
const { Content } = Layout;





const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [refreshData, setRefreshData] = useState(false);


    // Add Request Functions Start Comp <FormModal>
    const addData = (values, route) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.post(`${domanWithPort}/${route}`, values)
            .then(function (response) {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    // Add Request Functions End Comp <FormModal>

    return (
        <Layout style={{
            padding: '0 24px 24px',
        }}>
            <Breadcrumb
                items={[
                    {
                        title: 'Dashboard',
                    },
                ]}
                style={{
                    margin: '16px 0',
                }}
            />
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 1000,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Flex gap="middle" vertical >
                    <h1>Admin Dashboard</h1>
                    <Flex gap="middle" style={{ width: '100%' }} justify='space-evenly' wrap>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists listTitle="Roles" route='usersRoles' 
                            // searchKeys={['name', 'display_name']}
                             parentState={refreshData} setParentState={setRefreshData} withPicture={false} withUri={false}>
                                <FormModal addFunction={addData} title='Roles' route='usersRoles' parentState={refreshData} setParentState={setRefreshData}>
                                    <Form.Item
                                        label='Role Name'
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
                                                message: 'Please input Display name of Role!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="description" label="Description">
                                        <Input type="textarea" />
                                    </Form.Item>
                                </FormModal>
                            </Lists>
                        </Flex>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists listTitle="Permissions" route='usersPermissions' 
                            // searchKeys={['name', 'display_name']}
                             parentState={refreshData} setParentState={setRefreshData} withPicture={false} withUri={false}>
                                <FormModal addFunction={addData} title='Permissions' route='usersPermissions' parentState={refreshData} setParentState={setRefreshData}>
                                    <Form.Item
                                        label='Permissions Name'
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input Permissions name!',
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
                                                message: 'Please input Display name of Permissions!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="description" label="Description">
                                        <Input type="textarea" />
                                    </Form.Item>
                                </FormModal>
                            </Lists>
                        </Flex>
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;