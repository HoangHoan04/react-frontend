import CustomModal from "@/components/common/Modal";
import CustomButton from "@/components/common/button/Button";
import CustomInputText from "@/components/common/input/InputText";
import CustomFileUpload from "@/components/common/FileUpload";

const ProductEditModal = ({
  visible,
  isEditMode,
  editForm,
  formErrors,
  isDark,
  onClose,
  onSubmit,
  onFormChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
}) => {
  return (
    <CustomModal
      visible={visible}
      onHide={onClose}
      header={isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
      showHeader
      closeButton
      showFooter
      modalWidth="max-w-2xl"
      isDark={isDark}
      footer={
        <>
          <CustomButton
            label="Hủy"
            icon="pi pi-times"
            severity="danger"
            outlined
            onClick={onClose}
          />
          <CustomButton
            label={isEditMode ? "Cập nhật" : "Thêm mới"}
            icon={isEditMode ? "pi pi-pen-to-square" : "pi pi-plus-circle"}
            severity={isEditMode ? "warning" : "success"}
            outlined
            onClick={onSubmit}
          />
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4">

        {/* Tên sản phẩm */}
        <CustomInputText
          label="Tên sản phẩm"
          value={editForm.title}
          onChange={onFormChange("title")}
          placeholder="Nhập tên sản phẩm"
          isDark={isDark}
          error={Boolean(formErrors.title)}
          errorMessage={formErrors.title}
          containerClassName="w-full"
        />

        {/* Giá bán */}
        <CustomInputText
          label="Giá bán (USD)"
          type="number"
          min="0"
          value={String(editForm.price)}
          onChange={onFormChange("price")}
          placeholder="Nhập giá bán"
          isDark={isDark}
          error={Boolean(formErrors.price)}
          errorMessage={formErrors.price}
          containerClassName="w-full"
        />

        {/* Mô tả */}
        <div>
          <label
            className={`block text-sm font-medium mb-1.5 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Mô tả
          </label>
          <textarea
            value={editForm.description}
            onChange={onFormChange("description")}
            rows={4}
            placeholder="Nhập mô tả sản phẩm..."
            className={`w-full rounded-md border outline-none transition-all duration-200 px-3 py-2 text-sm resize-none ${
              isDark
                ? "bg-[#111] border-[#333] text-gray-100 placeholder-gray-600 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
            }`}
          />
        </div>

        {/* Hình ảnh */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Hình ảnh
            <span
              className={`ml-1 text-xs font-normal ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              (tải lên hoặc nhập URL)
            </span>
          </label>

          <div className="space-y-3">
            {editForm.images.map((url, index) => (
              <div
                key={index}
                className={`rounded-xl border p-3 ${
                  isDark
                    ? "border-[#333] bg-[#111]"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Header của từng ảnh */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Ảnh {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    disabled={editForm.images.length === 1}
                    className={`h-6 w-6 inline-flex items-center justify-center rounded transition-colors ${
                      editForm.images.length === 1
                        ? "opacity-30 cursor-not-allowed"
                        : isDark
                        ? "text-red-400 hover:bg-red-900/30"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <i className="pi pi-trash text-xs" />
                  </button>
                </div>

                {/* File upload */}
                <CustomFileUpload
                  label=""
                  value={url}
                  onChange={(uploadedUrl) =>
                    onImageChange(index, uploadedUrl || "")
                  }
                  emptyText="Chưa có ảnh — nhấn để tải lên"
                  isDark={isDark}
                  previewTitle={`Ảnh ${index + 1}`}
                />

                {/* Nhập URL thủ công */}
                <div className="mt-3">
                  <CustomInputText
                    label="Hoặc nhập URL ảnh"
                    value={url}
                    onChange={(e) => onImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    isDark={isDark}
                    containerClassName="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Nút thêm ảnh */}
          <button
            type="button"
            onClick={onAddImage}
            className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2.5 text-sm transition-colors ${
              isDark
                ? "border-[#444] text-gray-400 hover:border-blue-500 hover:text-blue-400"
                : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500"
            }`}
          >
            <i className="pi pi-plus text-xs" />
            Thêm ảnh
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ProductEditModal;