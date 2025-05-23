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
import Settings from './Pages/Settings';
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from './utils/constant/Redux/reducers/User/UserSlice';
import axios from 'axios';
// import { getAllUser } from "../../utils/constant/Redux/reducers/User/UserSlice";


// Utility component for showing a loading spinner
const LoadingScreen = () => (
    <Flex
        style={{ height: "100vh", width: "100vw" }}
        vertical
        align="center"
        justify="center"
        gap="middle"
    >
        <Spin size="large" />
    </Flex>
);

// Custom hook to centralize authentication logic
// const useAuthCheck = () => {
//     const { checkUser } = useAuth();
//     const [authState, setAuthState] = useState(null);

//     useEffect(() => {
//         checkUser()
//             .then((userChecked) => setAuthState(userChecked))
//             .catch(() =>
//                 setAuthState({ company_uuid: null, userAuthorized: false })
//             );
//     }, []);

//     return authState;
// };



export const useAuthCheck = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.AllUsers.AllUsers); // Fetching user from Redux state
    const [authState, setAuthState] = useState(null);
  
    useEffect(() => {
      if (!userData || !userData.company_uuid) {
        // Only fetch if data is not in Redux
        const fetchUser = async () => {
          const domain = import.meta.env.VITE_API_URL;
          try {
            const response = await axios.get(`${domain}/checkUser`);
            console.log('api is running',response)
            const data = response?.data?.data;
            dispatch(getAllUser(data)); // Dispatch user data to Redux
            setAuthState(data); // Set authState
          } catch (error) {
            setAuthState({ company_uuid: null, userAuthorized: false });
          }
        };
  
        fetchUser();
      } else {
        // If user data exists in Redux, directly use it
        setAuthState(userData);
      }
    }, [userData, dispatch]); // Dependencies array
  
    return authState;
  };

// const useAuthCheck = () => {
//     const userData = useSelector((state) => state.AllUsers.AllUsers);
//     // console.log(user)
//     const [authState, setAuthState] = useState(null);

//     useEffect(() => {
//         if (userData) {
//             setAuthState(userData);
//         } else {
//             setAuthState({ company_uuid: null, userAuthorized: false });
//         }
//     }, [userData]);

//     return authState;
// };

// export default useAuthCheck;


// Protected Route: Validates company UUID
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthCheck();

    if (isAuthenticated === null) {
        return <LoadingScreen />;
    }
    if (isAuthenticated.company_uuid) {
        return children;
    }
    else if (isAuthenticated.userAuthorized) {
        return <Navigate to="/client/inyice/admin" replace />;
    }

    return <Navigate to="/client" replace />;
};

// Protected Admin Route: Validates admin authorization
const ProtectedAdminRoute = ({ children }) => {
    const isAuthenticated = useAuthCheck();

    if (isAuthenticated === null) {
        return <LoadingScreen />;
    }

    if (isAuthenticated.userAuthorized) {
        return children;
    }
    else if (isAuthenticated.company_uuid) {
        return (
            <Navigate 
                to={`/client/auth/${isAuthenticated.company_uuid}/dashboard`}
                replace
            />
        );
    }

    return <Navigate to="/client" replace />;
};

// Unprotected Route: Redirects based on user state
const UnProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthCheck();

    if (isAuthenticated === null) {
        return <LoadingScreen />;
    }

    if (isAuthenticated.userAuthorized) {
        return <Navigate to="/client/inyice/admin" replace />;
    }
    else if (isAuthenticated.company_uuid) {
        return (
            <Navigate
                to={`/client/auth/${isAuthenticated.company_uuid}/dashboard`}
                replace
            />
        );
    }

    return children;
};


const App = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* Unprotected Routes */}
                <Route path="client" element={<UnProtectedRoute><SignUpLayout /></UnProtectedRoute>}>
                    <Route index element={<Login />} />
                    <Route path="reset" element={<Reset />} />
                </Route>

                {/* Protected Routes */}
                <Route path="client/auth/:company" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

            


                {/* Protected Admin Routes */}
                <Route path="client/inyice" element={<ProtectedAdminRoute><DashboardLayout /></ProtectedAdminRoute>} >
                    <Route path='admin' element={<Admin />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;