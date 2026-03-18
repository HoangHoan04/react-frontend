import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import CustomButton from "../../../components/common/button/Button";

const ProductViewModal = ({ visible, product, isDark, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) return null;

  const images = product.images?.length ? product.images : ["/default-image.png"];
  const activeImage = images[activeIndex] || "/default-image.png";

  const footer = (
    <div className="flex justify-end">
      <CustomButton label="Đóng" severity="secondary" onClick={onClose} />
    </div>
  );

  return (
    <Modal visible={visible} onClose={onClose} title="Chi tiết sản phẩm" size="lg" footer={footer}>
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">

        {/* Cột ảnh */}
        <div className="flex flex-col gap-2">
          <div className={`overflow-hidden rounded-lg border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <img
              src={activeImage}
              alt={product.title}
              className="h-52 w-full object-cover transition-opacity duration-200"
              onError={(e) => { e.currentTarget.src = "/default-image.png"; }}
            />
          </div>

          {images.length > 1 && (
            <>
              <div className="flex flex-wrap gap-2">
                {images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      i === activeIndex
                        ? "border-blue-500"
                        : isDark
                        ? "border-gray-600 hover:border-gray-400"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Ảnh ${i + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.src = "/default-image.png"; }}
                    />
                  </button>
                ))}
              </div>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {activeIndex + 1} / {images.length} ảnh
              </p>
            </>
          )}
        </div>

        {/* Cột thông tin */}
        <div className="space-y-3 text-sm">
          <p><span className="font-medium">ID:</span> {product.id}</p>
          <p><span className="font-medium">Tên:</span> {product.title}</p>
          <p><span className="font-medium">Danh mục:</span> {product.category?.name || "N/A"}</p>
          <p>
            <span className="font-medium">Giá:</span>{" "}
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
          </p>
          <p className="leading-6">
            <span className="font-medium">Mô tả:</span>{" "}
            {product.description || "Không có mô tả."}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProductViewModal;