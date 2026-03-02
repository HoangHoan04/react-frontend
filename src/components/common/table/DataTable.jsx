import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import Pagination from "./Pagination";

export default function DataTable({
  data = [],
  columns = [],
  paginator = true,
  rows = 10,
  rowsPerPageOptions = [5, 10, 20, 50],
  sortable = true,
  emptyMessage = "Không có dữ liệu",
  hoverable = true,
  onRowClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rows);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(1); // 1: asc, -1: desc

  // Sắp xếp dữ liệu
  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string") {
        return sortOrder * aValue.localeCompare(bValue);
      }
      if (typeof aValue === "number") {
        return sortOrder * (aValue - bValue);
      }
      return 0;
    });
  }, [data, sortField, sortOrder]);

  // Phân trang dữ liệu
  const paginatedData = useMemo(() => {
    if (!paginator) return sortedData;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage, paginator]);

  // Tính tổng số trang
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Xử lý sắp xếp
  const handleSort = (field) => {
    if (!sortable) return;

    const column = columns.find((col) => col.field === field);
    if (column?.sortable === false) return;

    if (sortField === field) {
      setSortOrder(sortOrder * -1);
    } else {
      setSortField(field);
      setSortOrder(1);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý thay đổi số hàng/trang
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset về trang đầu
  };

  // Xử lý click vào hàng
  const handleRowClick = (rowData) => {
    onRowClick?.(rowData);
  };

  // Render cell content
  const renderCell = (column, rowData) => {
    if (column.body) {
      return column.body(rowData);
    }
    return rowData[column.field];
  };

  return (
    <div className="overflow-hidden rounded-lg border shadow-md ">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          {/* Header */}
          <thead>
            <tr>
              {columns.map((column) => {
                const isSortable = sortable && column.sortable !== false;
                const isSorted = sortField === column.field;

                return (
                  <th
                    key={column.field}
                    onClick={() => isSortable && handleSort(column.field)}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isSortable ? "cursor-pointer select-none" : ""
                    }`}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.header}</span>
                      {isSortable && (
                        <span className="flex flex-col">
                          <i
                            className={`pi pi-chevron-up text-[8px] -mb-1 ${
                              isSorted && sortOrder === 1 ? "text-blue-600" : ""
                            }`}
                          ></i>
                          <i
                            className={`pi pi-chevron-down text-[8px] ${
                              isSorted && sortOrder === -1
                                ? "text-blue-600"
                                : ""
                            }`}
                          ></i>
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <i className="pi pi-inbox text-4xl"></i>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((rowData, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => handleRowClick(rowData)}
                  className={`
                    ${hoverable ? "transition-colors" : ""}
                    ${onRowClick ? "cursor-pointer" : ""}
                  `}
                >
                  {columns.map((column) => (
                    <td key={column.field} className="px-6 py-4 text-sm">
                      {renderCell(column, rowData)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginator && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={data.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          showRowsPerPage={true}
          showInfo={true}
        />
      )}
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      header: PropTypes.string.isRequired,
      body: PropTypes.func,
      sortable: PropTypes.bool,
      width: PropTypes.string,
    }),
  ).isRequired,
  paginator: PropTypes.bool,
  rows: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sortable: PropTypes.bool,
  emptyMessage: PropTypes.string,
  hoverable: PropTypes.bool,
  onRowClick: PropTypes.func,
};
