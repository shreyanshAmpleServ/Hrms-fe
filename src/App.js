// src/App.js
import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Loader from "./components/common/loader";
import Register from "./pages/auth/Register";
import PrivateLayout from "./pages/layouts/PrivateLayout";
import PublicLayout from "./pages/layouts/PublicLayout";
import { loadUser } from "./redux/auth/authSlice";
import { Login, privateRoutes } from "./routes/router.link";

const App = () => {
  const dispatch = useDispatch();
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const Permissions = localStorage.getItem("permissions")
    ? JSON?.parse(localStorage.getItem("permissions"))
    : [];

  const pathname = window.location.pathname;

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (pathname !== "/login") {
      dispatch(loadUser());
    }
  }, [dispatch, pathname]);

  const filteredRoutes = isAdmin
    ? privateRoutes
    : privateRoutes?.filter((route) => {
        return Permissions.some(
          (permission) =>
            route?.title?.includes(permission.module_name) &&
            Object.values(permission.permissions).some((perm) => perm === true)
        );
      });

  // useEffect(() => {
  //     if ('Notification' in window && Notification.permission === 'default') {
  //       Notification.requestPermission().then(permission => {
  //         if (permission === 'granted') {
  //           new Notification("Thanks for enabling notifications!");
  //         }
  //       });
  //     }
  //   }, []);
  // if (hasPermission) return null;
  return (
    <HelmetProvider>
      <Router>
        {loading && <Loader />}
        <Routes>
          {/* Public Layout and Routes */}
          {!isAuthenticated && (
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Additional public routes */}
            </Route>
          )}

          {/* Private Layout and Routes */}
          {isAuthenticated && (
            <Route path="/" element={<PrivateLayout />}>
              <Route
                index
                element={
                  filteredRoutes[0]?.element || (
                    <Navigate to={filteredRoutes[0]?.path || "/"} />
                  )
                }
              />
              {/* <Route index element={<Dashboard />} /> */}
              {filteredRoutes?.map((route, idx) => {
                return (
                  <Route path={route.path} element={route.element} key={idx} />
                );
              })}
            </Route>
          )}

          {/* Redirect for unmatched routes */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </HelmetProvider>
  );
};

export default App;
