// src/components/Login.js
import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AllRoutes } from "../../config/AllRoute";
import { useSelector } from "react-redux";
import FlashMessage from "../../components/common/modals/FlashMessage";
import logo from "../../assets/crms.png";
import bolls from "../../assets/bolls.png";
const Register = () => {
  const route = AllRoutes;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [errMsg, setErrMsg] = useState("");

  // Sync initial error state to errMsg
  useEffect(() => {
    if (error?.message) {
      setErrMsg(error.message);
    }
  }, [error]);
  const handleRegister = async (e) => {
    e.preventDefault();
    // const result = await dispatch(loginUser({ email:username, password }));
    const result = await dispatch(
      registerUser({ email, full_name: username, password, role_id: 1 }),
    );

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isCPasswordVisible, setCPasswordVisible] = useState(false);

  const togglePasswordVisibility = (data) => {
    data === 1 && setPasswordVisible((prevState) => !prevState);
    data === 2 && setCPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
  }, []);

  return (
    <div className="">
      <Helmet>
        <title>Register - DCC HRMS</title>
        <meta name="description" content="Login to access your dashboard." />
      </Helmet>
      <div className="account-content d-flex   flex-wrap w-100 vh-100 overflow-hidden account-bg-0 bg-white">
        {/* <img className="d-flex align-items-center justify-content-center flex-wrap  overflow-auto vh-75 m-auto p-4 w-50 bg-backdrop"  src={logo} alt='image' /> */}

        <div
          className="h-100 login-left position-relative "
          style={{ width: "45vw" }}
        >
          <img
            src={bolls}
            alt="image"
            className="position-absolute z-3 h-25 "
            style={{ bottom: "-22px", left: "-22px" }}
          />
          <img
            src={bolls}
            alt="image"
            className="position-absolute z-0  "
            style={{ top: "20%", left: "65%", height: "17%" }}
          />
          <div
            className="position-absolute z-0 m-5 rounded-5  bg-white  opacity-25 w-75 "
            style={{ height: "85%" }}
          ></div>
          <div
            className="m-5 p-5 rounded-5 d-flex flex-column justify-content-between text-white z-2 w-75 border-white border-4 "
            style={{ height: "86%" }}
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

        <div
          style={{ width: "55vw" }}
          className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-opacity-25"
        >
          <div
            // className="shadow-lg rounded "
            style={{
              border: "2px light black",
              transform: "scale(1.1)",
              padding: "40px",
              boxShadow: "10px black",
            }}
          >
            <form className="flex-fill" onSubmit={handleRegister}>
              <div className="mx-auto mw-450">
                {/* <div className="text-center mb-4">
                  <ImageWithBasePath
                    src="assets/img/logo/logo-2.png"
                    className="img-fluid  "
                    style={{ height: "70px", width: "90px" }}
                    alt="Logo"
                  />
                </div> */}

                {errMsg && (
                  <FlashMessage
                    type="error"
                    message={errMsg}
                    onClose={() => setErrMsg(null)}
                  />
                )}
                <div className="mb-4 text-center">
                  <h4>Sign Up</h4>
                  <p>Access the hrms panel using your email and passcode.</p>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Name</label>
                  <div className="position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-mail"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Email</label>
                  <div className="position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-mail"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
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
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className={`ti toggle-password ${
                        isPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={() => togglePasswordVisibility(1)}
                    ></span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Confirm Password</label>
                  <div className="pass-group">
                    <input
                      type={isCPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <span
                      className={`ti toggle-password ${
                        isCPasswordVisible ? "ti-eye" : "ti-eye-off"
                      }`}
                      onClick={() => togglePasswordVisibility(2)}
                    ></span>
                  </div>
                  {password != confirmPassword && (
                    <div className="text-primary m-xl-2">
                      confirm password is not matched !
                    </div>
                  )}
                </div>
                {/* <div className="d-flex align-items-center justify-content-between mb-3">
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
              </div> */}
                <div className="mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading || password !== confirmPassword}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
                <div className="mb-3">
                  <h6>
                    You have alread Account ?
                    <Link to={route.login} className="text-purple link-hover">
                      {" "}
                      Login
                    </Link>
                  </h6>
                </div>
                <div className="text-center">
                  <p className="fw-medium text-gray">
                    Copyright © 2024 - CRMS
                  </p>
                </div>
                {/* <div className="mb-3">
                <h6>
                  New on our platform?
                  <Link to={route.register} className="text-purple link-hover">
                    {" "}
                    Create an account
                  </Link>
                </h6>
              </div>
              <div className="form-set-login or-text mb-3">
                <h4>OR</h4>
              </div>
              <>
                <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
                  <div className="text-center me-2 flex-fill">
                    <Link
                      to="#"
                      className="br-10 p-2 px-4 btn bg-pending  d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid m-1"
                        src="assets/img/icons/facebook-logo.svg"
                        alt="Facebook"
                      />
                    </Link>
                  </div>
                  <div className="text-center me-2 flex-fill">
                    <Link
                      to="#"
                      className="br-10 p-2 px-4 btn bg-white d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid  m-1"
                        src="assets/img/icons/google-logo.svg"
                        alt="Facebook"
                      />
                    </Link>
                  </div>
                  <div className="text-center flex-fill">
                    <Link
                      to="#"
                      className="bg-dark br-10 p-2 px-4 btn btn-dark d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid  m-1"
                        src="assets/img/icons/apple-logo.svg"
                        alt="Apple"
                      />
                    </Link>
                  </div>
                </div>
                <div className="text-center">
                  <p className="fw-medium text-gray">Copyright © 2024 - CRMS</p>
                </div>
              </> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
// style={{ background: "linear-gradient(to right top,rgba(228, 33, 7, 0.49) 0%,rgba(66, 242, 104, 0.69) 50% ,rgba(143, 119, 250, 0.69) 100%) " ,color:"white" ,}}
