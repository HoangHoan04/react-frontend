import Modal from "../../../components/ui/Modal";
import CustomButton from "../../../components/common/button/Button";

const ProductDeleteModal = ({ visible, product, isDark, onClose, onConfirm }) => {
  if (!product) return null;

  const footer = (
    <div className="flex justify-end gap-2">
      <CustomButton label="Hủy" severity="secondary" onClick={onClose} />
      <CustomButton label="Xác nhận xóa" icon="pi pi-trash" severity="danger" onClick={onConfirm} />
    </div>
  );

  return (
    <Modal visible={visible} onClose={onClose} title="Xác nhận xóa sản phẩm" size="sm" footer={footer}>
      <div className="space-y-4">

        {/* Icon cảnh báo */}
        <div className="flex justify-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isDark ? "bg-red-900/30" : "bg-red-100"}`}>
            <i className="pi pi-exclamation-triangle text-3xl text-red-500" />
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className={`rounded-lg border p-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex items-center gap-3">
            <img
              src={product.images?.[0] || "/default-image.png"}
              alt={product.title}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className={`truncate text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {product.title}
              </p>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                ID: {product.id} &bull; {product.category?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <p className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Bạn có chắc chắn muốn xóa sản phẩm này không?{" "}
          <span className="font-medium text-red-500">Hành động này không thể hoàn tác.</span>
        </p>
      </div>
    </Modal>
  );
};

export default ProductDeleteModal;