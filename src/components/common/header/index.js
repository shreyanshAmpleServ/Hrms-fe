import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import hrmsLogo from "../../../assets/hrmsLogo.png";
import { logoutUser } from "../../../redux/auth/authSlice";
import {
  setExpandMenu,
  setMiniSidebar,
  setMobileSidebar,
} from "../../../redux/common/commonSlice";
import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../imageWithBasePath";
import Logo from "../logo";
import { ModuleOptions } from "../selectoption/selectoption";
import ChangePassword from "./ChangePassword";
import ApprovalSidebarItem from "../Approvals";

const Header = () => {
  const route = all_routes;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mobileSidebar = useSelector((state) => state.common?.mobileSidebar);
  const miniSidebar = useSelector((state) => state.common?.miniSidebar);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const { control } = useForm();

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };
  const toggleExpandMenu = () => {
    dispatch(setExpandMenu(true));
  };
  const toggleExpandMenu2 = () => {
    dispatch(setExpandMenu(false));
  };

  const [layoutBs, setLayoutBs] = useState(localStorage.getItem("dataTheme"));
  const isLockScreen = location.pathname === "/lock-screen";

  if (isLockScreen) {
    return null;
  }
  const LayoutDark = () => {
    localStorage.setItem("dataTheme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    setLayoutBs("dark");
  };
  const LayoutLight = () => {
    localStorage.setItem("dataTheme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    setLayoutBs("light");
  };
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      localStorage.clear();
      navigate(route?.login);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      navigate(selectedOption.path);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="header  border-bottom">
        {/* Logo */}
        <div
          className="header-left active border-bottom"
          onMouseEnter={toggleExpandMenu}
          onMouseLeave={toggleExpandMenu2}
        >
          <Link to={route.dashboard} className="logo logo-normal">
            <Logo />
          </Link>
          <Link to={route.dashboard} className="logo-small">
            <ImageWithBasePath src={hrmsLogo} alt="Logo" />
          </Link>
          <Link id="toggle_btn" to="#" onClick={toggleMiniSidebar}>
            <i className="ti ti-arrow-bar-to-left" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <ul className="nav user-menu">
            <li className="nav-item nav-search-inputs me-auto">
              <div className="top-nav-search">
                <Link to="#" className="responsive-search">
                  <i className="fa fa-search" />
                </Link>
                <form className="dropdown">
                  <div className="searchinputs" id="dropdownMenuClickable">
                    <div id="searchs">
                      <Controller
                        name="Select"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={ModuleOptions}
                            placeholder="Select Modules"
                            onChange={handleSelect}
                            styles={{
                              control: (base) => ({
                                ...base,
                                height: "23px",
                                marginTop: "-10px",
                                backgroundColor: "transparent",
                                borderColor: "transparent",
                                boxShadow: "none",
                                alignItems: "center",
                                "&:hover": {
                                  borderColor: "transparent",
                                },
                                "&:focus": {
                                  borderColor: "transparent",
                                  boxShadow: "none",
                                },
                              }),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="search-addon">
                      <button type="submit">
                        <i className="ti ti-command" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            <li className="nav-item nav-list">
              <ul className="nav">
                <li className="nav-item dropdown">
                  <Link
                    to="#"
                    className="nav-link position-relative px-3 d-flex align-items-center justify-content-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-layout-grid-add" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end menus-info">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.employee}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-violet">
                                  <i className="ti ti-user-up" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Employee</p>
                                  <span>Add New Employee</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.candidates}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-green">
                                  <i className="ti ti-user-up" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Candidates</p>
                                  <span>Add New Candidate</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.appraisalEntries}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-pink">
                                  <i className="ti ti-list" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Appraisals</p>
                                  <span>Process Appraisals</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.assetAssignment}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-box" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Asset Assignment</p>
                                  <span>Manage Assets</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.projects}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-danger">
                                  <i className="ti ti-atom-2" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Projects</p>
                                  <span>Add New Project</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.leaveApplications}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-clipboard-list" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Leave Applications</p>
                                  <span>Add Leave Application</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.monthlyPayroll}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-secondary">
                                  <i className="ti ti-receipt" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Monthly Payroll</p>
                                  <span>Process Monthly Payroll</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.approvalSetup}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-tertiary">
                                  <i className="ti ti-list-check" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Approvals Setup</p>
                                  <span>Manage Approvals Setup</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={`${route.timeSheet}`}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-success">
                                  <i className="ti ti-clock" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Time Sheet</p>
                                  <span>Add New Time Sheet</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.helpdeskTicket}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-purple">
                                  <i className="ti ti-brand-campaignmonitor" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Helpdesk Ticket</p>
                                  <span>Add Helpdesk Ticket</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown nav-item-box">
              <ApprovalSidebarItem />
            </li>
            {/* <li className="nav-item dropdown nav-item-box">
              <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                <i className="ti ti-bell" />
                <span className="badge rounded-pill">13</span>
              </Link>
              <div className="dropdown-menu dropdown-menu-end notification-dropdown">
                <div className="topnav-dropdown-header">
                  <h4 className="notification-title">Notifications</h4>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    <li className="notification-message">
                      <Link to={route.activities}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="Profile"
                            />
                            <span className="badge badge-info rounded-pill" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              Ray Arnold left 6 comments on Isla Nublar SOC2
                              compliance report
                            </p>
                            <p className="noti-time">
                              Last Wednesday at 9:42 am
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.activities}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-03.jpg"
                              alt="Profile"
                            />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              Denise Nedry replied to Anna Srzand
                            </p>
                            <p className="noti-sub-details">
                              “Oh, I finished de-bugging the phones, but the
                              system&apos;s compiling for eighteen minutes, or
                              twenty. So, some minor systems may go on and off
                              for a while.”
                            </p>
                            <p className="noti-time">
                              Last Wednesday at 9:42 am
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.activities}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              alt=""
                              src="assets/img/profiles/avatar-06.jpg"
                            />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              John Hammond attached a file to Isla Nublar SOC2
                              compliance report
                            </p>
                            <div className="noti-pdf">
                              <div className="noti-pdf-icon">
                                <span>
                                  <i className="ti ti-chart-pie" />
                                </span>
                              </div>
                              <div className="noti-pdf-text">
                                <p>EY_review.pdf</p>
                                <span>2mb</span>
                              </div>
                            </div>
                            <p className="noti-time">
                              Last Wednesday at 9:42 am
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="topnav-dropdown-footer">
                  <Link to={route.activities} className="view-link">
                    View all
                  </Link>
                  <Link to="#" className="clear-link">
                    Clear all
                  </Link>
                </div>
              </div>
            </li> */}
            {/* /Notifications */}
            {/* Profile Dropdown */}
            <li className="nav-item dropdown has-arrow main-drop">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    <img
                      src={
                        user?.profile_img || "assets/img/profiles/avatar-14.jpg"
                      }
                      alt="Profile"
                      style={{ height: "100%" }}
                      className="p-1"
                    />
                  </span>
                  <span className="badge badge-success rounded-pill" />
                </span>
              </Link>
              <div className={` dropdown-menu  menu-drop-user `}>
                <div className="profilename">
                  <Link className="dropdown-item" to={route.dashboard}>
                    <i className="ti ti-layout-2" /> Dashboard
                  </Link>
                  <Link className="dropdown-item" to={route.profile}>
                    <i className="ti ti-user-pin" /> My Profile
                  </Link>
                  <Link
                    className="dropdown-item edit-popup"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#change_password_modal"
                  >
                    <i className="ti ti-password-fingerprint" /> Change Password
                  </Link>
                  {isAuthenticated && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={handleLogout}
                    >
                      <i className="ti ti-lock" /> Logout
                    </Link>
                  )}
                </div>
              </div>
            </li>
            {/* /Profile Dropdown */}
          </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className={` dropdown-menu `}>
            <Link className="dropdown-item" to={route.dashboard}>
              <i className="ti ti-layout-2" /> Dashboard
            </Link>
            <Link className="dropdown-item" to={route.profile}>
              <i className="ti ti-user-pin" /> My Profile
            </Link>
            <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#change_password_modal"
            >
              <i className="ti ti-password-fingerprint" /> Change Password
            </Link>
            <Link className="dropdown-item" onClick={handleLogout}>
              <i className="ti ti-lock" /> Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
      <ChangePassword />
    </>
  );
};

export default Header;
