import React, { useState } from "react";
import {
    UserOutlined,
    MoonFilled,
    HolderOutlined,
    SunFilled,
    SettingOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import {
    theme,
    Flex,
    Dropdown,
    Avatar,
    Switch,
    Layout,
    Button,
    message,
} from "antd";
import { useAuth } from "../../utils/hooks/useAuth";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { URI } from "../../utils/constant/contant";
const { Header } = Layout;

const App = ({ isDarkMode, setIsDarkMode, collapsedWidth }) => {
    const users = useSelector((state) => state.AllUsers.AllUsers);
    const ImagePath = users?.companyPicture?.path;

    const [user] = useLocalStorage("inyiceuser");
    console.log(user);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Log Out Function Start
    const key = "updatable";
    const { logOut } = useAuth();

    const logoutFunction = async (values) => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        messageApi.open({
            key,
            type: "loading",
            content: "Logging You Out...",
        });
        await axios
            .post(
                `${domanWithPort}/logout`,
                {},
                {
                    // headers: {
                    //     'Authorization': `Bearer ${user.token}`,
                    // }
                }
            )
            .then(function (response) {
                messageApi.open({
                    key,
                    type: "success",
                    content: `${response.data.message}`,
                    duration: 1,
                    onClose: () => {
                        // console.log(response);
                        setIsLoading(false);
                        logOut();
                    },
                });
            })
            .catch(function (error) {
                messageApi.open({
                    key,
                    type: "error",
                    content: `SomeThing Went Wrong,${error.response.data.message}`,
                    duration: 1,
                    onClose: () => {
                        console.log(error);
                        setIsLoading(false);
                        logOut();
                    },
                });
            });
    };
    // Log Out Function End

    // Theme Change Function Start
    const onChangeTheme = () => {
        setIsDarkMode((previousValue) => !previousValue);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    // Theme Change Function

    // Items Data Start
    const items = [
        {
            key: "1",
            label: `Hi ${
                user.name.charAt(0).toUpperCase() + user.name.slice(1)
            }!`,
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            key: "2",
            label: "Profile",
            extra: "⌘P",
        },
        {
            key: "3",
            label: "Billing",
            extra: "⌘B",
        },
        {
            key: "4",
            label: "Settings",
            icon: <SettingOutlined />,
            extra: "⌘S",
            onClick: () =>
                navigate(
                    `/client/auth/${user.company_uuid}/settings/organization`
                ),
        },
        {
            key: "5",
            label: (
                <Button
                    onClick={() => logoutFunction({ email: user.email })}
                    danger
                    type="link"
                    disabled={isLoading}
                >
                    LogOut
                </Button>
            ),
            icon: <LogoutOutlined style={{ color: "#f81d22" }} />,
        },
    ];
    // Items Data End

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            {contextHolder}
            <Flex justify={"space-between"} align={"center"}>
                <div style={{ fontSize: "16px", width: 64, height: 64 }}></div>
                <Flex
                    gap={collapsedWidth ? "large" : "middle"}
                    align={"center"}
                    justify={"flex-start"}
                    flex={collapsedWidth ? "0 0 12rem" : "0 0 9rem"}
                >
                    <Switch
                        onChange={onChangeTheme}
                        defaultChecked={!isDarkMode}
                        checkedChildren={<MoonFilled />}
                        unCheckedChildren={<SunFilled />}
                    />
                    <HolderOutlined />
                    <Dropdown arrow placement="bottomRight" menu={{ items }}>
                        <Avatar
                            icon={<UserOutlined />}
                            src={
                                users?.companyPicture?.path
                                    ? `${URI.img_uri + ImagePath}`
                                    : URI.static_img_uri
                            }
                        />
                    </Dropdown>
                </Flex>
            </Flex>
        </Header>
    );
};
export default App;
