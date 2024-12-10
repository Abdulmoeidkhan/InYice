import React, { useState, useEffect } from 'react';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { ConfigProvider, Layout, theme, FloatButton, Avatar, Flex, Segmented, Affix, Button } from 'antd';
import { Outlet } from "react-router";
import Menus from './LayoutsComponent/Menus';
import Headers from './LayoutsComponent/Headers';
const { Sider, Footer } = Layout;




const App = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [collapsedWidth, setCollapsedWidth] = useState(80);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { defaultAlgorithm, darkAlgorithm } = theme;



    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            }}>
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    breakpoint='md'
                    collapsed={collapsed}
                    collapsedWidth={collapsedWidth}
                    theme='light'
                    // style={{ height: '100%' }}
                    onBreakpoint={(broker) => {
                        broker ? setCollapsedWidth(0) : setCollapsedWidth(80);
                    }}
                >
                    <div style={{
                        height: 32,
                        margin: 16,
                        background: isDarkMode ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)',
                        borderRadius: 6,
                    }} />
                    <Menus />
                </Sider>
                <Layout>
                    <Headers setIsDarkMode={setIsDarkMode} collapsed={collapsed} setCollapsed={setCollapsed} />
                    <Outlet />
                    <FloatButton.BackTop visibilityHeight={100} />
                    {!collapsedWidth &&
                        <Footer>
                            <Affix offsetBottom={10}>
                                <Flex gap="small" align="center" vertical>
                                    <Segmented
                                        options={[
                                            // {
                                            //     label: (
                                            //         <div
                                            //             style={{
                                            //                 padding: 4,
                                            //             }}
                                            //         >
                                            //             <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                                            //             <div>User 1</div>
                                            //         </div>
                                            //     ),
                                            //     value: 'user1',
                                            // },
                                            // {
                                            //     label: (
                                            //         <div
                                            //             style={{
                                            //                 padding: 4,
                                            //             }}
                                            //         >
                                            //             <Avatar
                                            //                 style={{
                                            //                     backgroundColor: '#f56a00',
                                            //                 }}
                                            //             >
                                            //                 K
                                            //             </Avatar>
                                            //             <div>User 2</div>
                                            //         </div>
                                            //     ),
                                            //     value: 'user2',
                                            // },
                                            {
                                                label: (
                                                    <Button
                                                        type="text"
                                                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                                        onClick={() => setCollapsed(!collapsed)}
                                                        style={{
                                                            fontSize: '16px',
                                                            height: 64,
                                                        }}
                                                    />
                                                ),
                                                value: 'user3',
                                            },
                                        ]}
                                    />
                                </Flex>
                            </Affix>
                        </Footer>
                    }
                </Layout>
            </Layout>
        </ConfigProvider >
    );
};
export default App;