import React, { useState, useEffect } from 'react';
import {
    DashboardOutlined,
    HomeOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { NavLink, useLocation } from "react-router";



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
        label: 'Home',
        label: (
            <NavLink to="/Home">
                Home
            </NavLink>
        )
    },
    {
        key: '/About',
        icon: <InfoCircleOutlined />,
        label: 'About',
        label: (
            <NavLink to="/About">
                About
            </NavLink>
        )
    },
];

const App = () => {
    let location = useLocation();

    return (
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            items={menuItems}
        />
    );
};
export default App;