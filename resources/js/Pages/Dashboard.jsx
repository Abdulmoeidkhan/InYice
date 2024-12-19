import React, { useState } from 'react';
import { Breadcrumb, Layout, theme, Avatar, List, Space, Flex} from 'antd';
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
                <Flex gap="middle" vertical>
                    <h1>Dashboard</h1>
                    <Flex gap="middle" justify={'center'} align={'space-evenly'}>
                        <Lists listTitle="Users"/>
                        <Space
                            direction="vertical"
                            size="middle"
                            style={{
                                display: 'flex',
                                width: '100%',
                            }}>
                            <h2>Users</h2>
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                            title={item.title}
                                            description=""
                                        />
                                    </List.Item>
                                )}
                            />
                        </Space>
                    </Flex>
                </Flex>
            </Content>
        </Layout >
    );
};
export default App;