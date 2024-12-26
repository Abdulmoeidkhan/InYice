import React, { useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex } from 'antd';
import Lists from '../Components/Lists/Lists';
const { Content } = Layout;





const App = () => {
    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];
    const [listData, setListData] = useState(data);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
                            <Lists listTitle="Roles" route='usersRoles' searchKeys={['name', 'display_name']} addButton='true'/>
                        </Flex>
                        <Flex vertical style={{ width: '90%', minWidth: '200px', maxWidth: '650px' }} gap='middle' >
                            <Lists listTitle="Permissions" route='usersPermissions' searchKeys={['name', 'display_name']} addButton='true'/>
                        </Flex>
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;