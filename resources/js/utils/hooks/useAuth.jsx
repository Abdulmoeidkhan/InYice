import { createContext, useContext, useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
import { useDispatch } from "react-redux";
import { getAllUser } from "../constant/Redux/reducers/User/UserSlice";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("inyiceuser", null);
    
    const navigate = useNavigate();


    // call this function when you want to check user is authenticated or not 

    const checkUser = () => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        return axios.get(`${domanWithPort}/${'checkUser'}`)
            .then(function (response) {
                console.log(response)
                let { name, email, uuid, user_type, userAuthorized } = response.data.data;
                setUser("inyiceuser", { name, email, uuid, user_type, userAuthorized })
                return response.data.data
            })
            .catch(function (error) {
                setUser("inyiceuser", null);
                return Promise.reject(error);
            });
    }

    // useEffect(() => {
    //     checkUser(); 
    // }, []);  


//     export const AuthProvider = ({ children }) => {
//         const [user, setUser] = useLocalStorage("inyiceuser", null);
 
//         const dispatch = useDispatch();
//         const navigate = useNavigate();

//         // Call checkUser to fetch user data and update Redux and localStorage
//         const checkUser = () => {
//             const domainWithPort = import.meta.env.VITE_API_URL;
//             return axios.get(`${domainWithPort}/checkUser`)
//                .then(function (response) {
//                     console.log(response)
//                     const { name, email, uuid, user_type, userAuthorized, company_uuid ,imageurl } = response.data.data;
//                     setUser("inyiceuser", { name, email, uuid, user_type, userAuthorized, company_uuid ,imageurl });
//                     dispatch(getAllUser(response.data.data)); // Dispatch to Redux
//                     return response.data.data;
//                 })
//                 .catch(function (error) {
//                     setUser("inyiceuser", null);
//                     dispatch(getAllUser(null)); // Clear Redux state
//                     return Promise.reject(error);
//                 });
//         };
        
//  useEffect(() => {
//         checkUser(); 
//     }, []);  
    



    // call this function when you want to authenticate the user
    const logIn = async (data) => {
        if (data) {
            console.log(data)
            let { name, email, uuid, user_type, userAuthorized } = data;
            setUser("inyiceuser", { name, email, uuid, user_type, userAuthorized })
            navigate(`/client/auth/${data.company_uuid}/dashboard`, { replace: true });
        }
        else {
            navigate("/client", { replace: true });
        }
    };

    // call this function to sign out logged in user
    const logOut = () => {
        if (user) {
            setUser("inyiceuser", null);
            navigate(`/client`, { replace: true });
        }
        else {
            navigate("/client", { replace: true });
        }
    };

    const value = useMemo(
        () => ({
            user,
            logIn,
            logOut,
            checkUser
        }),
        [user]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};