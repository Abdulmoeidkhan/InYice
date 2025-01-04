import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("inyiceuser", null);
    const navigate = useNavigate();

    // To Check User is authenticated or not 
    useEffect(() => {
        checkUser()
    }, [])

    // call this function when you want to check user is authenticated or not 

    const checkUser =  () => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.get(`${domanWithPort}/${'checkUser'}`)
            .then(function (response) {
                console.log(response.data.data)
                setUser("inyiceuser", response.data.data)
                return response.data.data
            })
            .catch(function (error) {
                setUser("inyiceuser", null);
                // return Promise.reject(error);
            });
    }



    // call this function when you want to authenticate the user
    const logIn = async (data) => {
        // console.log(data)
        checkUser()
        if (user) {
            // setUser("inyiceuser", data);
            // window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
            navigate("/client/auth/dashboard", { replace: true });
        }
        else {
            navigate("/client", { replace: true });
        }
    };

    // call this function to sign out logged in user
    const logOut = () => {
        checkUser()
        if (user) {
            navigate("/client/auth/dashboard", { replace: true });
        }
        else {
            // setUser("inyiceuser", null);
            // window.axios.defaults.headers.common['Authorization'] = '';
            navigate("/client", { replace: true });
        }
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