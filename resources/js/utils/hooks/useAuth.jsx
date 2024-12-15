import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const logIn = async (data) => {
        setUser("user", data);
        navigate("/");
    };

    // call this function to sign out logged in user
    const logOut = () => {
        setUser("user", null);
        navigate("/signIn", { replace: true });
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