import React, { useEffect } from 'react';
import {
    DashboardOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    AuditOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { NavLink } from "react-router";



const pathForMyPage = '/client/auth';

export const menuItems = [
    {
        key: `${pathForMyPage}/dashboard`,
        icon: <DashboardOutlined />,
        label: (
            <NavLink to="dashboard">
                Dashboard
            </NavLink>
        )
    },
    {
        key: `${pathForMyPage}/home`,
        icon: <HomeOutlined />,
        label: (
            <NavLink to="home">
                Home
            </NavLink>
        )
    },
    {
        key: `${pathForMyPage}/about`,
        icon: <InfoCircleOutlined />,
        label: (
            <NavLink to="about">
                About
            </NavLink>
        )
    },
    {
        key: `${pathForMyPage}/users`,
        icon: <TeamOutlined />,
        label: (
            <NavLink to="users">
                Users
            </NavLink>
        )
    },
    {
        key: `${pathForMyPage}/admin`,
        icon: <AuditOutlined />,
        label: (
            <NavLink to="admin">
                Admin
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