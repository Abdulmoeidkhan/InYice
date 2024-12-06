import React, { useState } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
const { Content } = Layout;




const App = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={{
            padding: '0 24px 24px',
        }}>
            <Breadcrumb
                items={[
                    {
                        title: 'About',
                    },
                    {
                        title: 'List',
                    },
                    {
                        title: 'App',
                    },
                ]}
                style={{
                    margin: '16px 0',
                }}
            />
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 1000,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                About
            </Content>
        </Layout>
    );
};
export default App;