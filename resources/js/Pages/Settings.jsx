import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, theme, Tabs, Flex } from "antd";
import { useParams } from "react-router";
import OrganizationProfile from "../Layouts/SettingsMenu/OrganizationProfile";
import UserProfile from "../Layouts/SettingsMenu/UserProfile";
const { Content } = Layout;

const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    
    const [selectedTab, setSelectedTab] = useState("1");
    const { company } = useParams();
    const [tabPosition, setTabPosition] = useState("left");

    useEffect(() => {
        const updateTabPosition = () => {
            setTabPosition(window.innerWidth < 768 ? "top" : "left");
        };
        updateTabPosition();
        window.addEventListener("resize", updateTabPosition);
        return () => window.removeEventListener("resize", updateTabPosition);
    }, []);

    const items = [
        {
          key: '1',
          label: 'Organization Profile',
          children: <OrganizationProfile/>,
        },
        {
          key: '2',
          label: 'User Profile',
          children: <UserProfile/>,
        },
    ];

    const activeLabel = items.find((item) => item.key === selectedTab)?.label || "Settings";

    return (
        <Layout style={{ padding: "0 16px 16px" }}>
            <Breadcrumb
                items={[
                    { title: 'Dashboard' },
                    { title: 'Setting' },
                    { title: activeLabel }
                ]}
                style={{ margin: "16px 0" }}
            />
            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    minHeight: "80vh",
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Flex gap="middle" vertical>
                    <h1>Setting</h1>
                    <Flex
                        gap="middle"
                        style={{ width: "100%", justifyContent: "center", flexWrap: "wrap" }}
                    >
                        <Flex
                            vertical
                            style={{
                                width: "100%",
                                maxWidth: "650px",
                            }}
                            gap="middle"
                        >
                            <Tabs
                                defaultActiveKey="1"
                                tabPosition={tabPosition}
                                onChange={(key) => setSelectedTab(key)}
                                items={items}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Content>
        </Layout>
    );
};

export default App;
