import React from "react";

const UploadInput = ({ value, onChange }) => {
  return (
    <div>
      <div
        className="dropzone border rounded p-3 text-center"
        style={{
          cursor: "pointer",
          background: "#f8f9fa",
          border: "2px dashed #ced4da",
          transition: "border-color 0.2s",
        }}
        onClick={() => document.getElementById("attachment-file-input").click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.borderColor = "#007bff";
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.borderColor = "#ced4da";
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.style.borderColor = "#ced4da";
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onChange(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          id="attachment-file-input"
          type="file"
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files[0])}
        />
        <div>
          <i
            className="ti ti-upload"
            style={{ fontSize: 32, color: "#007bff" }}
          />
          <div className="mt-2">
            <span>
              Drag &amp; drop your file here, or{" "}
              <span
                className="text-primary"
                style={{ textDecoration: "underline" }}
              >
                browse
              </span>
            </span>
          </div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Supported: Images, PDF, Word, Excel
          </div>
        </div>
      </div>
      {value && value.name && (
        <div className="mt-2 text-success" style={{ fontSize: 14 }}>
          <i className="ti ti-file-description me-1" />
          {value.name}
        </div>
      )}
    </div>
  );
};

export default UploadInput;
