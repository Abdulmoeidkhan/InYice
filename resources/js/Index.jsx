import { Routes, Route, Navigate } from 'react-router';
import DashboardLayout from "./Layouts/DashboardLayout";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";

const App = () => {
    return (
        <>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/About" element={<About />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;