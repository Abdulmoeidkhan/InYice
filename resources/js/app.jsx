import "./bootstrap";
import "../css/app.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Index from './Index';
// import { store } from "./Components/Redux/reducers/store.js";
import { Provider } from "react-redux";
import { store } from "./utils/constant/Redux/reducers/store";


const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
    <BrowserRouter>
    <Provider store={store}> 
        <Index/>
    </Provider>
    </BrowserRouter>
);