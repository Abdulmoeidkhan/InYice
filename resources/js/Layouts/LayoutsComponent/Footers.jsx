import React, { useState } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Flex, Segmented, Affix, Button } from 'antd';
const { Footer } = Layout;

const App = ({ collapsedWidth, collapsed, setCollapsed }) => {
    return (
        <>
            {!collapsedWidth &&
                <Footer style={{ padding: 0 }}>
                    {/* <Affix offsetBottom={10}>
                        <Flex gap="middle" justify='flex-end'>
                            <Segmented
                                options={[
                                    {
                                        label: (
                                            <Button type="text"
                                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                                onClick={() => setCollapsed(!collapsed)}
                                                style={{
                                                    fontSize: '16px',
                                                    height: 64,
                                                }} />
                                        ),
                                        value: 'menu',
                                    },
                                ]}
                            />
                        </Flex>
                    </Affix> */}
                </Footer>
            }</>)
}

export default App;