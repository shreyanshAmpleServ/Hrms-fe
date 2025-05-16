import React from "react";
import { Helmet } from "react-helmet-async";

function AddEmployee() {
    return (
        <div>
            <Helmet>
                <title>DCC CRMS - Employee</title>
                <meta name="campaign" content="This is campaign page of DCC CRMS." />
            </Helmet>

            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">

                            <div className="card">
                                <div className="card-body">
                                    <h4 className=" ">Employee</h4>

                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">

                                    <form>
                                        <div className="row">
                                            {/* Personal Details */}
                                            <div className="col-md-4">
                                                <div className="form-group  ">
                                                    <label className="fs-5">First Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control  fs-6" placeholder="Enter First Name" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Last Name</label>
                                                    <input type="text" className="form-control" placeholder="Enter Last Name" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Email <span className="text-danger">*</span></label>
                                                    <input type="email" className="form-control" placeholder="Enter Email" />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Marital Status <span className="text-danger">*</span></label>
                                                    <select className="form-control">
                                                        <option>Select Marital Status</option>
                                                        <option>Single</option>
                                                        <option>Married</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Dob <span className="text-danger">*</span></label>
                                                    <input type="date" className="form-control" defaultValue="2000-01-01" />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Mobile <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" placeholder="Enter Mobile Number" />
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Gender <span className="text-danger">*</span></label>
                                                    <select className="form-control">
                                                        <option>Select Gender</option>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label>Probation</label>
                                                    <div className="d-flex gap-3 align-items-center">
                                                        <label><input type="radio" name="probation" /> Yes</label>
                                                        <label><input type="radio" name="probation" /> No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-md-12">

                                        <div className="card">
                                            <form>
                                                <div className="card-body">
                                                    <ul className="nav nav-tabs mt-4">
                                                        <li className="nav-item"><a className="nav-link active" data-bs-toggle="tab" href="#other">Other Details</a></li>
                                                        <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#salary">Salary & Emp Benefits</a></li>

                                                        {/* Add other tab links here */}
                                                    </ul>

                                                    <div className="tab-content pt-3">
                                                        {/* Other Details Tab */}
                                                        <div className="tab-pane fade show active" id="other">
                                                            <p>Other employee details go here...</p>
                                                        </div>

                                                        {/* Salary Tab */}
                                                        <div className="tab-pane fade" id="salary">
                                                            <div className="row">
                                                                <div className="col-md-4">
                                                                    <label>Basic Salary (Monthly)<span className="text-danger">*</span></label>
                                                                    <input type="number" className="form-control" defaultValue="0" />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label>HRA</label>
                                                                    <input type="number" className="form-control" defaultValue="0" />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <label>Health & Medical Allowance</label>
                                                                    <input type="number" className="form-control" defaultValue="0" />
                                                                </div>
                                                                {/* More salary fields as per your screenshot */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Footer Buttons */}
                                                    <div className="text-end mt-4">
                                                        <button type="button" className="btn btn-light me-2">Cancel</button>
                                                        <button type="submit" className="btn btn-primary">Save</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    {/* Tabs Placeholder */}


                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}
        </div>
    );
}

export default AddEmployee;
