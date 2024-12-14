import { Routes, Route, Navigate } from 'react-router';
import DashboardLayout from "./Layouts/DashboardLayout";
import SignUpLayout from "./Layouts/SignUpLayout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Login from "./Pages/Login";

const App = () => {
    return (
        <>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/About" element={<About />} />
                </Route>
                <Route path="/signIn" element={<SignUpLayout />}>
                    <Route index element={<Login />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;