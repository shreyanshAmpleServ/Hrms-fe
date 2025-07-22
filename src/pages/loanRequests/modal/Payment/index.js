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

  useEffect(() => {
    reset({
      employee_code: employee?.employee_code || "",
      full_name: employee?.full_name || "",
      credit_account: employee?.account_number || "",
      start_date: loanRequest?.start_date || new Date().toISOString(),
      end_date: new Date().toISOString(),
      loanStatus: {
        value: status,
        label:
          status === "P"
            ? "Pending"
            : status === "A"
              ? "Approved"
              : status === "R"
                ? "Rejected"
                : status === "C"
                  ? "Closed"
                  : "Pending",
      },
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

  // Function to redistribute remaining amount across unpaid EMIs
  const redistributeRemainingAmount = (paymentAmount) => {
    const updatedSchedule = [...emiSchedule];
    let remainingAmount = unpaidAmount - paymentAmount;

    // Get unpaid EMIs
    const unpaidEmis = updatedSchedule.filter((emi) => emi.status === "U");

    if (unpaidEmis.length === 0 || remainingAmount <= 0) {
      return updatedSchedule;
    }

    // Calculate new EMI amount per unpaid installment
    const newEmiAmount = Math.round(remainingAmount / unpaidEmis.length);
    const remainder = remainingAmount - newEmiAmount * unpaidEmis.length;

    // Update unpaid EMIs with new amounts
    let remainderDistributed = 0;
    updatedSchedule.forEach((emi, index) => {
      if (emi.status === "U") {
        let adjustedAmount = newEmiAmount;

        // Distribute remainder to first few EMIs
        if (remainderDistributed < remainder) {
          adjustedAmount += 1;
          remainderDistributed += 1;
        }

        updatedSchedule[index] = {
          ...emi,
          emi_amount: adjustedAmount,
        };
      }
    });

    return updatedSchedule;
  };

  // Function to mark EMIs as paid based on payment amount
  const markEmiAsPaid = (paymentAmount) => {
    const updatedSchedule = [...emiSchedule];
    let remainingPayment = paymentAmount;

    // Sort unpaid EMIs by due date (assuming they are already sorted)
    for (let i = 0; i < updatedSchedule.length && remainingPayment > 0; i++) {
      if (updatedSchedule[i].status === "U") {
        const emiAmount = updatedSchedule[i].emi_amount;

        if (remainingPayment >= emiAmount) {
          // Mark this EMI as paid
          updatedSchedule[i] = {
            ...updatedSchedule[i],
            status: "P",
          };
          remainingPayment -= emiAmount;
        } else {
          // Partial payment - adjust this EMI amount
          updatedSchedule[i] = {
            ...updatedSchedule[i],
            emi_amount: emiAmount - remainingPayment,
          };
          remainingPayment = 0;
        }
      }
    }

    // If there's still remaining payment, redistribute among unpaid EMIs
    if (remainingPayment > 0) {
      return redistributeRemainingAmount(paymentAmount - remainingPayment);
    }

    return updatedSchedule;
  };

  const onSubmit = async (data) => {
    // Update EMI schedule based on payment
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
                emi_amount: newEmiAmount,
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

  // Handle amount change with EMI preview
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

  // Calculate remaining amount after payment for display
  const remainingAfterPayment = unpaidAmount - amount;
  const unpaidEmisCount = emiSchedule.filter(
    (emi) => emi.status === "U"
  ).length;
  const newEmiAmount =
    unpaidEmisCount > 0
      ? Math.round(remainingAfterPayment / unpaidEmisCount)
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
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : ""),
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
      width: "22%",
    },
    {
      title: "Starting Balance",
      dataIndex: "balance_amount",
      width: "22%",
    },
    {
      title: "Payment Amount",
      dataIndex: "amount",
      width: "22%",
    },
    {
      title: "Ending Balance",
      dataIndex: "pending_amount",
      width: "22%",
    },
  ];

  console.log("emiSchedule", emiSchedule);

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

                      <div className="row mb-2">
                        <label className="col-sm-4 col-form-label small">
                          Loan Status:
                        </label>
                        <div className="col-sm-6">
                          <Controller
                            name="loanStatus"
                            control={control}
                            rules={{ required: "Loan status is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                options={loanStatusOptions}
                                styles={selectStyles}
                                placeholder="Select status..."
                                isSearchable={false}
                                isDisabled
                                classNamePrefix="react-select"
                                className={
                                  errors.loanStatus ? "is-invalid" : ""
                                }
                              />
                            )}
                          />
                          {errors.loanStatus && (
                            <div className="invalid-feedback d-block">
                              {errors.loanStatus.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      {amount > 0 && (
                        <div className="row mb-2 p-0">
                          <div className="col-10 p-0">
                            <div className="alert alert-info py-0 py-2">
                              <small>
                                <strong>Payment Summary:</strong>
                                <br />
                                Payment: {amount} | Remaining:{" "}
                                {remainingAfterPayment}
                                <br />
                                {unpaidEmisCount > 0 &&
                                  remainingAfterPayment > 0 && (
                                    <>
                                      New EMI Amount: {newEmiAmount} for{" "}
                                      {unpaidEmisCount} months
                                    </>
                                  )}
                              </small>
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
