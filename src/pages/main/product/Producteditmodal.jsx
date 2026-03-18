import Modal from "../../../components/ui/Modal";
import CustomButton from "../../../components/common/button/Button";
import FloatLabelInput from "../../../components/common/input/FloatLabelInput";

const ProductEditModal = ({
  visible,
  product,
  editForm,
  imageErrors,
  isDark,
  onClose,
  onSubmit,
  onFormChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  setImageErrors,
}) => {
  if (!product) return null;

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDark
      ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-500"
      : "border-gray-300 bg-white text-gray-800 placeholder-gray-400"
  }`;
  const labelClass = `text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`;

  const footer = (
    <div className="flex justify-end gap-2">
      <CustomButton label="Hủy" severity="secondary" onClick={onClose} />
      <CustomButton label="Lưu thay đổi" icon="pi pi-check" onClick={onSubmit} />
    </div>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={`Chỉnh sửa sản phẩm #${product.id}`}
      size="lg"
      footer={footer}
    >
      <div className="grid gap-6 md:grid-cols-2">

        {/* ── Cột trái: thông tin cơ bản ── */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Tên sản phẩm <span className="text-red-500">*</span></label>
            <FloatLabelInput value={editForm.title} onChange={onFormChange("title")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Giá bán (USD) <span className="text-red-500">*</span></label>
            <FloatLabelInput type="number" min="0" value={editForm.price} onChange={onFormChange("price")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Mô tả</label>
            <textarea
              value={editForm.description}
              onChange={onFormChange("description")}
              rows={6}
              placeholder="Nhập mô tả sản phẩm..."
              className={inputClass}
            />
          </div>
        </div>

        {/* ── Cột phải: hình ảnh ── */}
        <div className="flex flex-col gap-3">
          <label className={labelClass}>
            Hình ảnh{" "}
            <span className={`text-xs font-normal ${isDark ? "text-gray-400" : "text-gray-500"}`}>(nhập URL)</span>
          </label>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-64 pr-0.5">
            {editForm.images.map((url, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">

                  {/* Thumbnail */}
                  <div className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border ${isDark ? "border-gray-600" : "border-gray-200"}`}>
                    {url.trim() && !imageErrors[index] ? (
                      <img
                        src={url}
                        alt={`Ảnh ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={() => setImageErrors((prev) => ({ ...prev, [index]: true }))}
                        onLoad={() => setImageErrors((prev) => ({ ...prev, [index]: false }))}
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                        <i className={`pi pi-image text-sm ${imageErrors[index] ? "text-red-400" : isDark ? "text-gray-500" : "text-gray-400"}`} />
                      </div>
                    )}
                  </div>

                  {/* Input URL */}
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => onImageChange(index, e.target.value)}
                    placeholder={`https://example.com/image-${index + 1}.jpg`}
                    className={`${inputClass} flex-1`}
                  />

                  {/* Nút xóa */}
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    disabled={editForm.images.length === 1 && !url.trim()}
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                      editForm.images.length === 1 && !url.trim()
                        ? "cursor-not-allowed opacity-30"
                        : isDark
                        ? "text-red-400 hover:bg-red-900/30"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <i className="pi pi-times text-xs" />
                  </button>
                </div>

                {imageErrors[index] && url.trim() && (
                  <p className="ml-12 text-xs text-red-500">
                    <i className="pi pi-exclamation-circle mr-1" />
                    URL không tải được
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Nút thêm ảnh */}
          <button
            type="button"
            onClick={onAddImage}
            className={`flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm transition-colors ${
              isDark
                ? "border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400"
                : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500"
            }`}
          >
            <i className="pi pi-plus text-xs" />
            Thêm ảnh
          </button>

          {/* Preview tổng hợp */}
          {editForm.images.some((url) => url.trim()) && (
            <div className={`rounded-lg border p-3 ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
              <p className={`mb-2 text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Tất cả ảnh ({editForm.images.filter((u) => u.trim()).length})
              </p>
              <div className="flex flex-wrap gap-2">
                {editForm.images.filter((url) => url.trim()).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="h-14 w-14 rounded-md object-cover border border-gray-200"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProductEditModal;