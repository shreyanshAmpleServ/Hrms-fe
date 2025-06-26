import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTableNew/index";
import DeleteAlert from "../../../OfferLetters/alert/DeleteAlert";
import AddEditModal from "../../../OfferLetters/modal/AddEditModal";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import {
  deleteoffer_letter,
  fetchoffer_letter,
} from "../../../../redux/offerLetters";
import ManageStatus from "../../../OfferLetters/ManageStatus";

const CandidateOfferLetters = ({ candidateDetail }) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add");
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Offer Letter"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Candidate",
      dataIndex: "offered_candidate",
      render: (value) => <div>{value?.full_name}</div>,
    },
    {
      title: "Offer Date",
      dataIndex: "offer_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
    },

    {
      title: "Position",
      dataIndex: "position",
    },

    {
      title: "Offered Salary",
      dataIndex: "offered_salary",
      render: (value) => <div>{Number(value).toLocaleString()}</div>,
    },

    {
      title: "Valid Until",
      dataIndex: "valid_until",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "R"
              ? "bg-danger"
              : value === "A"
                ? "bg-success"
                : value === "P"
                  ? "bg-warning"
                  : "bg-secondary"
          }`}
        >
          {value === "P" ? "Pending" : value === "A" ? "Approved" : "Rejected"}
        </div>
      ),
    },

    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
              <div className="dropdown table-action">
                <Link
                  to="#"
                  className="action-icon"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      onClick={() => {
                        setSelected(record);
                        setOpen(true);
                      }}
                    >
                      <i className="ti ti-settings text-blue"></i>
                      {record.status === "P"
                        ? "Approve"
                        : record.status === "R"
                          ? "Reject"
                          : record.status === "A"
                            ? "Reject/Pending"
                            : "Manage Status"}
                    </Link>
                  )}
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#add_edit_offer_letter_modal"
                      onClick={() => {
                        setSelected(record);
                        setMode("edit");
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteIndustry(record)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const { offer_letter, loading } = useSelector((state) => state.offer_letter);

  React.useEffect(() => {
    if (candidateDetail?.id) {
      dispatch(fetchoffer_letter({ candidate_id: candidateDetail?.id }));
    }
  }, [candidateDetail?.id]);

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const [selectedIndustry, setSelectedIndustry] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deleteoffer_letter(selectedIndustry.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-4 d-flex justify-content-between align-items-center">
          <h4 className="card-title">Offer Letters</h4>
          <Link
            to=""
            className="btn btn-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#add_edit_offer_letter_modal"
            onClick={() => {
              setMode("add with candidate");
            }}
          >
            <i className="ti ti-square-rounded-plus me-2" />
            Add Offer Letter
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            <Table
              dataSource={offer_letter?.data || []}
              columns={columns}
              loading={loading}
              isView={isView}
              paginationData={false}
            />
          </div>
        </div>
      </div>

      <AddEditModal
        mode={mode}
        initialData={selected}
        candidate_id={candidateDetail?.id}
      />
      <DeleteAlert
        label="Offer Letters"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default CandidateOfferLetters;
