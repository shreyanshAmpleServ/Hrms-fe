import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ManageAddress = ({ manageAddress, addNewColumn, setManageAddress }) => {
  const dispatch = useDispatch();



  const updateItem = (index, field, value) => {
    setManageAddress((prev) => {
      const updatedItems = [...prev];
      updatedItems[index][field] = value;
      return updatedItems;
    });
  };

  const deleteRow = (index) => {
    setManageAddress((prev) => prev.filter((_, i) => i !== index));
  };

  return (


    <div className="col-md-12 mt-3 address-section">
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <label className="col-form-label fw-bold">Address List</label>
        <div className="label-add text-danger" onClick={addNewColumn} style={{ cursor: "pointer" }}>
          <i className="ti ti-square-rounded-plus me-1" />
          Add New
        </div>
      </div>

      {manageAddress.map((item, index) => (
        <div key={index} className="border rounded position-relative bg-body-secondary p-3 mb-3">
          {manageAddress.length > 1 && (
            // <button
            //   onClick={() => deleteRow(index)}
            //   type="button"
            //   className="btn btn-danger btn-sm mb-3"
            // >
            //   <i className="ti ti-trash" style={{ fontSize: "15px" }} /> <Close />
            // </button>
            <div onClick={() => deleteRow(index)} className="position-absolute end-0 top-0 m-2 " >
              <IoMdCloseCircleOutline style={{ fontSize: "25px" }} className=" text-danger" />
            </div>
          )}

          <div className="row">
            {[
              "street",
              "street_no",
              "building",
              "floor",
              "city",
              "district",
              "state",
              "country",
              "zip_code",
            ].map((fieldKey) => (
              <div key={fieldKey} className="col-md-4 mb-2">
                <label className="form-label text-capitalize">{fieldKey.replace("_", " ")}</label>
                <input
                  className="form-control"
                  value={item[fieldKey]}
                  onChange={(e) => updateItem(index, fieldKey, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

  );
};

export default ManageAddress;
