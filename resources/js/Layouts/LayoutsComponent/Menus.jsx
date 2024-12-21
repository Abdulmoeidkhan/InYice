import React from 'react';
import {
    DashboardOutlined,
    HomeOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { NavLink } from "react-router";



export const menuItems = [
    {
        key: '/',
        icon: <DashboardOutlined />,
        label: (
            <NavLink to="/client/">
                Dashboard
            </NavLink>
        )
    },
    {
        key: '/home',
        icon: <HomeOutlined />,
        label: (
            <NavLink to="/client/home">
                Home
            </NavLink>
        )
    },
    {
        key: '/about',
        icon: <InfoCircleOutlined />,
        label: (
            <NavLink to="/client/about">
                About
            </NavLink>
        )
    },
];

const App = () => {

    return (
        <Menu mode="inline" items={menuItems} style={{ border: 'none' }}
            defaultSelectedKeys={[location.pathname]} />
    );
};
export default App;