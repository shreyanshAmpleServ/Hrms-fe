// src/components/Login.js
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import bolls from "../../assets/bolls.png";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import FlashMessage from "../../components/common/modals/FlashMessage";
import { AllRoutes } from "../../config/AllRoute";
import hrmsLogo from "../../assets/hrmsLogo.png";
import { loginUser } from "../../redux/auth/authSlice";

const Login = () => {
  const route = AllRoutes;
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (error?.message) {
      setErrMsg(error.message);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email: username, password }));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.data.role;
      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard-employee");
      }
    }
  };

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  const newLocal = "h-100  d-none d-lg-block login-left position-relative ";
  return (
    <div className="account-content">
      <Helmet>
        <title>Login - DCC HRMS</title>
        <meta name="description" content="Login to access your dashboard." />
      </Helmet>
      <div className=" account-content d-flex  flex-column flex-lg-row flex-wrap w-100 vh-100 overflow-hidden account-bg-0 bg-white">
        <div className={newLocal} style={{ width: "40vw" }}>
          <img
            src={bolls}
            alt="i"
            className="position-absolute z-3 h-25 "
            style={{ bottom: "-22px", left: "-22px" }}
          />
          <img
            src={bolls}
            alt="i"
            className="position-absolute z-0  "
            style={{ top: "20%", left: "65%", height: "17%" }}
          />
          <div
            className="position-absolute z-0 m-5 rounded-5  bg-white  opacity-25  "
            style={{ height: "85%", width: "80%" }}
          ></div>
          <div
            className="m-5 p-5 rounded-5 d-flex flex-column justify-content-between  z-2  border-white "
            style={{ height: "85%", width: "80%", border: "1px solid white" }}
          >
            <div className="h1 text-white">
              Empowering people through seamless HR management.
            </div>
            <div
              style={{ fontSize: "1.25rem" }}
              className=" text-white text-center"
            >
              Efficiently manage your workforce,<div>streamline</div>
              operations effortlessly.
            </div>
          </div>
        </div>

        <div className="d-flex custom-width align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4  bg-opacity-25">
          <div
            className=" rounded "
            style={{
              border: "2px light black",
              transform: "scale(1.1)",
              padding: "40px",
              boxShadow: "10px black",
            }}
          >
            <form className="flex-fill" onSubmit={handleLogin}>
              <div className="mx-auto mw-450">
                <div className="text-center mb-4">
                  <ImageWithBasePath
                    src={hrmsLogo}
                    className="img-fluid  "
                    style={{ height: "70px", width: "90px" }}
                    alt="Logo"
                  />
                </div>
                {errMsg && (
                  <FlashMessage
                    type="error"
                    message={errMsg}
                    onClose={() => setErrMsg(null)}
                  />
                )}
                <div className="mb-4">
                  <h4>Sign In</h4>
                  <p>Access the HRMS panel using your email and passcode.</p>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Email Address</label>
                  <div className="position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-mail"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="form-check form-check-md d-flex align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkebox-md"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="checkebox-md">
                      Remember Me
                    </label>
                  </div>
                  <div className="text-end">
                    <Link
                      to={route.forgotPassword}
                      className="text-primary fw-medium link-hover"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>

                <div className="text-center">
                  <p className="fw-medium text-gray">
                    Copyright © 2025 - HRMS
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
// style={{ background: "linear-gradient(to right top,rgba(228, 33, 7, 0.49) 0%,rgba(66, 242, 104, 0.69) 50% ,rgba(143, 119, 250, 0.69) 100%) " ,color:"white" ,}}
