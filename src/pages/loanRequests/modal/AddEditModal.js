import { Alert, Skeleton } from "antd";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Table from "../../../components/common/dataTableNew/index";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchCurrencies } from "../../../redux/currency";
import {
  addLoanRequest,
  fetchLoanRequest,
  fetchLoanRequestById,
  updateLoanEmiScheduleStatus,
  updateLoanRequest,
} from "../../../redux/loanRequests";
import { fetchloan_type } from "../../../redux/loneType";
import Payment from "./Payment";

/**
 * AddEditModal component props
 * @prop {"add" | "edit"} mode - Determines if the modal is in add or edit mode.
 * @prop {object|null} selected - The selected loan request object for editing, or null for adding.
 * @prop {function} setSelected - Function to update the selected loan request.
 */
const AddEditModal = ({ mode = "add", selected = null, setSelected }) => {
  const dispatch = useDispatch();
  const [openPayment, setOpenPayment] = React.useState(null);
  const { loading, loanRequestDetail } = useSelector(
    (state) => state.loan_requests
  );
  const [emiSchedule, setEmiSchedule] = React.useState([]);

  useEffect(() => {
    if (mode === "edit" && selected) {
      dispatch(fetchLoanRequestById(selected.id));
    }
  }, [mode, selected, dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const handleEmiStatus = async (id, status, emi_amount) => {
    try {
      const response = await dispatch(
        updateLoanEmiScheduleStatus({ id, status, emi_amount })
      );
      if (response?.meta?.requestStatus === "fulfilled") {
        await dispatch(fetchLoanRequestById(selected.id));
        await dispatch(fetchLoanRequest());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(fetchloan_type({ is_active: true }));
  }, [dispatch]);

  const isUpdate = Boolean(selected);

  const paidEMIs = useMemo(() => {
    return loanRequestDetail?.loan_emi_loan_request?.filter(
      (emi) => emi.status === "P"
    );
  }, [loanRequestDetail]);

  const paidEmiCount = paidEMIs?.length;

  const totalPendingAmount = loanRequestDetail?.total_pending_amount;

  const totalReceivedAmountWithEMI =
    loanRequestDetail?.total_received_amount_with_emi;

  useEffect(() => {
    const startDate = moment(watch("start_date"));
    const emi_months = Number(watch("emi_months"));
    const amount = Number(watch("amount"));

    if (watch("amount") || watch("emi_months")) {
      const mergedEmiSchedule = [];

      if (selected && loanRequestDetail?.loan_emi_loan_request) {
        const existingEmis = loanRequestDetail.loan_emi_loan_request;
        let totalPaidAmount = 0;
        let paidEmiCount = 0;

        existingEmis.forEach((emi) => {
          if (emi.status === "P") {
            totalPaidAmount += Number(emi.emi_amount);
            paidEmiCount++;
          }
        });

        const remainingAmount = Number(totalPendingAmount);
        const remainingMonths = emi_months - paidEmiCount;
        const emiPerMonth =
          remainingMonths > 0 ? remainingAmount / remainingMonths : 0;

        for (let i = 0; i < emi_months; i++) {
          const emiDate = moment(startDate).add(i + 1, "months");
          const existingEmi = existingEmis[i];

          mergedEmiSchedule.push({
            id: existingEmi?.id || "",
            due_month: emiDate.format("MMMM"),
            due_year: String(emiDate.year()),
            emi_amount:
              existingEmi?.status === "P"
                ? Number(existingEmi?.emi_amount)?.toFixed(2)
                : emiPerMonth.toFixed(2),
            status: existingEmi?.status || "U",
          });
        }
      } else {
        const emiPerMonth = emi_months > 0 ? amount / emi_months : 0;

        for (let i = 0; i < emi_months; i++) {
          const emiDate = moment(startDate).add(i + 1, "months");

          mergedEmiSchedule.push({
            id: "",
            due_month: emiDate.format("MMMM"),
            due_year: String(emiDate.year()),
            emi_amount: emiPerMonth.toFixed(2),
            status: "U",
          });
        }
      }
      setEmiSchedule(mergedEmiSchedule);
    } else {
      const emiSchedule = [];
      for (let i = 0; i < emi_months; i++) {
        const emiDate = moment(startDate).add(i + 1, "months");
        emiSchedule.push({
          id: "",
          due_month: emiDate.format("MMMM"),
          due_year: String(emiDate.year()),
          emi_amount: emi_months ? (amount / emi_months).toFixed(2) : "0",
          status: "U",
        });
      }
      setEmiSchedule(emiSchedule);
    }
  }, [
    watch("start_date"),
    watch("emi_months"),
    watch("amount"),
    loanRequestDetail,
  ]);

  const loan_type = useSelector((state) => state.loan_type?.loan_type);

  const LoanTypeList = useMemo(
    () =>
      loan_type?.data?.map((item) => ({
        value: item.id,
        label: item.loan_name,
      })) || [],
    [loan_type]
  );

  const { currencies } = useSelector((state) => state.currencies);

  React.useEffect(() => {
    dispatch(fetchCurrencies());
  }, []);

  const CurrencyList = useMemo(
    () =>
      currencies?.data?.map((item) => ({
        value: item.id,
        label: item.currency_name,
      })) || [],
    [currencies]
  );

  useEffect(() => {
    reset({
      employee_id: selected?.employee_id || "",
      loan_type_id: selected?.loan_type_id || "",
      amount: selected?.amount || 0,
      emi_months: selected?.emi_months || 1,
      currency: selected?.currency || "",
      status: selected?.status || "P",
      start_date: selected?.start_date || new Date().toISOString(),
    });
  }, [mode, selected, reset]);

  const handleClose = () => {
    setSelected(null);
    setEmiSchedule([]);
    reset();
  };

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    const loanRequestData = {
      ...data,
      start_date: data.start_date,
      amount: Number(data.amount),
      emi_months: Number(data.emi_months),
      emi_schedule: emiSchedule,
    };

    let response;
    if (mode === "add") {
      response = await dispatch(addLoanRequest(loanRequestData));
    } else if (mode === "edit" && selected) {
      response = await dispatch(
        updateLoanRequest({ id: selected.id, loanRequestData })
      );
    }
    if (response?.meta?.requestStatus === "fulfilled") {
      closeButton?.click();
      handleClose();
    }
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "due_month",
      render: (text) => <span>{text ? text : "0"} </span>,
    },
    {
      title: "Year",
      dataIndex: "due_year",
    },
    {
      title: "Amount",
      dataIndex: "emi_amount",
      render: (text) => <span>{text ? text : "0"} </span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span>
          {text === "P" ? (
            <span className="badge bg-success">Paid</span>
          ) : (
            <span className="badge bg-danger">Unpaid</span>
          )}{" "}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <span>
          <button
            type="primary"
            className="btn btn-primary btn-sm"
            onClick={() =>
              handleEmiStatus(
                record.id,
                record.status === "P" ? "U" : "P",
                record.emi_amount
              )
            }
          >
            {record.status === "P" ? "Mark as Unpaid" : "Mark as Paid"}
          </button>
        </span>
      ),
    },
  ];
  const unpaidAmount = emiSchedule
    ?.filter((item) => item.status === "U")
    ?.reduce((acc, item) => acc + Number(item.emi_amount), 0);

  useEffect(() => {
    const el = document.getElementById("add_edit_loan_requests_modal");
    if (el) {
      el.addEventListener("hidden.bs.offcanvas", handleClose);
      return () => {
        el.removeEventListener("hidden.bs.offcanvas", handleClose);
      };
    }
  }, [handleClose]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_loan_requests_modal"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {mode === "add" ? "Add" : "Update"} Loan Request
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={handleClose}
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="offcanvas-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Employee <span className="text-danger">*</span>
            </label>
            <Controller
              name="employee_id"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <EmployeeSelect
                  {...field}
                  onChange={(i) => field.onChange(i?.value)}
                  value={field.value}
                />
              )}
            />
            {errors.employee_id && (
              <small className="text-danger">
                {errors.employee_id.message}
              </small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Loan Type <span className="text-danger">*</span>
            </label>
            <Controller
              name="loan_type_id"
              control={control}
              rules={{ required: "Loan Type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: "", label: "-- Select --" },
                    ...LoanTypeList,
                  ]}
                  placeholder="-- Select --"
                  isDisabled={!LoanTypeList.length}
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value || "")}
                  value={LoanTypeList.find(
                    (option) => option.value === watch("loan_type_id")
                  )}
                />
              )}
            />
            {errors.loan_type_id && (
              <small className="text-danger">
                {errors.loan_type_id.message}
              </small>
            )}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Start Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={
                    field.value ? moment(field.value).format("DD-MM-YYYY") : ""
                  }
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  disabled={isUpdate}
                  className="form-control"
                  placeholderText="Select Start Date"
                />
              )}
            />
            {errors.start_date && (
              <small className="text-danger">{errors.start_date.message}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Currency <span className="text-danger">*</span>
            </label>
            <Controller
              name="currency"
              control={control}
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: "", label: "-- Select --" },
                    ...CurrencyList,
                  ]}
                  placeholder="-- Select --"
                  isDisabled={!CurrencyList.length}
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value || "")}
                  value={CurrencyList.find(
                    (option) => option.value === watch("currency")
                  )}
                />
              )}
            />
            {errors.currency && (
              <small className="text-danger">{errors.currency.message}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Amount <span className="text-danger">*</span>
            </label>
            <input
              disabled={isUpdate}
              type="number"
              placeholder="Enter Amount"
              className="form-control"
              {...register("amount", {
                required: "Amount is required",
                min: 1,
              })}
            />
            {errors.amount && (
              <small className="text-danger">{errors.amount.message}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              EMI Months <span className="text-danger">*</span>
            </label>
            <Controller
              name="emi_months"
              control={control}
              rules={{
                required: "EMI months is required",
                validate: (value) => {
                  if (value > 120) {
                    return "EMI months must be less than 120";
                  } else if (value < (isUpdate ? paidEmiCount + 1 : 1)) {
                    return isUpdate
                      ? `EMI months must be greater than ${paidEmiCount} (paid EMIs)`
                      : "EMI months must be greater than 1";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <input
                  type="number"
                  placeholder="Enter EMI Months"
                  className="form-control"
                  value={field.value}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 120) {
                      field.onChange(120);
                    } else {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
            {errors.emi_months && (
              <small className="text-danger">{errors.emi_months.message}</small>
            )}
          </div>

          {isUpdate && !loading && (
            <>
              <div className="col-md-6 mb-3">
                <Alert
                  message={
                    <div>
                      Total Amount Received:{" "}
                      <span className="font-weight-bold">
                        {totalReceivedAmountWithEMI?.toFixed(2)}
                      </span>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              </div>
              <div className="col-md-6 mb-3">
                <Alert
                  message={
                    <div>
                      Total Pending Amount:{" "}
                      <span className="font-weight-bold">
                        {totalPendingAmount?.toFixed(2)}
                      </span>
                    </div>
                  }
                  type="warning"
                  showIcon
                />
              </div>
            </>
          )}

          <div className="col-md-12 mb-3">
            {loading ? (
              <div className="d-flex justify-content-center">
                <div style={{ width: "100%" }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </div>
            ) : (
              <Table columns={columns} dataSource={emiSchedule} />
            )}
          </div>

          <div className="col-md-12 text-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
              onClick={handleClose}
            >
              Cancel
            </button>

            {mode !== "add" && (
              <button
                type="button"
                className="btn btn-success me-2"
                onClick={() => setOpenPayment(true)}
              >
                Pay Now
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? mode === "add"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add"
                  ? "Create"
                  : "Update"}
            </button>
          </div>
        </div>
      </form>
      <Payment
        open={openPayment}
        setOpen={setOpenPayment}
        unpaidAmount={unpaidAmount ? Number(unpaidAmount).toFixed(2) : "0.00"}
        emiSchedule={emiSchedule}
        loanRequestDetail={loanRequestDetail}
      />
    </div>
  );
};

export default AddEditModal;
