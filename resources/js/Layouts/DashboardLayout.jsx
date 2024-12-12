import React, { useState } from 'react';
import { ConfigProvider, Layout, theme, FloatButton } from 'antd';
import { SettingOutlined, CommentOutlined } from '@ant-design/icons';
import { Outlet } from "react-router";
import Menus from './LayoutsComponent/Menus';
import Headers from './LayoutsComponent/Headers';
import Footers from './LayoutsComponent/Footers';
const { Sider } = Layout;




const App = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [collapsedWidth, setCollapsedWidth] = useState(80);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { defaultAlgorithm, darkAlgorithm } = theme;



    return (
        <ConfigProvider theme={{
            algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        }}>
            <Layout>
                <Sider
                    collapsible
                    breakpoint='md'
                    collapsed={collapsed}
                    collapsedWidth={collapsedWidth}
                    onCollapse={() => setCollapsed(!collapsed)}
                    zeroWidthTriggerStyle={{ display: 'none' }}
                    theme='light'
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        insetInlineStart: 0,
                        top: 0,
                        bottom: 0,
                        scrollbarWidth: 'thin',
                        scrollbarGutter: 'stable',
                    }}
                    onBreakpoint={(broker) => {
                        broker ? setCollapsedWidth(0) : setCollapsedWidth(80);
                    }}>
                    <div style={{
                        height: 32,
                        margin: 16,
                        background: isDarkMode ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)',
                        borderRadius: 6,
                    }} />
                    <Menus />
                </Sider>
                <Layout style={collapsedWidth ? { transition: 'padding 200ms', paddingLeft: collapsed ? 80 : 200 } : {}}>
                    <Headers setIsDarkMode={setIsDarkMode} collapsedWidth={collapsedWidth}/>
                    <Outlet />
                    <FloatButton.Group
                        trigger="click"
                        style={{ insetInlineEnd: 24 }}
                        icon={<SettingOutlined />}
                    >
                        <FloatButton.BackTop visibilityHeight={100} />
                        <FloatButton />
                        <FloatButton />
                        <FloatButton icon={<CommentOutlined />} />
                    </FloatButton.Group>
                    <Footers collapsedWidth={collapsedWidth} collapsed={collapsed} setCollapsed={setCollapsed} />
                </Layout>
            </Layout>
        </ConfigProvider >
    );
};
export default App;