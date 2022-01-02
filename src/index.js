import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import 'animate.css';

ReactDOM.render(
    <MoralisProvider appId="yhIoDUgbAHc1kz40zgHy54c4VkPO00B3obI5CVm0" serverUrl="https://k3fp4zetrggm.usemoralis.com:2053/server">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </MoralisProvider>
    ,
    document.getElementById('root')
);