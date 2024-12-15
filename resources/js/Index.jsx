import { Routes, Route, Navigate } from 'react-router';
import DashboardLayout from "./Layouts/DashboardLayout";
import SignUpLayout from "./Layouts/SignUpLayout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Login from "./Pages/Login";
import { useAuth, AuthProvider } from "./utils/hooks/useAuth";


const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="/signIn" />;
    }
    return children;
};

const UnProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/About" element={<About />} />
                </Route>
                <Route path="/signIn" element={<UnProtectedRoute><SignUpLayout /></UnProtectedRoute>}>
                    <Route index element={<Login />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;