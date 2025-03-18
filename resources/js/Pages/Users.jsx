import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Lists from '../Components/Lists/Lists';
import { useParams } from 'react-router';
import FormModal from "../Components/Modal/FormModal"


const { Content } = Layout;


const App = () => {
    // const [listData, setListData] = useState(data);
    const [refreshData, setRefreshData] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { company } = useParams();

    const addData = (values, route, id) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.post(`${domanWithPort}/${route}`, values)
            .then(function (response) {
                // console.log(response)
                setRefreshData(!refreshData)
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    const updateData = (values , route, id) => {
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
        // console.log(route,id,`${domanWithPort}/${route}/${id}`)
        return axios.delete(`${domanWithPort}/${route}/${id}`)
            .then(function (response) {
                setRefreshData(!refreshData)
                return response
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    };

    const [currentUserRole, setCurrentUserRole] = useState(null);
    console.log(currentUserRole)
    
useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/currentUser`)
        .then(res => {
            setCurrentUserRole(res.data.role); // e.g., "admin" / "user"
        })
        .catch(err => {
            console.error("Error fetching user role:", err);
        });
}, []);


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
                            listTitle="User's"
                            route={`${company}/users`}
                            parentState={refreshData}
                            withPicture={true}
                            withUri={true}
                            fieldsToRender={['id', , 'name', 'email']}
                        //     extraProps={({ id, role }) => ({
                        //         listItemId: id,
                        //         listItemRole: role
                        //     })}
                        //     {...((currentUserRole === 'owner' || 
                        //         (currentUserRole === 'admin' && listItemRole !== 'admin' && listItemId !== currentUserId)) && {
                        //        deleteComponentEssentials: { func: deleteData },
                        //        editComponentEssentials: {
                        //            func: updateData,
                        //            frm: [
                        //                { label: 'Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input User Name!' }] },
                        //                { label: 'Email Address', name: 'email', type: 'email', rule: [{ required: true, message: 'Please input User Email!' }] },
                        //                { label: 'Branch Name', name: 'branch_id', type: 'select', dataRoute: 'usersTeams', rule: [{ required: true, message: 'Please select Branch Name!' }] },
                        //                { label: 'Permissions Name', name: 'permission_display_name', type: 'select', dataRoute: 'usersPermissions', rule: [{ required: true, message: 'Please select Permissions Name!' }] },
                        //                { label: 'Role Name', name: 'role_display_name', type: 'select', dataRoute: 'usersRoles', rule: [{ required: true, message: 'Please select Role Name!' }] },
                        //            ],
                        //        }
                        //    })}

                        extraProps={({ id, role }) => ({
                            listItemId: id,
                            listItemRole: role
                        })}
                        {...((currentUserRole === 'owner' || currentUserRole === 'admin') && {
                            
                            deleteComponentEssentials: {
                                func: deleteData,
                                // Pass the necessary data here for delete
                            },
                            editComponentEssentials: {
                                func: updateData,
                                frm: [
                                    { label: 'Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input User Name!' }] },
                                    { label: 'Email Address', name: 'email', type: 'email', rule: [{ required: true, message: 'Please input User Email!' }] },
                                    { label: 'Branch Name', name: 'branch_id', type: 'select', dataRoute: 'usersTeams', rule: [{ required: true, message: 'Please select Branch Name!' }] },
                                    { label: 'Permissions Name', name: 'permission_display_name', type: 'select', dataRoute: 'usersPermissions', rule: [{ required: true, message: 'Please select Permissions Name!' }] },
                                    { label: 'Role Name', name: 'role_display_name', type: 'select', dataRoute: 'usersRoles', rule: [{ required: true, message: 'Please select Role Name!' }] },
                                ],
                            }
                        })}
                        >
                            <FormModal
                                workingFunction={addData}
                                buttonDetails={{ title: 'Add', icon: <PlusOutlined />, variant: 'solid' }}
                                title='User'
                                route={`${company}/users`}
                                initialValues={{}}
                                frm={[
                                    { label: 'Name', name: 'name', type: 'text', rule: [{ required: true, message: 'Please input User Name!' }] },
                                    { label: 'Email Address', name: 'email', type: 'email', rule: [{ required: true, message: 'Please input User Email!' }] },
                                    { label: 'Branch Name', name: 'branch_id', type: 'select', dataRoute: 'usersTeams', rule: [{ required: true, message: 'Please select Branch Name!' }] },
                                    { label: 'Permissions Name', name: 'permission_name', type: 'select', dataRoute: 'usersPermissions', rule: [{ required: true, message: 'Please select Permissions Name!' }] },
                                    { label: 'Role Name', name: 'role_name', type: 'select', dataRoute: 'usersRoles', rule: [{ required: true, message: 'Please select Role Name!' }] },
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