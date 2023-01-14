import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Router} from "./Components/Router";
import {api} from "./utils";
document.onkeydown = (e) => {
  if (e.key === "p") {
    api('/session').then(console.log);
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);