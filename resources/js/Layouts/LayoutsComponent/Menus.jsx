import React, { useState, useEffect } from 'react';
import {
    DashboardOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    AuditOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { NavLink, useParams } from "react-router";
import { useAuth } from "../../utils/hooks/useAuth";





const App = () => {
    const { user } = useAuth();
    const { company } = useParams();

    const protectedPathForMyPage = '/client/inyice'
    const protectedMenuItem = [
        {
            key: `${protectedPathForMyPage}/admin`,
            icon: <AuditOutlined />,
            label: (
                <NavLink to={`${protectedPathForMyPage}/admin`}>
                    Admin
                </NavLink>
            )
        },
    ]

    const commonPathForMyPage = `/client/auth/${company}`;

    const menuItems = [
        {
            key: `${commonPathForMyPage}/dashboard`,
            icon: <DashboardOutlined />,
            label: (
                <NavLink to={`${commonPathForMyPage}/dashboard`}>
                    Dashboard
                </NavLink>
            )
        },
        {
            key: `${commonPathForMyPage}/home`,
            icon: <HomeOutlined />,
            label: (
                <NavLink to={`${commonPathForMyPage}/home`}>
                    Home
                </NavLink>
            )
        },
        {
            key: `${commonPathForMyPage}/about`,
            icon: <InfoCircleOutlined />,
            label: (
                <NavLink to={`${commonPathForMyPage}/about`}>
                    About
                </NavLink>
            )
        },
        {
            key: `${commonPathForMyPage}/users`,
            icon: <TeamOutlined />,
            label: (
                <NavLink to={`${commonPathForMyPage}/users`}>
                    Users
                </NavLink>
            )
        },
    ];


    return (
        <Menu mode="inline" items={user?.userAuthorized ? company ? [...menuItems, ...protectedMenuItem] : protectedMenuItem : menuItems} style={{ border: 'none' }}
            defaultSelectedKeys={[location.pathname]} />
    );
};
export default App;