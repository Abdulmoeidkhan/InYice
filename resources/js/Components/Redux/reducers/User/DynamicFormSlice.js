// src/redux/reducers/User/OrganizationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {},
};

const DynamicFormSlice = createSlice({
  name: "dynamic",
  initialState,
  reducers: {
    setOrganizationData: (state, action) => {
      state.formData = action.payload; 
    },
  },
});

export const { setOrganizationData } = DynamicFormSlice.actions;

export default DynamicFormSlice.reducer;
