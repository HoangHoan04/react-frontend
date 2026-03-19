import { useThemeStore } from "@/stores";
import DataTable from "../../../components/common/table/DataTable";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import CustomButton from "../../../components/common/button/Button";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import FloatLabelInput from "../../../components/common/input/FloatLabelInput";
import useProductManager from "./useProductManager";
import ProductViewModal from "./ProductViewModal";
import ProductEditModal from "./ProductEditModal";
import ProductDeleteModal from "./ProductDeleteModal";

const Product_manager = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const {
    products,
    activeSearchType, setActiveSearchType,
    searchForm, handleSearchFormChange, handleSearch, handleResetSearch,
    SEARCH_TYPES,
    selectedProduct, isViewModalVisible, openViewModal, closeViewModal,
    editProduct, isEditModalVisible, editForm, imageErrors,
    openEditModal, closeEditModal,
    handleEditFormChange, handleImageChange, handleAddImage, handleRemoveImage,
    setImageErrors, handleEditSubmit,
    deleteProduct, isDeleteModalVisible, openDeleteModal, closeDeleteModal, handleDeleteConfirm,
  } = useProductManager();

  // --- Style helpers -------------------------------------------------------
  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDark ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500" : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
  }`;
  const labelClass = `text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;
  const tabClass = (type) =>
    `px-3 py-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
      activeSearchType === type
        ? "bg-blue-500 text-white"
        : isDark
        ? "text-gray-400 hover:bg-gray-700"
        : "text-gray-500 hover:bg-gray-100"
    }`;

  // --- Search form render ---------------------------------------------------
  const renderSearchInputs = () => {
    switch (activeSearchType) {
      case "title":
        return (
          <div className="flex flex-col gap-1.5 max-w-md">
            <label className={labelClass}>Tên sản phẩm</label>
            <FloatLabelInput
              value={searchForm.title}
              onChange={handleSearchFormChange("title")}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        );

      case "price":
        return (
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className={labelClass}>Giá chính xác (USD)</label>
            <FloatLabelInput
              type="number"
              min="0"
              value={searchForm.price}
              onChange={handleSearchFormChange("price")}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        );

      case "priceRange":
        return (
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Giá từ (USD)</label>
              <FloatLabelInput
                type="number"
                min="0"
                value={searchForm.priceMin}
                onChange={handleSearchFormChange("priceMin")}
              />
            </div>
            <div className={`pb-2 text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              đến
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Giá đến (USD)</label>
              <FloatLabelInput
                type="number"
                min="0"
                value={searchForm.priceMax}
                onChange={handleSearchFormChange("priceMax")}
              />
            </div>
          </div>
        );

      case "categoryId":
        return (
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className={labelClass}>ID danh mục</label>
            <FloatLabelInput
              type="number"
              min="1"
              value={searchForm.categoryId}
              onChange={handleSearchFormChange("categoryId")}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        );

      case "categorySlug":
        return (
          <div className="flex flex-col gap-1.5 max-w-md">
            <label className={labelClass}>Slug danh mục</label>
            <FloatLabelInput
              value={searchForm.categorySlug}
              onChange={handleSearchFormChange("categorySlug")}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // --- Table columns -------------------------------------------------------
  const columns = [
    { field: "id", header: "ID", sortable: true, width: "80px" },
    { field: "title", header: "Tên sản phẩm", sortable: true },
    {
      field: "category",
      header: "Danh mục",
      sortable: true,
      body: (rowData) => rowData.category?.name || "N/A",
    },
    {
      field: "price",
      header: "Giá bán",
      sortable: true,
      body: (rowData) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(rowData.price),
    },
    {
      field: "images",
      header: "Hình ảnh",
      width: "120px",
      body: (rowData) => (
        <img src={rowData.images?.[0] || "/default-image.png"} alt={rowData.title} className="w-16 h-16 object-cover rounded-md" />
      ),
    },
    {
      field: "actions",
      header: "Thao tác",
      sortable: false,
      width: "150px",
      body: (rowData) => (
        <div className="flex gap-2">
          <CustomTooltipButton onClick={(e) => { e.stopPropagation(); openViewModal(rowData); }} tooltip="Xem chi tiết" icon="pi pi-eye" size="small" />
          <CustomTooltipButton onClick={(e) => { e.stopPropagation(); openEditModal(rowData); }} tooltip="Sửa" icon="pi pi-pencil" severity="warning" size="small" />
          <CustomTooltipButton onClick={(e) => { e.stopPropagation(); openDeleteModal(rowData); }} tooltip="Xóa" icon="pi pi-trash" severity="danger" size="small" />
        </div>
      ),
    },
  ];

  // --- Render --------------------------------------------------------------
  return (
    <div>
      <Accordion defaultActiveIndex={0} className="mb-15">
        <AccordionTab header="Tìm kiếm">
          <div className="mt-3 space-y-4">

            {/* Tab chon loai tim kiem */}
            <div className={`flex flex-wrap gap-1.5 rounded-lg p-1 w-fit ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              {Object.entries(SEARCH_TYPES).map(([type, label]) => (
                <button key={type} type="button" className={tabClass(type)} onClick={() => setActiveSearchType(type)}>
                  {label}
                </button>
              ))}
            </div>

            {/* Form tim kiem tuong ung */}
            <div className="flex items-end gap-3 flex-wrap">
              {renderSearchInputs()}

              <div className="flex gap-2">
                <CustomButton
                  label="Tìm kiếm"
                  icon="pi pi-search"
                  onClick={handleSearch}
                />
                <CustomButton
                  label="Đặt lại"
                  icon="pi pi-refresh"
                  severity="secondary"
                  onClick={handleResetSearch}
                />
              </div>
            </div>

            {/* So luong ket qua */}
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              Đang hiển thị {products.length} sản phẩm
            </p>
          </div>
        </AccordionTab>
      </Accordion>

      <DataTable
        data={products}
        columns={columns}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        sortable={true}
        hoverable={true}
        onRowClick={openViewModal}
        emptyMessage="Không có sản phẩm nào"
      />

      <ProductViewModal
        visible={isViewModalVisible}
        product={selectedProduct}
        isDark={isDark}
        onClose={closeViewModal}
      />

      <ProductEditModal
        visible={isEditModalVisible}
        product={editProduct}
        editForm={editForm}
        imageErrors={imageErrors}
        isDark={isDark}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        onFormChange={handleEditFormChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        setImageErrors={setImageErrors}
      />

      <ProductDeleteModal
        visible={isDeleteModalVisible}
        product={deleteProduct}
        isDark={isDark}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Product_manager;