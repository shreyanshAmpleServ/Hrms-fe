import {
  FileExcelFilled,
  FileFilled,
  FileImageFilled,
  FilePdfFilled,
  FileWordFilled,
} from "@ant-design/icons";
import { Button, Dropdown, Table, Tooltip } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import usePermissions from "../../../../components/common/Permissions.js/index.js";
import UnauthorizedImage from "../../../../components/common/UnAuthorized.js";
import { fetchEmployeeAttachment } from "../../../../redux/EmployeeAttachment";
import DeleteConfirmation from "./DeleteConfirmation";
import ManageEmployeeAttachment from "./ManageEmployeeAttachment";

const EmployeeAttachment = () => {
  const { id } = useParams();
  const [selectedEmployeeAttachment, setSelectedEmployeeAttachment] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const dispatch = useDispatch();

  const { employeeAttachment, loading } = useSelector(
    (state) => state.employeeAttachment || {}
  );

  React.useEffect(() => {
    dispatch(fetchEmployeeAttachment({ employeeId: id }));
  }, [dispatch, id]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: employeeAttachment?.currentPage,
      totalPage: employeeAttachment?.totalPages,
      totalCount: employeeAttachment?.totalCount,
      pageSize: employeeAttachment?.size,
    });
  }, [employeeAttachment]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchEmployeeAttachment({
        page: currentPage,
        size: pageSize,
        employeeId: id,
      })
    );
  };

  const data = employeeAttachment?.data;

  const { isView, isUpdate, isDelete } = usePermissions("Employee Attachments");

  const getActionMenu = (record) => {
    const menuItems = [];

    if (isUpdate) {
      menuItems.push({
        key: "edit",
        label: (
          <Link
            to="#"
            data-bs-toggle="modal"
            data-bs-target="#update_attachment_modal"
            onClick={() => setSelectedEmployeeAttachment(record)}
          >
            <i className="ti ti-edit text-blue" /> Edit
          </Link>
        ),
      });
    }

    if (isDelete) {
      menuItems.push({
        key: "delete",
        label: (
          <Link to="#" onClick={() => handleDeleteEmployeeAttachment(record)}>
            <i className="ti ti-trash text-danger" /> Delete
          </Link>
        ),
      });
    }

    return menuItems;
  };

  const columns = [
    {
      title: "File",
      dataIndex: "document_path",
      render: (text) =>
        text ? (
          <a
            href={text}
            target="_blank"
            rel="noreferrer"
            className="d-flex align-items-center gap-2"
          >
            {text.split(".").pop()?.toLowerCase() === "pdf" ? (
              <Button className="rounded-circle bg-danger p-2">
                <FilePdfFilled />
              </Button>
            ) : text.split(".").pop()?.toLowerCase() === "jpg" ||
              text.split(".").pop()?.toLowerCase() === "jpeg" ||
              text.split(".").pop()?.toLowerCase() === "png" ? (
              <Button className="rounded-circle bg-primary p-2">
                <FileImageFilled />
              </Button>
            ) : text.split(".").pop()?.toLowerCase() === "doc" ||
              text.split(".").pop()?.toLowerCase() === "docx" ? (
              <Button className="rounded-circle bg-success p-2">
                <FileWordFilled />
              </Button>
            ) : text.split(".").pop()?.toLowerCase() === "xls" ||
              text.split(".").pop()?.toLowerCase() === "xlsx" ? (
              <Button className="rounded-circle bg-success p-2">
                <FileExcelFilled />
              </Button>
            ) : (
              <Button className="rounded-circle bg-primary p-2">
                <FileFilled />
              </Button>
            )}
            {text.split("/").pop().split("-").pop()}
          </a>
        ) : (
          <p className="text-danger">No Document</p>
        ),
    },
    {
      title: "Type",
      dataIndex: "document_type",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },
    ...(isDelete || isUpdate
      ? [
          {
            title: "Action",
            render: (text, record) => (
              <Dropdown
                menu={{ items: getActionMenu(record) }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  className="action-icon"
                  icon={<i className="fa fa-ellipsis-v"></i>}
                />
              </Dropdown>
            ),
          },
        ]
      : []),
  ];

  const handleDeleteEmployeeAttachment = (employeeAttachment) => {
    setSelectedEmployeeAttachment(employeeAttachment);
    setShowDeleteModal(true);
  };

  return (
    <div className="card-body">
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 row-gap-2">
        <h4>Attachments</h4>
        <Tooltip title="Add Attachment">
          <Button
            variant="filled"
            shape="circle"
            data-bs-toggle="modal"
            data-bs-target="#update_attachment_modal"
            icon={<i className="fa-solid fa-plus"></i>}
          />
        </Tooltip>
      </div>

      {isView ? (
        <div className="table-responsive custom-table">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            paginationData={paginationData}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <UnauthorizedImage />
      )}
      <ManageEmployeeAttachment
        setEmployeeAttachment={setSelectedEmployeeAttachment}
        employeeAttachment={selectedEmployeeAttachment}
      />

      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        employeeAttachmentId={selectedEmployeeAttachment?.id}
      />
    </div>
  );
};

export default EmployeeAttachment;
