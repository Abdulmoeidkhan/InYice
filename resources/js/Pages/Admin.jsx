import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Lists from '../Components/Lists/Lists';
import FormModal from '../Components/Modal/FormModal';
import { useParams } from 'react-router';


const { Content } = Layout;


const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [refreshData, setRefreshData] = useState(false);

    const addData = (values, route, id) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.post(`${domanWithPort}/${route}`, values)
            .then(function (response) {
                setRefreshData(!refreshData)
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
                setRefreshData(!refreshData)
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
                setRefreshData(!refreshData)
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    // Create/Read/Update/Delete Request Functions End Comp <FormModal>

    return (
        <Layout style={{
            padding: '0 24px 24px',
        }}>
            <Breadcrumb
                items={[
                    {
                        title: 'Admin Dashboard',
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
                                withPicture={false}
                                withUri={false}
                                fieldsToRender={['id', 'name', 'display_name', 'description']}
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
                                    initialValues={{ name: '', display_name: '', description: '' }}
                                    frm={[
                                        { label: 'Role Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input Role name!' }] },
                                        { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please input Display name of Role!' }] },
                                        { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please input Description of Role!' }] }
                                    ]} />
                            </Lists>
                        </Flex>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists
                                withUri={false}
                                withPicture={false}
                                listTitle="Permissions"
                                route="usersPermissions"
                                parentState={refreshData}
                                fieldsToRender={['id', 'name', 'display_name', 'description']}
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
                                    initialValues={{}}
                                    frm={[
                                        { label: 'Permissions Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input Permissions name!' }] },
                                        { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please input Display name of Permissions!' }] },
                                        { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please input Description of Permissions!' }] }
                                    ]}
                                />
                            </Lists>
                        </Flex>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists
                                withUri={false}
                                withPicture={false}
                                listTitle="Branches"
                                route="usersTeams"
                                parentState={refreshData}
                                fieldsToRender={['id', 'name', 'display_name', 'description']}
                                deleteComponentEssentials={{ func: deleteData }}
                                editComponentEssentials={{
                                    func: updateData, frm:
                                        [
                                            { label: 'Branch Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please edit Branch name!' }] },
                                            { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please edit Display name of Branch!' }] },
                                            { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please edit Description of Branch!' }] }
                                        ]
                                }}>
                                <FormModal
                                    workingFunction={addData}
                                    buttonDetails={{ title: 'Add', icon: <PlusOutlined />, variant: 'solid' }}
                                    title='Branches'
                                    route='usersTeams'
                                    initialValues={{}}
                                    frm={[
                                        { label: 'Branch Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input Branch name!' }] },
                                        { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: false, message: 'Please input Display name of Branch!' }] },
                                        { label: 'Description', name: 'description', type: 'textArea', rule: [{ required: false, message: 'Please input Description of Branch!' }] }
                                    ]}
                                />
                            </Lists>
                        </Flex>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists
                                withUri='client/auth'
                                withPicture={false}
                                listTitle='Company'
                                route='companies'
                                parentState={refreshData}
                                fieldsToRender={['uuid', 'name', 'display_name', 'email', 'contact', 'dashboard']}
                                deleteComponentEssentials={{ func: deleteData }}
                                editComponentEssentials={{
                                    func: updateData, frm:
                                        [
                                            { label: 'Company Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please edit Company name!' }] },
                                            { label: 'Display Name', name: 'display_name', type: 'text', rule: [{ required: true, message: 'Please edit Company Display name!' }] },
                                            { label: 'Email Address', name: 'email', type: 'text', rule: [{ required: false, message: 'Please input Display Email Address of Company!' }] },
                                            { label: 'Industry', name: 'industry', type: 'text', rule: [{ required: false, message: 'Please input Indutry of Company!' }] },
                                            { label: 'Contact', name: 'contact', type: 'number', rule: [{ required: false, message: 'Please input Contact of Company!' }] },
                                            { label: 'Address', name: 'address', type: 'textArea', rule: [{ required: false, message: 'Please input Address of Company!' }] },
                                        ]
                                }}>
                            </Lists>
                        </Flex>
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;