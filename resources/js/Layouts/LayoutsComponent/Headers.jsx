import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, MoonOutlined, HolderOutlined, SunFilled, SettingOutlined } from '@ant-design/icons';
import { Button, theme, Flex, Dropdown, Avatar, Tooltip, Switch, Layout } from 'antd';
const { Header } = Layout;


const App = ({ setIsDarkMode, collapsed, setCollapsed }) => {

    const onChangeTheme = () => {
        setIsDarkMode((previousValue) => !previousValue);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

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
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
            }}

        >
            <Flex justify={'space-between'} align={'center'} >
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
                <Flex gap="small" justify={'flex-start'} align={'center'} flex="0 0 8rem">
                    <Switch
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunFilled />}
                        onChange={onChangeTheme}
                        defaultChecked
                    />
                    <HolderOutlined />
                    <Dropdown
                        menu={{
                            items,
                        }}
                        placement="bottomRight"
                        arrow
                    >
                        {/* <Tooltip title="Ant User" placement="left"> */}
                            <Avatar
                                src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                                icon={<UserOutlined />}
                            />
                        {/* </Tooltip> */}
                    </Dropdown>
                </Flex>
            </Flex>
        </Header>
    );
};
export default App;