import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import Table from "../../../../components/common/dataTableNew/index";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addLoanCashPayement,
  fetchLoanRequest,
  fetchLoanRequestById,
  listLoanCashPayement,
  updateLoanRequest,
} from "../../../../redux/loanRequests";

const Payment = ({
  open,
  setOpen,
  unpaidAmount,
  emiSchedule,
  loanRequestDetail,
}) => {
  const dispatch = useDispatch();

  const { loanCashPayement, loanRequestDetailLoading } = useSelector(
    (state) => state.loan_requests
  );
  const payments = loanCashPayement?.data;

  useEffect(() => {
    if (open) {
      dispatch(
        listLoanCashPayement({ loan_request_id: loanRequestDetail?.id })
      );
    }
  }, [open]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const employee = loanRequestDetail?.loan_req_employee;
  const loanRequest = loanRequestDetail;
  const status = loanRequest?.status;
  const loanRequestId = loanRequest?.id;
  const totalPendingAmount = loanRequest?.total_pending_amount;
  const totalReceivedAmount = loanRequest?.total_received_amount;

  useEffect(() => {
    reset({
      employee_code: employee?.employee_code || "",
      full_name: employee?.full_name || "",
      credit_account: employee?.account_number || "",
      start_date: loanRequest?.start_date || new Date().toISOString(),
      end_date: new Date().toISOString(),
    });
  }, []);

  const [amount, setAmount] = useState(0);

  // Loan status options for React Select
  const loanStatusOptions = [
    { label: "Pending", value: "P" },
    { label: "Approved", value: "A" },
    { label: "Rejected", value: "R" },
    { label: "Closed", value: "C" },
  ];

  useEffect(() => {
    setAmount(unpaidAmount);
  }, [unpaidAmount]);

  const onSubmit = async (data) => {
    try {
      const addLoanCashPayementResponse = await dispatch(
        addLoanCashPayement({
          amount,
          pending_amount: unpaidAmount - amount,
          balance_amount: unpaidAmount,
          ...data,
          loan_request_id: loanRequestId,
        })
      );
      if (addLoanCashPayementResponse?.meta?.requestStatus === "fulfilled") {
        const updateLoanRequestResponse = await dispatch(
          updateLoanRequest({
            id: loanRequestId,
            loanRequestData: {
              ...loanRequestDetail,
              emi_schedule: emiSchedule?.map((emi) => ({
                ...emi,
                emi_amount: emi.status === "U" ? newEmiAmount : emi.emi_amount,
                status: amount === unpaidAmount ? "P" : emi.status,
              })),
            },
          })
        );

        if (updateLoanRequestResponse?.meta?.requestStatus === "fulfilled") {
          setOpen(false);
          await dispatch(fetchLoanRequestById(loanRequestId));
          await dispatch(fetchLoanRequest());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAmountChange = (newAmount) => {
    if (Number(newAmount) > unpaidAmount) {
      setAmount(unpaidAmount);
    } else {
      setAmount(newAmount);
    }
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "31px",
      height: "31px",
      fontSize: "14px",
      borderColor: state.isFocused ? "#80bdff" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
        : null,
      "&:hover": {
        borderColor: state.isFocused ? "#80bdff" : "#adb5bd",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "31px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "31px",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const remainingAfterPayment = unpaidAmount - amount;
  const unpaidEmisCount = emiSchedule.filter(
    (emi) => emi.status === "U"
  ).length;
  const newEmiAmount =
    unpaidEmisCount > 0
      ? Number((remainingAfterPayment / unpaidEmisCount).toFixed(2))
      : 0;

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (text, record, index) => <span>{index + 1}</span>,
      width: "100px",
    },
    {
      title: "Pay Date",
      dataIndex: "createdate",
      render: (text) => (text ? moment(text).calendar() : ""),
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
      width: "22%",
    },
    {
      title: "Starting Balance",
      dataIndex: "balance_amount",
      render: (value) => Number(value)?.toFixed(2) || "0.00",
      width: "22%",
    },
    {
      title: "Payment Amount",
      dataIndex: "amount",
      render: (value) => Number(value)?.toFixed(2) || "0.00",
      width: "22%",
    },
    {
      title: "Ending Balance",
      dataIndex: "pending_amount",
      render: (value) => Number(value)?.toFixed(2) || "0.00",
      width: "22%",
    },
  ];

  return (
    <>
      {open && (
        <div
          className="modal fade show modal-xl"
          id="payment_modal"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Employee Loan Manager</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpen(false)}
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div
                  className="modal-body p-3"
                  style={{ maxHeight: "70vh", overflow: "auto" }}
                >
                  {/* Employee Information Section */}
                  <div className="row mb-3 p-2">
                    <div className="col-md-6">
                      <div className="row mb-2">
                        <label className="col-sm-4 col-form-label small">
                          Employee Code:
                        </label>
                        <div className="col-sm-6">
                          <input
                            value={employee?.employee_code}
                            type="text"
                            className={`form-control form-control-sm`}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-sm-4 col-form-label small">
                          Employee Name:
                        </label>
                        <div className="col-sm-6">
                          <input
                            value={employee?.full_name}
                            type="text"
                            className={`form-control form-control-sm`}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row mb-2">
                        <label className="col-sm-4 col-form-label small">
                          Payment Amount:
                        </label>
                        <div className="col-sm-6">
                          <input
                            value={amount}
                            type="number"
                            className="form-control form-control-sm"
                            placeholder="Enter amount"
                            onChange={(e) => handleAmountChange(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="row mb-2">
                        <label className="col-sm-4 col-form-label small">
                          Start Date:
                        </label>
                        <div className="col-sm-6">
                          <Controller
                            name="start_date"
                            control={control}
                            rules={{ required: "Start date is required" }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                value={
                                  field.value
                                    ? moment(field.value).format("DD-MM-YYYY")
                                    : null
                                }
                                onChange={field.onChange}
                                className={`form-control form-control-sm ${
                                  errors.start_date ? "is-invalid" : ""
                                }`}
                                readOnly
                                placeholderText="DD-MM-YYYY"
                              />
                            )}
                          />
                          {errors.start_date && (
                            <div className="invalid-feedback d-block">
                              {errors.start_date.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      {amount > 0 && (
                        <div className="row p-0">
                          <div className="col-10 p-0">
                            <div className="alert alert-info">
                              <p>
                                <strong>Payment Summary:</strong>
                                <br />
                                Total Received Amount: {totalReceivedAmount} |
                                Total Pending Amount: {totalPendingAmount}
                                <br />
                                {unpaidEmisCount > 0 &&
                                  remainingAfterPayment > 0 && (
                                    <>
                                      New EMI Amount: {newEmiAmount} for{" "}
                                      {unpaidEmisCount} months
                                    </>
                                  )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EMI Schedule Table */}
                  <div className="row">
                    <div
                      className="card"
                      style={{ maxHeight: "300px", overflowY: "auto" }}
                    >
                      <Table
                        columns={columns}
                        dataSource={payments}
                        pagination={false}
                        loading={loanRequestDetailLoading}
                        size="small"
                        scroll={{ x: 1200, y: 300 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light btn-md"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success btn-md me-2"
                    disabled={amount <= 0}
                  >
                    Cash Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
