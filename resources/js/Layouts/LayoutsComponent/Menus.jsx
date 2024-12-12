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
            <NavLink to="/">
                Dashboard
            </NavLink>
        )
    },
    {
        key: '/Home',
        icon: <HomeOutlined />,
        label: (
            <NavLink to="/Home">
                Home
            </NavLink>
        )
    },
    {
        key: '/About',
        icon: <InfoCircleOutlined />,
        label: (
            <NavLink to="/About">
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