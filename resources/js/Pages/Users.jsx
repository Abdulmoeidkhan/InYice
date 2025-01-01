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
                        <Lists listTitle="User's" route='users' fieldsToRender={['id', '', 'name', 'email']} />
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;