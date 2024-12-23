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
        return <Navigate to="/client/signin" />;
    }
    return children;
};

const UnProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        // user is authenticated
        return <Navigate to="/client" />;
    }
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/client" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="/client/home" element={<Home />} />
                    <Route path="/client/about" element={<About />} />
                </Route>
                <Route path="/client/signin" element={<UnProtectedRoute><SignUpLayout /></UnProtectedRoute>}>
                    <Route index element={<Login />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;