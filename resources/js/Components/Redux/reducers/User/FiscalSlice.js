// src/redux/settingsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    language: null,
    timezone: null,
    dateFormat: null,
    fiscalYear: null,
    fiscalStartDate: null,
    fiscalRange: "",
};

const FiscalSlice = createSlice({
    name: "fiscal",
    initialState,
    reducers: {
        setLanguage: (state, { payload }) => {
            state.language = payload;
        },
        setTimezone: (state, { payload }) => {
            state.timezone = payload;
        },
        setDateFormat: (state, { payload }) => {
            state.dateFormat = payload;
        },
        setFiscalYear: (state, { payload }) => {
            state.fiscalYear = payload.fiscalYear;
            state.fiscalStartDate = payload.fiscalStartDate;
            state.fiscalRange = payload.fiscalRange;
        },
    },
});

export const { setLanguage, setTimezone, setDateFormat, setFiscalYear } = FiscalSlice.actions;

export default FiscalSlice.reducer;
