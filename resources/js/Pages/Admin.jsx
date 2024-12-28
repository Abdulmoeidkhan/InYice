import React, { useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Lists from '../Components/Lists/Lists';
import FormModal from '../Components/Modal/FormModal';
const { Content } = Layout;





const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [refreshData, setRefreshData] = useState(false);


    // Add/Update/Delete Request Functions Start Comp <FormModal>
    const addData = (values, route, id) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.post(`${domanWithPort}/${route}`, values)
            .then(function (response) {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    const updateData = (values, route, id) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.put(`${domanWithPort}/${route}/${id}`, values)
            .then(function (response) {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    const deleteData = (value, route, id) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.delete(`${domanWithPort}/${route}/${id}`)
            .then(function (response) {
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    // Add/Update/Delete Request Functions End Comp <FormModal>

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
                            <Lists
                                listTitle="Roles"
                                route='usersRoles'
                                parentState={refreshData}
                                setParentState={setRefreshData}
                                withPicture={false}
                                withUri={false}
                                deleteComponentEssentials={{ func: deleteData }}
                                editComponentEssentials={{
                                    func: updateData, frm:
                                        [
                                            { label: 'Role Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input Role name!' }] },
                                            { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please input Display name of Role!' }] },
                                            { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please input Description of Role!' }] }
                                        ]
                                }}>
                                <FormModal
                                    workingFunction={addData}
                                    buttonDetails={{ title: 'Add', icon: <PlusOutlined />, variant: 'solid' }}
                                    title='Roles'
                                    route='usersRoles'
                                    parentState={refreshData}
                                    setParentState={setRefreshData}
                                    frm={[
                                        { label: 'Role Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input Role name!' }] },
                                        { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please input Display name of Role!' }] },
                                        { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please input Description of Role!' }] }
                                    ]} />
                            </Lists>
                        </Flex>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists listTitle="Permissions" route='usersPermissions'
                                parentState={refreshData} setParentState={setRefreshData} withPicture={false} withUri={false}
                                deleteComponentEssentials={{ func: deleteData }}
                                editComponentEssentials={{
                                    func: updateData, frm:
                                        [
                                            { label: 'Permissions Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please edit Permissions name!' }] },
                                            { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please edit Display name of Permissions!' }] },
                                            { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please edit Description of Permissions!' }] }
                                        ]
                                }}>
                                <FormModal
                                    workingFunction={addData}
                                    buttonDetails={{ title: 'Add', icon: <PlusOutlined />, variant: 'solid' }}
                                    title='Permissions'
                                    route='usersPermissions'
                                    parentState={refreshData}
                                    setParentState={setRefreshData}
                                    frm={[
                                        { label: 'Permissions Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input Permissions name!' }] },
                                        { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please input Display name of Permissions!' }] },
                                        { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please input Description of Permissions!' }] }
                                    ]}
                                />
                            </Lists>
                        </Flex>
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;