import React from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
import CollapseHeader from "../../../components/common/collapse-header";
import Select from "react-select";

const Localization = () => {
  const route = all_routes;
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
  ];
  const timezoneOptions = [
    { value: "utc5:30", label: "UTC 5:30" },
    { value: "utc+11:00", label: "(UTC+11:00) INR" },
  ];
  const dateOptions = [
    { value: "22-Jul-2023", label: "22 Jul 2023" },
    { value: "Jul-22-2023", label: "Jul 22 2023" },
  ];
  const timeFormatOptions = [
    { value: "12-hours", label: "12 Hours" },
    { value: "24-hours", label: "24 Hours" },
  ];
  const yearOptions = [
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
  ];
  const monthOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
  ];
  const country = [
    { value: "India", label: "India" },
    { value: "United States Of America", label: "United States Of America" },
  ];
  const symbols = [
    { value: "$", label: "$" },
    { value: "€", label: "€" },
    { value: "€", label: "€" },
  ];
  const symbolsandvalue = [
    { value: "$100", label: "$100" },
    { value: "$400", label: "$400" },
  ];
  const dot = [
    { value: ".", label: "." },
    { value: ".", label: "." },
  ];
  const comma = [
    { value: ",", label: "," },
    { value: ",", label: "," },
  ];
  const permissionforcountry = [
    { value: "Allow All Country", label: "Allow All Country" },
    { value: "Deny All Country", label: "Deny All Country" },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">Settings</h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Settings Menu */}
            <div className="card">
              <div className="card-body pb-0 pt-2">
                <ul className="nav nav-tabs nav-tabs-bottom">
                  <li className="nav-item me-3">
                    <Link to={route.profile} className="nav-link px-0 ">
                      <i className="ti ti-settings-cog" /> General Settings
                    </Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link
                      to={route.companySettings}
                      className="nav-link px-0 active"
                    >
                      <i className="ti ti-world-cog" /> Website Settings
                    </Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link to={route.invoiceSettings} className="nav-link px-0">
                      <i className="ti ti-apps" /> App Settings
                    </Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link to={route.emailSettings} className="nav-link px-0 ">
                      <i className="ti ti-device-laptop" /> System Settings
                    </Link>
                  </li>
                  <li className="nav-item me-3">
                    <Link to={route.paymentGateways} className="nav-link px-0">
                      <i className="ti ti-moneybag" /> Financial Settings
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link to={route.storage} className="nav-link px-0 ">
                      <i className="ti ti-flag-cog" /> Other Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* /Settings Menu */}
            <div className="row">
              <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                {/* Settings Sidebar */}
                <div className="card">
                  <div className="card-body">
                    <div className="settings-sidebar">
                      <h4 className="fw-semibold mb-3">Website Settings</h4>
                      <div className="list-group list-group-flush settings-sidebar">
                        <Link to={route.companySettings} className="fw-medium">
                          Company Settings
                        </Link>
                        <Link
                          to={route.localization}
                          className="fw-medium active"
                        >
                          Localization
                        </Link>
                        <Link to={route.prefixes} className="fw-medium">
                          Prefixes
                        </Link>
                        <Link to={route.preference} className="fw-medium">
                          Preference
                        </Link>
                        <Link to={route.appearance} className="fw-medium">
                          Appearance
                        </Link>
                        <Link to={route.language} className="fw-medium">
                          Language
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Settings Sidebar */}
              </div>
              <div className="col-xl-9 col-lg-12">
                {/* Prefixes */}
                <div className="card">
                  <div className="card-body">
                    <h4 className="fw-semibold mb-3">Localization</h4>
                    <form>
                      <div className="border-bottom mb-3 pb-3">
                        <h5 className="fw-semibold mb-1">Basic Information</h5>
                        <p>Provide the basic information below</p>
                      </div>
                      <div className="border-bottom mb-3">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Language</h6>
                              <p>Select Language of the website</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={languageOptions}
                                className="select"
                                placeholder="Select Language"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Language Switcher</h6>
                              <p>To display in all the pages</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <div className="status-toggle">
                                <input
                                  type="checkbox"
                                  id="prefer3"
                                  className="check"
                                  defaultChecked
                                />
                                <label
                                  htmlFor="prefer3"
                                  className="checktoggle"
                                >
                                  {" "}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Timezone</h6>
                              <p>Select date format to display in website</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={timezoneOptions}
                                className="select"
                                placeholder="Select Timezone"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Date Format</h6>
                              <p>Select Language of the website</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={dateOptions}
                                className="select"
                                placeholder="Select Date Format"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Time Format</h6>
                              <p>Select time format to display in website</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={timeFormatOptions}
                                className="select"
                                placeholder="Select Time Format"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Financial Year</h6>
                              <p>Select year for finance</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={yearOptions}
                                className="select"
                                placeholder="Select Year"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Starting Month</h6>
                              <p>Select starting month to display</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={monthOptions}
                                className="select"
                                placeholder="Select Month"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <h5 className="fw-semibold mb-1">Currency Settings</h5>
                        <p>Provide the currency information below</p>
                      </div>
                      <div className="border-bottom mb-3">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Currency</h6>
                              <p>Select currency</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={country}
                                className="select"
                                placeholder="Select Country"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Currency Symbol</h6>
                              <p>Select currency symbol</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={symbols}
                                className="select"
                                placeholder="Select Country"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Currency Position</h6>
                              <p>Select currency position</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={symbolsandvalue}
                                className="select"
                                placeholder="Select Country"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Decimal Seperator</h6>
                              <p>Select decimal seperator</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={dot}
                                className="select"
                                placeholder="."
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Thousand Seperator</h6>
                              <p>Select thousand seperator</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={comma}
                                className="select"
                                placeholder=","
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <h5 className="fw-semibold mb-1">Country Settings</h5>
                        <p>Provide the country information below</p>
                      </div>
                      <div className="border-bottom mb-3">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Countries Restriction</h6>
                              <p>Select restricted countries</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <Select
                                options={permissionforcountry}
                                className="select"
                                placeholder="Allow All Country"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <h5 className="fw-semibold mb-1">File Settings</h5>
                        <p>Provide the files information below</p>
                      </div>
                      <div className="border-bottom mb-3 border-0 mb-0">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Allowed Files</h6>
                              <p>Select allowed files</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <input
                                className="input-tags form-control"
                                type="text"
                                data-role="tagsinput"
                                name="Label"
                                defaultValue="JPG, PNG, GIF"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <div className="mb-3">
                              <h6>Max File Size</h6>
                              <p>Select size of the files</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="5000MB"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Link to="#" className="btn btn-light me-2">
                          Cancel
                        </Link>
                        <button type="button" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* /Prefixes */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Localization;
