import { Spin, Table } from "antd";
import React from "react";
import UnauthorizedImage from "../UnAuthorized.js/index.js";

const Datatable = ({
  columns,
  dataSource,
  className,
  border,
  paginationData,
  onPageChange,
  loading = false,
  isView = true,
  style,
}) => {
  const handlePageChange = (page, size) => {
    if (onPageChange) {
      onPageChange({ currentPage: page, pageSize: size });
    }
  };
  return (
    <>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin tip="Loading data..." size="large" />
        </div>
      ) : isView ? (
        <Table
          className={`table datanew dataTable no-footer  ${className}`}
          columns={columns}
          dataSource={dataSource}
          cellPaddingInlineSM
          pagination={
            paginationData?.totalCount > 0
              ? {
                  current: paginationData?.currentPage || 1,
                  pageSize: paginationData?.pageSize || 10,
                  total: paginationData?.totalCount || 1,
                  showSizeChanger: true,
                  onChange: handlePageChange,
                }
              : false
          }
          bordered={border || false}
          style={style}
        />
      ) : (
        <UnauthorizedImage />
      )}
    </>
  );
};

export default Datatable;
