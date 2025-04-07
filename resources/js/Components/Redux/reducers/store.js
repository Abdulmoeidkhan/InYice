import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./User/UserSlice"
import FiscalSlice from "./User/FiscalSlice"




export const store = configureStore({
    reducer:{
        AllUsers:UserSlice,
        fiscal: FiscalSlice,
        
    
    },
})