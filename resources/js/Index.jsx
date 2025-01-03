import { Routes, Route, Navigate } from 'react-router';
import DashboardLayout from "./Layouts/DashboardLayout";
import SignUpLayout from "./Layouts/SignUpLayout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Users from "./Pages/Users";
import Admin from "./Pages/Admin";
import { useAuth, AuthProvider } from "./utils/hooks/useAuth";


const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="/client" replace={true}/>;
    }
    return children;
};

const UnProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        // user is authenticated
        return <Navigate to="/client/auth/dashboard" replace={true}/>;
    }
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* <Route path="/client" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="home" element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="users" element={<Users />} />
                    <Route path="admin" element={<Admin />} />
                </Route>
                <Route path="/client/signin" element={<UnProtectedRoute><SignUpLayout /></UnProtectedRoute>}>
                    <Route index element={<Login />} />
                </Route> */}
                <Route path="client">
                    <Route index element={<UnProtectedRoute><SignUpLayout><Login /></SignUpLayout></UnProtectedRoute>} />
                    <Route path="auth" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="home" element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="users" element={<Users />} />
                        <Route path="admin" element={<Admin />} />
                    </Route>
                </Route>
                {/* <Route path="signin" element={} />
                </Route> */}
            </Routes>
        </AuthProvider >
    );
};

export default App;