import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, theme, FloatButton } from 'antd';
import { SettingOutlined, CommentOutlined, CompressOutlined, ExpandOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Outlet } from "react-router";
import Menus from './LayoutsComponent/Menus';
import Headers from './LayoutsComponent/Headers';
import Footers from './LayoutsComponent/Footers';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
const { Sider } = Layout;




const App = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [collapsedWidth, setCollapsedWidth] = useState(80);
    const [darkMode, setTheme] = useLocalStorage("darkMode");
    const [compactMode, setCompactMode] = useLocalStorage("compactMode");
    const [isDarkMode, setIsDarkMode] = useState(darkMode || false);
    const [isCompactMode, setIsCompactMode] = useState(compactMode || false);


    const { defaultAlgorithm, darkAlgorithm, compactAlgorithm } = theme;


    // Prepare effect holder
    const createHolder = (node) => {
        const { borderWidth } = getComputedStyle(node);
        const borderWidthNum = parseInt(borderWidth, 10);
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.inset = `-${borderWidthNum}px`;
        div.style.borderRadius = 'inherit';
        div.style.background = 'transparent';
        div.style.zIndex = '999';
        div.style.pointerEvents = 'none';
        div.style.overflow = 'hidden';
        node.appendChild(div);
        return div;
    };
    const createDot = (holder, color, left, top, size = 0) => {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.left = `${left}px`;
        dot.style.top = `${top}px`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.borderRadius = '50%';
        dot.style.background = color;
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.transition = 'all 1s ease-out';
        holder.appendChild(dot);
        return dot;
    };

    // Inset Effect
    const showInsetEffect = (node, { event, component }) => {
        if (component !== 'Button') {
            return;
        }
        const holder = createHolder(node);
        const rect = holder.getBoundingClientRect();
        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        const dot = createDot(holder, 'rgba(255, 255, 255, 0.65)', left, top);

        // Motion
        requestAnimationFrame(() => {
            dot.ontransitionend = () => {
                holder.remove();
            };
            dot.style.width = '200px';
            dot.style.height = '200px';
            dot.style.opacity = '0';
        });
    };

    useEffect(() => { setTheme('darkMode', isDarkMode) }, [isDarkMode])
    useEffect(() => { setCompactMode('compactMode', isCompactMode) }, [isCompactMode])
    return (
        <ConfigProvider theme={{
            algorithm: isDarkMode ? (isCompactMode ? [darkAlgorithm, compactAlgorithm] : darkAlgorithm) : (isCompactMode ? [defaultAlgorithm, compactAlgorithm] : defaultAlgorithm),
            // token: {
            //     colorPrimaryBg: '#1677ff',
            // },
        }} wave={{ showEffect: showInsetEffect }}>
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
                        zIndex: 1000,
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
                    <Headers isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} collapsedWidth={collapsedWidth} />
                    <Outlet />
                    <FloatButton.Group
                        trigger="click"
                        style={collapsedWidth > 0 ? { insetInlineEnd: 30 } : { insetInlineEnd: 30, bottom: 100 }}
                        icon={<SettingOutlined />}
                    >
                        <FloatButton.BackTop visibilityHeight={100} />
                        {/* <FloatButton />
                        <FloatButton />
                        <FloatButton icon={<CommentOutlined />} /> */}
                        <FloatButton icon={isCompactMode ? <ExpandOutlined /> : <CompressOutlined />} onClick={() => setIsCompactMode((isCompactMode) => !isCompactMode)} />
                    </FloatButton.Group>
                    {collapsedWidth < 80 && <FloatButton.Group style={{ insetInlineEnd: 30 }}>
                        <FloatButton icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed((collapsed) => !collapsed)} />
                    </FloatButton.Group>}
                    {/* <Footers collapsedWidth={collapsedWidth} collapsed={collapsed} setCollapsed={setCollapsed} /> */}
                </Layout>
            </Layout>
        </ConfigProvider >
    );
};
export default App;