import PropTypes from "prop-types";
import { useMemo } from "react";
import CustomSelect from "../Select";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 20, 50],
  showRowsPerPage = true,
  showInfo = true,
}) {
  // Tính toán phạm vi hiển thị
  const pageRange = useMemo(() => {
    const delta = 2; // Số trang hiển thị mỗi bên
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Tính toán thông tin hiển thị
  const startRecord =
    totalRecords === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  const handleRowsPerPageChange = (newValue) => {
    onRowsPerPageChange?.(newValue);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 border-t">
      {/* Left: Rows per page */}
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Hiển thị</span>
          <CustomSelect
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            options={rowsPerPageOptions}
            position="top"
          />
          <span className="text-sm">mục/trang</span>
        </div>
      )}

      {/* Center: Page info */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Trang đầu"
        >
          <i className="pi pi-angle-double-left"></i>
        </button>

        {/* Previous page */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Trang trước"
        >
          <i className="pi pi-angle-left"></i>
        </button>

        {/* Page numbers */}
        {pageRange.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="px-3 py-1 text-sm">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next page */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Trang sau"
        >
          <i className="pi pi-angle-right"></i>
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Trang cuối"
        >
          <i className="pi pi-angle-double-right"></i>
        </button>
      </div>

      {/* Right: Page buttons */}
      {showInfo && (
        <div className="text-sm">
          Hiển thị <span className="font-medium">{startRecord}</span> đến{" "}
          <span className="font-medium">{endRecord}</span> trong tổng số{" "}
          <span className="font-medium">{totalRecords}</span> bản ghi
        </div>
      )}
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  showRowsPerPage: PropTypes.bool,
  showInfo: PropTypes.bool,
};
