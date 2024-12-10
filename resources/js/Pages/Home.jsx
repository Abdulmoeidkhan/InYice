import React from 'react';
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
                        title: 'Home',
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
                    height: 1200,
                    minHeight: 800,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                Home
            </Content>
        </Layout>
    );
};
export default App;