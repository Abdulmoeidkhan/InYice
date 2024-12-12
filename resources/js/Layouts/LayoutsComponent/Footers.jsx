import React, { useState } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Flex, Segmented, Affix, Button } from 'antd';
const { Footer } = Layout;

const App = ({ collapsedWidth, collapsed, setCollapsed }) => {
    return (
        <>
            {!collapsedWidth &&
                <Footer style={{ padding: 0 }}>
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
                                            <Button type="text"
                                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                                onClick={() => setCollapsed(!collapsed)}
                                                style={{
                                                    fontSize: '16px',
                                                    height: 64,
                                                }} />
                                        ),
                                        value: 'user3',
                                    },
                                ]}
                            />
                        </Flex>
                    </Affix>
                </Footer>
            }</>)
}

export default App;