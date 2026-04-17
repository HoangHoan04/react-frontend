import CustomButton from "@/components/common/button/Button";
import CustomImage from "@/components/common/Image";
import CustomInputText from "@/components/common/input/InputText";
import DataTable from "@/components/common/table/DataTable";
import CustomConfirmDialog from "@/components/ui/ConfirmDialog";
import { useThemeStore } from "@/stores";
import { useMemo } from "react";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import { ROUTES } from "../../../common/constants/routes";
import { useRouter } from "../../../route/hooks/use-router";
import useProductManager from "./useProductManager";
import ProductEditModal from "./ProductEditModal";

export default function ProductManager() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const router = useRouter();

  const {
    products, refetch,
    searchForm, handleSearchFormChange, handleSearch, handleResetSearch,
    isEditMode, isEditModalVisible,
    editForm, formErrors,
    openCreateModal, openEditModal, closeEditModal,
    handleEditFormChange, handleImageChange, handleAddImage, handleRemoveImage,
    handleSubmitProduct,
    productToDelete, isDeleteDialogVisible,
    openDeleteDialog, closeDeleteDialog, handleConfirmDelete,
  } = useProductManager();

  // ─── Columns ──────────────────────────────────────────────────────────────
  const columns = useMemo(() => [
    { field: "id", header: "ID", width: "70px" },
    { field: "title", header: "Tên sản phẩm" },
    {
      field: "category",
      header: "Danh mục",
      body: (row) => row.category?.name || "N/A",
    },
    {
      field: "price",
      header: "Giá bán",
      body: (row) => (
        <span className="font-medium">${row.price?.toFixed(2) || "0.00"}</span>
      ),
    },
    {
      field: "images",
      header: "Hình ảnh",
      width: "100px",
      sortable: false,
      body: (row) => (
        <CustomImage
          src={row.images?.[0]}
          alt={row.title}
          previewTitle={row.title}
          emptyText="Không có ảnh"
          thumbnailClassName="h-14 w-14 rounded-md object-cover"
        />
      ),
    },
    {
      field: "actions",
      header: "Hành động",
      width: "140px",
      sortable: false,
      body: (row) => (
        <div className="flex gap-2">
          <CustomTooltipButton
            tooltip="Xem chi tiết"
            icon="pi pi-eye"
            severity="info"
            outlined
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                ROUTES.MAIN.PRODUCT_MANAGER.children.DETAIL_PRODUCT.path.replace(":id", row.id)
              );
            }}
          />
          <CustomTooltipButton
            tooltip="Chỉnh sửa"
            icon="pi pi-pencil"
            severity="warning"
            outlined
            size="small"
            onClick={(e) => { e.stopPropagation(); openEditModal(row); }}
          />
          <CustomTooltipButton
            tooltip="Xóa"
            icon="pi pi-trash"
            severity="danger"
            outlined
            size="small"
            onClick={(e) => { e.stopPropagation(); openDeleteDialog(row); }}
          />
        </div>
      ),
    },
  ], [openEditModal, openDeleteDialog, router]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Khu vực tìm kiếm */}
      <div className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}>
        <Accordion multiple className="mb-0">
          <AccordionTab
            header="Tìm kiếm"
            headerClassName={isDark ? "bg-[#202020] text-gray-100" : "bg-[#f8fbff]"}
            contentClassName={isDark ? "bg-[#171717]" : "bg-white"}
          >
            <div className="space-y-4 pt-1">

              {/* Hàng 1: Tên + Giá chính xác */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CustomInputText
                  label="Tên sản phẩm"
                  value={searchForm.title}
                  onChange={handleSearchFormChange("title")}
                  placeholder="Ví dụ: iPhone, Laptop..."
                  isDark={isDark}
                  containerClassName="w-full"
                />
                <CustomInputText
                  label="Giá chính xác (USD)"
                  type="number"
                  min="0"
                  value={searchForm.price}
                  onChange={handleSearchFormChange("price")}
                  placeholder="Ví dụ: 100"
                  isDark={isDark}
                  containerClassName="w-full"
                />
              </div>

              {/* Hàng 2: Khoảng giá */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CustomInputText
                  label="Giá tối thiểu (USD)"
                  type="number"
                  min="0"
                  value={searchForm.priceMin}
                  onChange={handleSearchFormChange("priceMin")}
                  placeholder="0"
                  isDark={isDark}
                  containerClassName="w-full"
                />
                <CustomInputText
                  label="Giá tối đa (USD)"
                  type="number"
                  min="0"
                  value={searchForm.priceMax}
                  onChange={handleSearchFormChange("priceMax")}
                  placeholder="9999"
                  isDark={isDark}
                  containerClassName="w-full"
                />
              </div>

              {/* Hàng 3: ID danh mục + Slug danh mục */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CustomInputText
                  label="ID danh mục"
                  type="number"
                  min="1"
                  value={searchForm.categoryId}
                  onChange={handleSearchFormChange("categoryId")}
                  placeholder="Ví dụ: 1, 2, 3..."
                  isDark={isDark}
                  containerClassName="w-full"
                />
                <CustomInputText
                  label="Slug danh mục"
                  value={searchForm.categorySlug}
                  onChange={handleSearchFormChange("categorySlug")}
                  placeholder="Ví dụ: electronics, furniture..."
                  isDark={isDark}
                  containerClassName="w-full"
                />
              </div>

              {/* Nút hành động + đếm kết quả */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Đang hiển thị {products.length} sản phẩm
                </p>
                <div className="flex gap-2">
                  <CustomButton label="Tìm kiếm" icon="pi pi-search" severity="info" outlined onClick={handleSearch} />
                  <CustomButton label="Đặt lại" icon="pi pi-refresh" severity="secondary" outlined onClick={handleResetSearch} />
                </div>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      {/* Thanh hành động */}
      <div className="flex items-center justify-between gap-3">
        <CustomButton
          label="Thêm sản phẩm"
          icon="pi pi-plus-circle"
          severity="success"
          outlined
          onClick={openCreateModal}
        />
        <CustomButton
          label="Tải lại"
          icon="pi pi-refresh"
          severity="info"
          outlined
          onClick={refetch}
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}>
        <DataTable
          data={products}
          columns={columns}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          sortable
          hoverable
          onRowClick={(row) =>
            router.push(
              ROUTES.MAIN.PRODUCT_MANAGER.children.DETAIL_PRODUCT.path.replace(":id", row.id)
            )
          }
          emptyMessage="Không có sản phẩm nào"
        />
      </div>

      {/* Modal thêm / chỉnh sửa */}
      <ProductEditModal
        visible={isEditModalVisible}
        isEditMode={isEditMode}
        editForm={editForm}
        formErrors={formErrors}
        isDark={isDark}
        onClose={closeEditModal}
        onSubmit={handleSubmitProduct}
        onFormChange={handleEditFormChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
      />

      {/* Dialog xác nhận xóa */}
      <CustomConfirmDialog
        visible={isDeleteDialogVisible}
        onHide={closeDeleteDialog}
        header="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${productToDelete?.title || ""}" không?`}
        severity="danger"
        acceptLabel="Xóa"
        rejectLabel="Hủy"
        icon="pi pi-trash"
        isDark={isDark}
        onAccept={handleConfirmDelete}
      />
    </div>
  );
}