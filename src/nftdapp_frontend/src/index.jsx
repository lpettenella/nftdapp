import * as React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import App from "./App";
import './index.css'

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
