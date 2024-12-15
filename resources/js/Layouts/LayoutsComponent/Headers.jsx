import React, { useState } from 'react';
import { UserOutlined, MoonOutlined, HolderOutlined, SunFilled, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { theme, Flex, Dropdown, Avatar, Switch, Layout, Button } from 'antd';
import { useAuth } from '../../utils/hooks/useAuth';
const { Header } = Layout;


const App = ({ setIsDarkMode, collapsedWidth }) => {

    const { logOut } = useAuth();
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
        {
            key: '5',
            label: (<Button onClick={logOut} danger type="link">LogOut</Button>),
            icon: <LogoutOutlined style={{ color: '#f81d22' }} />,
        },
    ];

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Flex justify={'space-between'} align={'center'}>
                <div style={{ fontSize: '16px', width: 64, height: 64 }}></div>
                <Flex gap={collapsedWidth ? "large" : "middle"} align={'center'}
                    justify={'flex-start'} flex={collapsedWidth ? "0 0 12rem" : "0 0 9rem"}>
                    <Switch defaultChecked onChange={onChangeTheme}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunFilled />} />
                    <HolderOutlined />
                    <Dropdown arrow placement="bottomRight" menu={{ items }}>
                        <Avatar icon={<UserOutlined />}
                            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                        />
                    </Dropdown>
                </Flex>
            </Flex>
        </Header >
    );
};
export default App;