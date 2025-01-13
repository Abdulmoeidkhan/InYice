import React, { useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Lists from '../Components/Lists/Lists';
import { useParams } from 'react-router';
import FormModal from "../Components/Modal/FormModal"


const { Content } = Layout;


const App = () => {
    // const [listData, setListData] = useState(data);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { company } = useParams();

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
        // console.log(values, route, id)
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


    return (
        <Layout style={{
            padding: '0 24px 24px',
        }}>
            <Breadcrumb
                items={[
                    {
                        title: 'Users',
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
                <Flex gap="middle" justify='space-evenly' wrap width='100%'>
                    <h1>User's Dashboard</h1>
                    <Flex vertical style={{ width: '90%', minWidth: '200px' }} gap='middle'>
                        <Lists
                            withUri={true}
                            withPicture={true}
                            listTitle="User's"
                            route={`${company}/users`}
                            fieldsToRender={['id', '', 'name', 'email']} >
                            <FormModal
                                workingFunction={addData}
                                buttonDetails={{ title: 'Add', icon: <PlusOutlined />, variant: 'solid' }}
                                title='User'
                                route={`${company}/users`}
                                initialValues={{}}
                                frm={[
                                    { label:'Name', name:'name', type:'text', rule:[{ required: true, message: 'Please input User name!' }] },
                                    { label:'Email Address', name:'user_email', type:'email', rule:[{ required: true, message: 'Please input User Email!' }] },
                                    { label:'Branch Name', name:'branch_name', type:'text', rule:[{ required: true, message: 'Please input Branch name!' }] },
                                    { label:'Permissions Name', name:'permission_name', type:'text', rule:[{ required: true, message: 'Please input Permissions name!' }] },
                                    { label:'Role Name', name:'role_name', type:'text', rule:[{ required: true, message: 'Please input Role name!' }] },
                                ]}
                            />
                        </Lists>
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;