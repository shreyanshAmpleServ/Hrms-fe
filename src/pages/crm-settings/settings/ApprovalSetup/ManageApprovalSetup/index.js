import React, { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import SharedSelect from "../../../../../components/common/SharedSelect";
import {
  fetchApprovalSetup,
  fetchApprovalSetupByRequestType,
  updateApprovalSetup,
} from "../../../../../redux/ApprovalSetup";
import { employeeOptionsFn } from "../../../../../redux/Employee";
import logger from "../../../../../utils/logger";

export const requestTypeOptions = [
  { label: "Leave Request", value: "leave_request" },
  { label: "Loan Request", value: "loan_request" },
  { label: "Advance Request", value: "advance_request" },
  { label: "Asset Request", value: "asset_request" },
  { label: "Probation Review", value: "probation_review" },
  { label: "Appraisal Review", value: "appraisal_review" },
];

const statusOptions = [
  { label: "Active", value: "Y" },
  { label: "Inactive", value: "N" },
];

const ManageApprovalSetup = ({ setApprovalSetup, approvalSetup }) => {
  const [approvalSetupList, setApprovalSetupList] = React.useState([]);
  const [availableEmployees, setAvailableEmployees] = React.useState([]);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { loading, approvalSetupByRequestType } = useSelector(
    (state) => state.approvalSetup
  );
  const { employeeOptions } = useSelector((state) => state.employee || {});

  logger.info(approvalSetupByRequestType);

  useEffect(() => {
    dispatch(employeeOptionsFn());
  }, []);

  // Update available employees when employeeOptions or approvalSetupList changes
  useEffect(() => {
    if (employeeOptions) {
      const selectedEmployeeIds =
        approvalSetupList?.map((item) => item?.approver_id) || [];
      const available = employeeOptions
        .filter((option) => !selectedEmployeeIds.includes(option?.value))
        .map((option) => ({
          approver_id: option.value,
          name: option.label,
          profile_pic: option.meta?.profile_pic || "",
          employee_code: option.employee_code || "",
          department: option.meta?.department || "",
        }));
      setAvailableEmployees(available);
    }
  }, [employeeOptions, approvalSetupList]);

  useEffect(() => {
    setApprovalSetupList(
      approvalSetupByRequestType?.map((item) => ({
        ...item,
        name:
          `${item?.approval_work_approver?.full_name} (${item?.approval_work_approver?.employee_code})` ||
          "",
        profile_pic: item?.approval_work_approver?.profile_pic || "",
        department:
          item?.approval_work_approver?.hrms_employee_department
            ?.department_name || "",
      }))
    );
    setValue("no_of_approvers", approvalSetupByRequestType?.length || 1);
  }, [approvalSetupByRequestType]);

  useEffect(() => {
    if (watch("request_type")) {
      dispatch(fetchApprovalSetupByRequestType(watch("request_type")));
    } else if (approvalSetup?.request_type) {
      dispatch(fetchApprovalSetupByRequestType(approvalSetup?.request_type));
    }
  }, [approvalSetup?.request_type, watch("request_type")]);

  React.useEffect(() => {
    if (approvalSetup) {
      reset({
        request_type: approvalSetup?.request_type || "",
        no_of_approvers: approvalSetup?.no_of_approvers || 1,
        is_active: approvalSetup?.is_active || "Y",
      });
      setApprovalSetupList(
        approvalSetup?.request_approval_request?.map((item) => ({
          ...item,
          name:
            `${item?.approval_work_approver?.name} (${item?.approval_work_approver?.employee_code})` ||
            "",
          profile_pic: item?.approval_work_approver?.profile_pic || "",
          department:
            item?.approval_work_approver?.hrms_employee_department
              ?.department_name || "",
        })) || []
      );
    } else {
      reset({
        request_type: "",
        no_of_approvers: 1,
        is_active: "Y",
      });
      setApprovalSetupList([]);
    }
  }, [approvalSetup, reset]);

  const watchedNoOfApprovers = watch("no_of_approvers");

  // Validate approval list count matches no_of_approvers
  React.useEffect(() => {
    const noOfApprovers = parseInt(watchedNoOfApprovers) || 0;
    const currentApproverCount = approvalSetupList?.length || 0;

    if (noOfApprovers > 0) {
      if (currentApproverCount < noOfApprovers) {
        setError("approval_list_validation", {
          type: "manual",
          message: `Please add ${noOfApprovers - currentApproverCount} more approver(s). Current: ${currentApproverCount}, Required: ${noOfApprovers}`,
        });
      } else if (currentApproverCount > noOfApprovers) {
        setError("approval_list_validation", {
          type: "manual",
          message: `Too many approvers! Please remove ${currentApproverCount - noOfApprovers} approver(s). Current: ${currentApproverCount}, Required: ${noOfApprovers}`,
        });
      } else {
        clearErrors("approval_list_validation");
      }
    } else {
      clearErrors("approval_list_validation");
    }
  }, [watchedNoOfApprovers, approvalSetupList?.length, setError, clearErrors]);

  // Handle drag end for both tables
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // Moving within the same droppable
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "approvers") {
        // Reordering within approval table
        const items = Array.from(approvalSetupList);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        // Update sequences based on new order
        const updatedItems = items.map((item, index) => ({
          ...item,
          sequence: index + 1,
        }));

        setApprovalSetupList(updatedItems);
      }
      // No reordering needed for available employees
      return;
    }

    // Moving between different droppables
    if (
      source.droppableId === "available-employees" &&
      destination.droppableId === "approvers"
    ) {
      // Moving from available to approvers
      const employee = availableEmployees[source.index];
      const newApprover = {
        approver_id: employee.approver_id,
        name: employee.name,
        profile_pic: employee.profile_pic,
        department: employee.department,
        sequence: approvalSetupList.length + 1,
      };

      // Add to approval list
      const newApprovalList = [...approvalSetupList];
      newApprovalList.splice(destination.index, 0, newApprover);

      // Update sequences
      const updatedApprovalList = newApprovalList.map((item, index) => ({
        ...item,
        sequence: index + 1,
      }));

      setApprovalSetupList(updatedApprovalList);
    } else if (
      source.droppableId === "approvers" &&
      destination.droppableId === "available-employees"
    ) {
      // Moving from approvers back to available
      const approver = approvalSetupList[source.index];

      // Remove from approval list
      const newApprovalList = approvalSetupList.filter(
        (_, index) => index !== source.index
      );

      // Update sequences
      const updatedApprovalList = newApprovalList.map((item, index) => ({
        ...item,
        sequence: index + 1,
      }));

      setApprovalSetupList(updatedApprovalList);
    }
  };

  // Remove approver from list
  const removeApprover = (approverId) => {
    const updatedList =
      approvalSetupList
        ?.filter((item) => item?.approver_id !== approverId)
        ?.map((item, index) => ({
          ...item,
          sequence: index + 1,
        })) || [];
    setApprovalSetupList(updatedList);
  };

  // Add employee to approvers
  const addEmployee = (employee) => {
    const newApprover = {
      approver_id: employee.approver_id,
      name: employee.name,
      profile_pic: employee.profile_pic,
      department: employee.department,
      sequence: approvalSetupList.length + 1,
    };
    setApprovalSetupList([...approvalSetupList, newApprover]);
  };

  const AvailableEmployeesTable = () => {
    return (
      <div className="col-md-6 position-relative">
        <div className="card mb-0 h-100">
          <div className="card-header">
            <h6 className="mb-0 d-flex align-items-center">
              Available Employees
              <span className="badge bg-secondary ms-2">
                {availableEmployees?.length || 0}
              </span>
            </h6>
            <small className="text-muted">
              Drag employees to add as approvers
            </small>
          </div>
          <div
            className="card-body p-0"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Droppable droppableId="available-employees">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`table-responsive ${snapshot.isDraggingOver ? "bg-light" : ""}`}
                  style={{ minHeight: "200px" }}
                >
                  <table className="table table-sm mb-0">
                    <thead
                      className="table-light sticky-top"
                      style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                    >
                      <tr>
                        <th style={{ width: "40px", paddingLeft: "12px" }}>
                          <i className="ti ti-grip-vertical" />
                        </th>
                        <th>Employee</th>
                        <th style={{ width: "80px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableEmployees?.map((employee, index) => (
                        <Draggable
                          key={employee?.approver_id}
                          draggableId={`available-${employee?.approver_id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={
                                snapshot.isDragging ? "table-active" : ""
                              }
                              style={{
                                ...provided.draggableProps.style,
                                ...(snapshot.isDragging && {
                                  display: "table",
                                  width: "30%",
                                  tableLayout: "fixed",
                                  backgroundColor: "#fff",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                  borderRadius: "4px",
                                  border: "1px solid #dee2e6",
                                  zIndex: 1000,
                                }),
                              }}
                            >
                              <td
                                {...provided.dragHandleProps}
                                className="text-center"
                                style={{
                                  cursor: "grab",
                                  width: "40px",
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                  }),
                                }}
                              >
                                <i className="ti ti-grip-vertical text-muted" />
                              </td>
                              <td
                                style={{
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    paddingLeft: "12px",
                                    paddingRight: "12px",
                                    whiteSpace: "nowrap",
                                  }),
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span className="avatar avatar-sm bg-primary avatar-rounded">
                                    {employee?.profile_pic ? (
                                      <img
                                        src={employee?.profile_pic}
                                        alt={employee?.name}
                                      />
                                    ) : (
                                      employee?.name
                                        ?.split(" ")
                                        .slice(0, 2)
                                        .map((word) =>
                                          word.charAt(0).toUpperCase()
                                        )
                                        .join("")
                                    )}
                                  </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      minWidth: 0,
                                      flex: 1,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {employee?.name || "Unknown Employee"}
                                    </span>
                                    <small
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "12px",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {employee?.department || "No Department"}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td
                                style={{
                                  width: "80px",
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }),
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => addEmployee(employee)}
                                  title="Add as approver"
                                >
                                  <i className="ti ti-plus" />
                                </button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {(availableEmployees?.length || 0) === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-4 text-muted"
                          >
                            {employeeOptions?.length > 0
                              ? "All employees have been added as approvers"
                              : "No employees available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    );
  };

  const ApprovalTable = () => {
    return (
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h6 className="mb-0 d-flex align-items-center">
              Approval Sequence
              <span className="badge bg-light text-primary ms-2">
                {approvalSetupList?.length || 0} Added
              </span>
            </h6>
            <small className="text-muted">
              Drag to reorder approval sequence
            </small>
          </div>
          <div
            className="card-body p-0"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Droppable droppableId="approvers">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`table-responsive ${snapshot.isDraggingOver ? "bg-light" : ""}`}
                  style={{ minHeight: "200px" }}
                >
                  <table className="table table-sm mb-0">
                    <thead
                      className="table-light sticky-top"
                      style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                    >
                      <tr>
                        <th style={{ width: "40px", paddingLeft: "12px" }}>
                          <i className="ti ti-grip-vertical" />
                        </th>
                        <th>Approver</th>
                        <th style={{ width: "80px" }}>Sequence</th>
                        <th style={{ width: "80px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvalSetupList?.map((item, index) => (
                        <Draggable
                          key={item?.approver_id}
                          draggableId={`approver-${item?.approver_id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={
                                snapshot.isDragging ? "table-active" : ""
                              }
                              style={{
                                ...provided.draggableProps.style,
                                ...(snapshot.isDragging && {
                                  display: "table",
                                  width: "30%",
                                  tableLayout: "fixed",
                                  backgroundColor: "#fff",
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                  borderRadius: "4px",
                                  border: "1px solid #dee2e6",
                                  zIndex: 1000,
                                }),
                              }}
                            >
                              <td
                                {...provided.dragHandleProps}
                                className="text-center"
                                style={{
                                  cursor: "grab",
                                  width: "40px",
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                  }),
                                }}
                              >
                                <i className="ti ti-grip-vertical text-muted" />
                              </td>
                              <td
                                style={{
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    paddingLeft: "12px",
                                    paddingRight: "12px",
                                    whiteSpace: "nowrap",
                                  }),
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span className="avatar avatar-sm bg-primary avatar-rounded">
                                    {item?.profile_pic ? (
                                      <img
                                        src={item?.profile_pic}
                                        alt={item?.name}
                                      />
                                    ) : (
                                      item?.name
                                        ?.split(" ")
                                        .slice(0, 2)
                                        .map((word) =>
                                          word.charAt(0).toUpperCase()
                                        )
                                        .join("")
                                    )}
                                  </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      minWidth: 0,
                                      flex: 1,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {item?.name || "Unknown Approver"}
                                    </span>
                                    <small
                                      style={{
                                        color: "#6c757d",
                                        fontSize: "12px",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {item?.department || "No Department"}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td
                                className="text-center"
                                style={{
                                  width: "80px",
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }),
                                }}
                              >
                                <span className="badge bg-primary">
                                  {item?.sequence || index + 1}
                                </span>
                              </td>
                              <td
                                style={{
                                  width: "80px",
                                  ...(snapshot.isDragging && {
                                    display: "table-cell",
                                    verticalAlign: "middle",
                                    textAlign: "center",
                                  }),
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    removeApprover(item?.approver_id)
                                  }
                                  title="Remove approver"
                                >
                                  <i className="ti ti-trash" />
                                </button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {(approvalSetupList?.length || 0) === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4 text-muted"
                          >
                            <div>
                              <i className="ti ti-arrow-left me-2"></i>
                              Drag employees from the left to add approvers
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    );
  };

  const handleClose = () => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    reset();
    setApprovalSetup(null);
    setApprovalSetupList([]);
    closeButton.click();
  };

  const onSubmit = async (data) => {
    try {
      const request =
        approvalSetupList?.map((item) => ({
          ...item,
          is_active: data?.is_active,
          request_type: data?.request_type,
        })) || [];

      await dispatch(updateApprovalSetup(request)).unwrap();
      handleClose();
      dispatch(fetchApprovalSetup());
    } catch (error) {
      logger.error("Error submitting approval setup:", error);
    }
  };

  useEffect(() => {
    const el = document.getElementById("offcanvas_add");
    if (el) {
      el.addEventListener("hidden.bs.offcanvas", handleClose);
      return () => {
        el.removeEventListener("hidden.bs.offcanvas", handleClose);
      };
    }
  }, [setApprovalSetup]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-larger"
        tabIndex={-1}
        id="offcanvas_add"
        style={{ width: "90%", maxWidth: "1200px" }}
      >
        <div className="offcanvas-header border-bottom">
          <h4>{approvalSetup ? "Manage " : "Manage"} Approval Setup</h4>
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
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <SharedSelect
                name="request_type"
                control={control}
                options={requestTypeOptions}
                label="Request Type"
                required
                rules={{ required: "Request Type is required" }}
                errors={errors}
                className="col-md-4"
                placeholder="Enter Request Type"
              />
              <div className="col-md-4">
                <label className="col-form-label">
                  No of Approvers <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="no_of_approvers"
                    control={control}
                    rules={{
                      required: "No of Approvers is required",
                      min: {
                        value: 1,
                        message: "At least 1 approver is required",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1"
                        className={`form-control ${errors.no_of_approvers ? "is-invalid" : ""}`}
                        placeholder="Enter No of Approvers"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {errors.no_of_approvers && (
                  <small className="text-danger">
                    {errors.no_of_approvers.message}
                  </small>
                )}
              </div>
              <SharedSelect
                name="is_active"
                control={control}
                options={statusOptions}
                label="Status"
                required
                rules={{ required: "Status is required" }}
                errors={errors}
                className="col-md-4"
                placeholder="Enter Status"
              />
            </div>

            {/* Dual Drag & Drop Tables */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="row">
                <AvailableEmployeesTable />
                <ApprovalTable />
              </div>
            </DragDropContext>

            {/* Validation Error Display */}
            {errors.approval_list_validation && (
              <div className="row my-2">
                <div className="col-12">
                  <div
                    className="alert alert-warning d-flex align-items-center"
                    role="alert"
                  >
                    <i className="ti ti-alert-triangle me-2"></i>
                    <div>
                      <strong>Validation Error:</strong>{" "}
                      {errors.approval_list_validation.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex align-items-center justify-content-end mt-4">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {approvalSetup
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                    ? "Creating..."
                    : "Create"}
                {loading && (
                  <div
                    style={{
                      height: "15px",
                      width: "15px",
                    }}
                    className="spinner-border ms-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageApprovalSetup;
