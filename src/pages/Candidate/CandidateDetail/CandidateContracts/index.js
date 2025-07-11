import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../../../components/common/dataTableNew/index";
import usePermissions from "../../../../components/common/Permissions.js";
import {
  deleteContract,
  fetchContracts,
} from "../../../../redux/EmployementContracts";
import DeleteAlert from "../../../EmploymentContracts/DeleteConfirmation";
import AddEditModal from "../../../EmploymentContracts/ManageContracts";

const CandidateContracts = ({ candidateDetail }) => {
  const [contract, setContract] = React.useState(null);
  const [mode, setMode] = React.useState("add");
  const { isView, isCreate, isUpdate, isDelete } = usePermissions(
    "Employment Contracts"
  );

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Candidate",
      dataIndex: "contracted_candidate",
      render: (text) => text?.full_name || "-",
      sorter: (a, b) =>
        a?.contracted_candidate?.full_name?.localeCompare(
          b?.contracted_candidate?.full_name
        ),
    },
    {
      title: "Type",
      dataIndex: "contract_type",
      render: (text) =>
        text
          ? text
              .replaceAll("_", " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())
          : "-",
      sorter: (a, b) => a.contract_type.localeCompare(b.contract_type),
    },
    {
      title: "Start Date",
      dataIndex: "contract_start_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        moment(a.contract_start_date).unix() -
        moment(b.contract_start_date).unix(),
    },
    {
      title: "End Date",
      dataIndex: "contract_end_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : ""),
      sorter: (a, b) =>
        moment(a.contract_end_date).unix() - moment(b.contract_end_date).unix(),
    },
    {
      title: "Document",
      dataIndex: "document_path",
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            <i className="ti ti-file-type-pdf" /> View
          </a>
        ) : (
          "-"
        ),
    },
    ...(isDelete || isUpdate
      ? [
          {
            title: "Action",
            render: (text, a) => (
              <div className="dropdown table-action">
                <Link
                  to="#"
                  className="action-icon "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  {isUpdate && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => setContract(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setContract(a)}
                    >
                      <i className="ti ti-trash text-danger" /> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const { contracts, loading } = useSelector((state) => state.contracts);

  React.useEffect(() => {
    dispatch(fetchContracts({ candidate_id: candidateDetail?.id }));
  }, [candidateDetail?.id]);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (contract) {
      dispatch(deleteContract(contract.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-4 d-flex justify-content-between align-items-center">
          <h4 className="card-title">Contracts</h4>
          {isCreate && (
            <Link
              to=""
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add"
              onClick={() => {
                setMode("add with candidate");
              }}
            >
              <i className="ti ti-square-rounded-plus me-2" />
              Add Contract
            </Link>
          )}
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            <Table
              dataSource={contracts?.data || []}
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
        contract={contract}
        setContract={setContract}
        candidate_id={candidateDetail?.id}
      />
      <DeleteAlert
        label="Contracts"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </>
  );
};

export default CandidateContracts;
