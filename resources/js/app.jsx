import "./bootstrap";
import "../css/app.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Index from "./Index";
import { Provider } from "react-redux";
import { store } from "./utils/constant/Redux/reducers/store";
import React from "react";

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Provider store={store}>
            <Index />
        </Provider>
    </BrowserRouter>
);
