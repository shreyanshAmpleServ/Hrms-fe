import { Button } from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ComponentSelect from "../../../../components/common/ComponentSelect";
import Table from "../../../../components/common/dataTableNew";
import {
  addTaxSlab,
  fetchTaxSlabById,
  updateTaxSlab,
} from "../../../../redux/taxSlab";
import DeleteAlert from "../alert/DeleteAlert";

const initialRow = {
  rule_type: "",
  slab_min: "",
  slab_max: "",
  rate: "",
  flat_amount: "",
  effective_from: moment().toISOString().split("T")[0],
  effective_to: moment().toISOString().split("T")[0],
  pay_component_id: "",
  currency_id: "",
  amount: "",
};

const AddEditModal = ({
  mode = "add",
  selected = null,
  setSelected,
  setMode,
}) => {
  const [childTaxSlabs, setChildTaxSlabs] = useState([initialRow]);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const dispatch = useDispatch();

  const { taxSlabDetail, loading } = useSelector((state) => state.taxSlab);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm();

  const statusList = useMemo(
    () => [
      { value: "Y", label: "Active" },
      { value: "N", label: "Inactive" },
    ],
    []
  );

  // Fetch tax slab detail for edit
  useEffect(() => {
    if (mode === "edit" && selected?.id) {
      dispatch(fetchTaxSlabById(selected.id));
    }
  }, [mode, selected?.id, dispatch]);

  // Populate form fields and tax slabs on selected or taxSlab change
  useEffect(() => {
    reset({
      code: selected?.code || "",
      name: selected?.name || "",
      pay_component_id: selected?.pay_component_id || "",
      formula_text: selected?.formula_text || "",
      is_active: selected?.is_active || "Y",
    });
    if (mode === "edit" && taxSlabDetail) {
      setChildTaxSlabs(
        taxSlabDetail.hrms_m_tax_slab_rule1.map((item) => ({
          ...item,
          effective_from: moment(item.effective_from).format("YYYY-MM-DD"),
          effective_to: moment(item.effective_to).format("YYYY-MM-DD"),
        }))
      );
    } else {
      setChildTaxSlabs([initialRow]);
    }
  }, [selected, reset, taxSlabDetail, mode]);

  const handleModalClose = useCallback(() => {
    reset();
    setMode("");
    setSelected?.(null);
    setChildTaxSlabs([initialRow]);
  }, [reset, setMode, setSelected]);

  const handleAddRow = useCallback(() => {
    setChildTaxSlabs((prev) => [...prev, { ...initialRow }]);
  }, []);

  const handleDeleteRow = useCallback(() => {
    setChildTaxSlabs((prev) =>
      prev.filter((_, idx) => idx !== showDeleteModal)
    );
    setShowDeleteModal(null);
    toast.success("Pay Component deleted successfully");
  }, [showDeleteModal]);

  const onDeleteClick = useCallback((idx) => {
    setShowDeleteModal(idx);
  }, []);

  const handleRowChange = useCallback((index, field, value) => {
    setChildTaxSlabs((prev) => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
  }, []);

  const columns = [
    {
      title: "Rule Type",
      dataIndex: "rule_type",
      render: (text, record, index) => (
        <input
          className="form-control form-control-sm"
          style={{ minWidth: "200px" }}
          value={record.rule_type}
          onChange={(e) => handleRowChange(index, "rule_type", e.target.value)}
          placeholder="Rule Type"
        />
      ),
    },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      render: (text, record, index) => (
        <div style={{ minWidth: "100px" }}>
          <input
            type="date"
            value={record.effective_from}
            className="form-control form-control-sm text-uppercase"
            onChange={(date) =>
              handleRowChange(
                index,
                "effective_from",
                date ? date.target.value : ""
              )
            }
          />
        </div>
      ),
    },
    {
      title: "Salary From",
      dataIndex: "slab_min",
      render: (text, record, index) => (
        <input
          className="form-control form-control-sm"
          style={{ minWidth: "150px" }}
          type="number"
          value={record.slab_min}
          onChange={(e) => handleRowChange(index, "slab_min", e.target.value)}
          placeholder="Salary From"
        />
      ),
    },
    {
      title: "Salary To",
      dataIndex: "slab_max",
      render: (text, record, index) => (
        <input
          className="form-control form-control-sm"
          style={{ minWidth: "150px" }}
          type="number"
          value={record.slab_max}
          onChange={(e) => handleRowChange(index, "slab_max", e.target.value)}
          placeholder="Salary To"
        />
      ),
    },
    {
      title: "Tax Percent",
      dataIndex: "rate",
      render: (text, record, index) => (
        <input
          className="form-control form-control-sm"
          style={{ minWidth: "100px" }}
          type="number"
          value={record.rate}
          onChange={(e) => {
            if (e.target.value > 100) {
              toast.error("Tax Percent cannot be greater than 100");
            } else {
              handleRowChange(index, "rate", e.target.value);
            }
          }}
          placeholder="Tax Percent"
        />
      ),
    },
    {
      title: "Flat Amount",
      dataIndex: "flat_amount",
      render: (text, record, index) => (
        <input
          className="form-control form-control-sm"
          style={{ minWidth: "150px" }}
          type="number"
          value={record.flat_amount}
          onChange={(e) =>
            handleRowChange(index, "flat_amount", e.target.value)
          }
          placeholder="Flat Amount"
        />
      ),
    },
    // {
    //   title: "Effective From",
    //   dataIndex: "effective_from",
    //   render: (text, record, index) => (
    //     <div style={{ minWidth: "100px" }}>
    //       <DatePicker
    //         value={record.effective_from ? moment(record.effective_from) : null}
    //         className="form-control form-control-sm"
    //         onChange={(date) =>
    //           handleRowChange(
    //             index,
    //             "effective_from",
    //             date ? date.toISOString() : ""
    //           )
    //         }
    //         format="DD-MM-YYYY"
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   title: "Effective To",
    //   dataIndex: "effective_to",
    //   render: (text, record, index) => (
    //     <div style={{ minWidth: "100px" }}>
    //       <DatePicker
    //         value={record.effective_to ? moment(record.effective_to) : null}
    //         className="form-control form-control-sm"
    //         onChange={(date) =>
    //           handleRowChange(
    //             index,
    //             "effective_to",
    //             date ? date.toISOString() : ""
    //           )
    //         }
    //         format="DD-MM-YYYY"
    //       />
    //     </div>
    //   ),
    // },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, __, index) => (
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => onDeleteClick(index)}
        >
          Delete
        </button>
      ),
    },
  ];

  const onSubmit = useCallback(
    async (data) => {
      if (childTaxSlabs.length === 0) {
        toast.error("Please add at least one pay component");
        return;
      }
      const closeBtn = document.getElementById("close_btn_add");
      try {
        const submitData = {
          ...data,
          childTaxSlabs: childTaxSlabs,
        };
        let result;
        if (!selected) {
          result = await dispatch(addTaxSlab(submitData));
        } else {
          result = await dispatch(
            updateTaxSlab({
              id: selected.id,
              taxSlabData: submitData,
            })
          );
        }
        if (result?.meta?.requestStatus === "fulfilled") {
          closeBtn?.click();
          handleModalClose();
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [childTaxSlabs, dispatch, selected, handleModalClose]
  );

  useEffect(() => {
    const el = document.getElementById("offcanvas_add");
    if (!el) return;
    el.addEventListener("hidden.bs.offcanvas", handleModalClose);
    return () =>
      el.removeEventListener("hidden.bs.offcanvas", handleModalClose);
  }, [handleModalClose]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      id="offcanvas_add"
      tabIndex={-1}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">
          {mode === "add" ? "Add" : "Edit"} Tax Slab
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_btn_add"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required!" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                  />
                )}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Code <span className="text-danger">*</span>
              </label>
              <Controller
                name="code"
                control={control}
                rules={{ required: "Code is required!" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Code"
                  />
                )}
              />
              {errors.code && (
                <div className="invalid-feedback d-block">
                  {errors.code.message}
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Component <span className="text-danger">*</span>
              </label>
              <Controller
                name="pay_component_id"
                control={control}
                rules={{ required: "Component is required!" }}
                render={({ field }) => (
                  <ComponentSelect
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              {errors.pay_component_id && (
                <div className="invalid-feedback d-block">
                  {errors.pay_component_id.message}
                </div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Status <span className="text-danger">*</span>
              </label>
              <Controller
                name="is_active"
                control={control}
                rules={{ required: "Status is required!" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusList}
                    placeholder="Choose Status"
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={
                      statusList.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                  />
                )}
              />
              {errors.is_active && (
                <div className="invalid-feedback d-block">
                  {errors.is_active.message}
                </div>
              )}
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Tax Formula</label>
              <Controller
                name="formula_text"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control"
                    placeholder="Enter Tax Formula"
                    rows={3}
                  />
                )}
              />
            </div>
          </div>

          <div className="col-12 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddRow}
                icon={<i className="ti ti-square-rounded-plus me-1" />}
              >
                New Row
              </Button>
            </div>
            <div className="table-responsive custom-table">
              <Table
                dataSource={childTaxSlabs}
                columns={columns}
                loading={loading}
                className="table-bordered"
                pagination={false}
                scroll={{ x: "max-content" }}
                rowKey={(_, index) => index}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light"
              onClick={handleModalClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {mode === "add" ? "Create" : "Update"}
              {loading && (
                <div
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <DeleteAlert
        showModal={showDeleteModal !== null}
        setShowModal={setShowDeleteModal}
        onDelete={handleDeleteRow}
        label="Tax Slab"
      />

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        .custom-table .ant-table-cell { padding: 8px 12px !important; }
        .custom-table .ant-table-thead > tr > th { background-color: #f8f9fa; font-weight: 600; }
        .react-select__control { min-height: 38px; border-color: #ced4da; }
        .react-select__control:hover { border-color: #86b7fe; }
        .react-select__control--is-focused {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AddEditModal;
