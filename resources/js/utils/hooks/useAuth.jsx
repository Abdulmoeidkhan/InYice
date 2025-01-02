import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("inyiceuser", null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const logIn = async (data) => {
        setUser("inyiceuser", data);
        if (data) {
            window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        }
        navigate("/client/auth/dahsboard", { replace: true });
    };

    // call this function to sign out logged in user
    const logOut = () => {
        setUser("inyiceuser", null);
        window.axios.defaults.headers.common['Authorization'] = '';
        navigate("/client", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            logIn,
            logOut,
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};