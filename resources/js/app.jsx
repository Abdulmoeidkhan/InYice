import "./bootstrap";
import "../css/app.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Index from './Index'


const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <Index />
    </BrowserRouter>
);