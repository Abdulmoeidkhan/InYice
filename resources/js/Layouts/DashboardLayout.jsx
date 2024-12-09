import React, { useState } from 'react';
import { ConfigProvider, Layout, theme } from 'antd';
import { Outlet } from "react-router";
import Menus from './LayoutsComponent/Menus';
import Headers from './LayoutsComponent/Headers';
const { Sider } = Layout;




const App = () => {
    const [collapsed, setCollapsed] = useState(false);
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
                        style={{height:'100vh'}}
                        onBreakpoint={(broker) => {
                            broker ? setCollapsedWidth(0) : setCollapsedWidth(80);
                        }}
                    >
                        <div style={{
                            height: 32,
                            margin: 16,
                            background: isDarkMode ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)',
                            borderRadius: 6
                        }} />
                        <Menus />
                    </Sider>
                <Layout>
                    <Headers setIsDarkMode={setIsDarkMode} collapsed={collapsed} setCollapsed={setCollapsed} />
                    <Outlet />
                </Layout>
            </Layout>
        </ConfigProvider >
    );
};
export default App;