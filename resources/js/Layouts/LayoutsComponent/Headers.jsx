import React, { useState } from 'react';
import { UserOutlined, MoonOutlined, HolderOutlined, SunFilled, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { theme, Flex, Dropdown, Avatar, Switch, Layout, Button, message } from 'antd';
import { useAuth } from '../../utils/hooks/useAuth';
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
const { Header } = Layout;


const App = ({ setIsDarkMode, collapsedWidth }) => {
    const [user] = useLocalStorage("user");
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const key = 'updatable';

    const { logOut } = useAuth();
    const onChangeTheme = () => {
        setIsDarkMode((previousValue) => !previousValue);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const logoutFunction = async (values) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        messageApi.open({
            key,
            type: 'loading',
            content: 'Logging You Out...',
        });
        await axios.post(`${domanWithPort}/logout`, values,{headers: {
            'Authorization': 'Bearer ' + user.token
          }})
            .then(function (response) {
                messageApi.open({
                    key,
                    type: 'warning',
                    content: `${response.data.message}`,
                    duration: 1,
                    onClose: () => {
                        console.log(response);
                        setIsLoading(false);
                        logOut()
                    },
                });
            })
            .catch(function (error) {
                messageApi.open({
                    key,
                    type: 'error',
                    content: `SomeThing Went Wrong,${error.response.data.data.error}`,
                    duration: 1,
                    onClose: () => {
                        console.log(error);
                        setIsLoading(false);
                    },
                });
            });
    }

    const items = [
        {
            key: '1',
            label: `Hi ${(user.name).charAt(0).toUpperCase() + (user.name).slice(1)} !`,
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
            label: (<Button onClick={() => logoutFunction(user.email)} danger type="link" disabled={isLoading}>LogOut</Button>),
            icon: <LogoutOutlined style={{ color: '#f81d22' }} />,
        },
    ];

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            {contextHolder}
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