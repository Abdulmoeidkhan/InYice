import React, { useState } from 'react';
import { ConfigProvider, Layout, theme, Watermark, Flex, Divider } from 'antd';
import { Outlet } from "react-router";
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

const { Content, Sider } = Layout;


const App = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [darkMode] = useLocalStorage("darkMode");
    const [isDarkMode] = useState(darkMode || false);

    const { defaultAlgorithm, darkAlgorithm } = theme;

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

    return (
        <ConfigProvider theme={{
            algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
            token: {
                colorPrimaryBg: '#1677ff',
            },
        }} wave={{ showEffect: showInsetEffect }}>
            <Watermark content="InYice">
                <Layout>
                    <Sider theme='light' breakpoint='lg' width="50vw" collapsed={collapsed}
                        zeroWidthTriggerStyle={{ display: 'none' }} collapsedWidth={0}
                        onBreakpoint={(broker) => {
                            broker ? setCollapsed(true) : setCollapsed(false);
                        }}
                    >
                        <Flex align='center' justify='center' style={{ height: '100vh' }}>
                            <Divider variant="dashed" style={{ borderColor: '#1677ff' }} >
                                <p style={{ fontSize: '64px' }}>InYice</p>
                            </Divider>
                        </Flex>
                    </Sider>
                    <Content>
                        <Flex align='center' justify='center' style={{ width: collapsed ? '100vw' : '50vw', height: '100vh' }}>
                            <Outlet />
                            {/* {props.children} */}
                        </Flex>
                    </Content>
                </Layout>
            </Watermark>
        </ConfigProvider >
    );
};
export default App;