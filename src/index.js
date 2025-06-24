import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "../src/index.scss";
import "../src/style/css/feather.css";
import "../src/style/icon/fontawesome/css/all.min.css";
import "../src/style/icon/fontawesome/css/fontawesome.min.css";
import "../src/style/icon/ionic/ionicons.css";
import "../src/style/icon/tabler-icons/webfont/tabler-icons-custom.css";
import "../src/style/icon/typicons/typicons.css";
import "../src/style/icon/weather/weathericons.css";
import App from "./App";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
