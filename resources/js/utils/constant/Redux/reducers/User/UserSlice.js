import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    AllUsers: []
}

const UserSlice = createSlice({
    name:"All_User",
    initialState,
    reducers:{
        getAllUser:(state,{payload})=>{
            state.AllUsers = payload
        }

    }
})

export const {getAllUser} = UserSlice.actions

export default UserSlice.reducer