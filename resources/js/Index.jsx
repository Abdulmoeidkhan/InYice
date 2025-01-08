import { Routes, Route, Navigate } from 'react-router';
import React, { useState, useEffect } from 'react';
import DashboardLayout from "./Layouts/DashboardLayout";
import SignUpLayout from "./Layouts/SignUpLayout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Reset from "./Pages/Reset";
import Users from "./Pages/Users";
import Admin from "./Pages/Admin";
import { useAuth, AuthProvider } from "./utils/hooks/useAuth";
import { Spin, Flex, } from 'antd';



const ProtectedRoute = ({ children }) => {
    const { checkUser } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state


    useEffect(() => {
        checkUser().then((userChecked) => {
            setIsAuthenticated(userChecked)
        }).catch((error) => {
            setIsAuthenticated(error)
        });
    }, []);

    // Show a loading state while checking authentication
    if (isAuthenticated === null) {
        return <Flex style={{height:'100vh',width:'100vw'}} vertical align="center" justify='center' gap="middle"><Spin size="large" /></Flex>;
        // Optional: Replace with a spinner or loading component
    }

    if (isAuthenticated?.company_uuid) {
        return children;
    }
    else {
        return <Navigate to="/client" replace />;
    }

    // if (!user) {
    //     // user is not authenticated
    //     return <Navigate to="/client" replace={true} />;
    // }

};

const ProtectedAdminRoute = ({ children }) => {
    const { checkUser } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state


    useEffect(() => {
        checkUser().then((userChecked) => {
            setIsAuthenticated(userChecked)
        }).catch((error) => {
            setIsAuthenticated(error)
        });
    }, []);

    // Show a loading state while checking authentication
    if (isAuthenticated === null) {
        return <Flex style={{height:'100vh',width:'100vw'}} vertical align="center" justify='center' gap="middle"><Spin size="large" /></Flex>;
        // Optional: Replace with a spinner or loading component
    }

    // Redirect if not authenticated
    if (isAuthenticated?.userAuthorized) {
        return children;
    }
    else if (isAuthenticated?.company_uuid) {
        return <Navigate to={`/client/auth/dashboard`} replace={true} />;
    }
    else {
        return <Navigate to="/client" replace />;
    }
};

const UnProtectedRoute = ({ children }) => {
    const { checkUser } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null indicates loading state


    useEffect(() => {
        checkUser().then((userChecked) => {
            setIsAuthenticated(userChecked)
        }).catch((error) => {
            setIsAuthenticated(error)
        });
    }, []);

    // Show a loading state while checking authentication
    if (isAuthenticated === null) {
        return <Flex style={{height:'100vh',width:'100vw'}} vertical align="center" justify='center' gap="middle"><Spin size="large" /></Flex>;
        // Optional: Replace with a spinner or loading component
    }

    // Redirect if not authenticated
    if (isAuthenticated?.userAuthorized) {
        return <Navigate to={`inyice/admin`} replace={true} />;
    }
    else if (isAuthenticated?.company_uuid) {
        return <Navigate to={`auth/dashboard`} replace={true} />;
    }
    return children;
};


const App = () => {

    return (
        <AuthProvider>
            <Routes>
                <Route path="client" element={<UnProtectedRoute><SignUpLayout /></UnProtectedRoute>}>
                    <Route index element={<Login />} />
                    <Route path="reset" element={<Reset />} />
                </Route>
                <Route path="client/auth/:company" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="users" element={<Users />} />
                    {/* <Route path="admin" element={<Admin />} /> */}
                </Route>
                <Route path="client/inyice" element={<ProtectedAdminRoute><DashboardLayout /></ProtectedAdminRoute>}>
                    <Route path="admin" element={<Admin />} />
                </Route>
                {/* <Route path="auth"> */}
                {/* <Route path="admin" element={<Admin />} /> */}
                {/* <Route path="adminPanel" element={<ProtectedAdminRoute><DashboardLayout /></ProtectedAdminRoute>}>
                            <Route index element={<>Hello</>} />
                        </Route> */}
                {/* </Route> */}
            </Routes >
        </AuthProvider >
    );
};

export default App;