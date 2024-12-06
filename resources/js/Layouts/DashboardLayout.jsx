import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined,SettingOutlined } from '@ant-design/icons';
import { Button, Layout, theme, Flex, Dropdown, Avatar, Tooltip } from 'antd';
import { Outlet } from "react-router";
import Menus from './LayoutsComponent/Menus';
const { Header, Sider, Content } = Layout;




const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedWidth, setCollapsedWidth] = useState(80);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const demoLogoVertical = {
        height: 32,
        margin: 16,
        background: 'rgba(255, 255, 255, .2)',
        borderRadius: 6
    }

    const items = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            extra: '⌘P',
        },
        {
            key: '3',
            label: 'Billing',
            extra: '⌘B',
        },
        {
            key: '4',
            label: 'Settings',
            icon: <SettingOutlined />,
            extra: '⌘S',
        },
    ];

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                breakpoint='md'
                collapsed={collapsed}
                collapsedWidth={collapsedWidth}
                onBreakpoint={(broker) => {
                    broker ? setCollapsedWidth(0) : setCollapsedWidth(80);
                }}
            >
                <div style={demoLogoVertical} />
                <Menus />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        paddingRight: 50,
                        background: colorBgContainer,
                    }}
                >
                    <Flex justify={'space-between'} align={'center'}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />

                        <Dropdown
                            menu={{
                                items,
                            }}
                            placement="bottomRight"
                            arrow
                        >
                            <Tooltip title="Ant User" placement="left">
                                <Avatar
                                    src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                                    icon={<UserOutlined />}
                                />
                            </Tooltip>
                        </Dropdown>
                    </Flex>
                </Header>
                <Outlet />
            </Layout>
        </Layout>
    );
};
export default App;