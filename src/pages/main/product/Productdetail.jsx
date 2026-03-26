import CustomButton from "@/components/common/button/Button";
import CustomImage from "@/components/common/Image";
import { useThemeStore, useToastStore } from "@/stores";
import { formatDate } from "@/utils/date.util";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { ROUTES } from "../../../common/constants/routes";
import {
  useDetailProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../hooks/products";
import { useRouter } from "../../../route/hooks/use-router";
import ProductEditModal from "./ProductEditModal";
import CustomConfirmDialog from "@/components/ui/ConfirmDialog";

const EMPTY_EDIT_FORM = {
  title: "",
  price: "",
  description: "",
  images: [""],
};

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const showToast = useToastStore((state) => state.showToast);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modal chỉnh sửa
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Dialog xóa
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  // ─── Hooks ────────────────────────────────────────────────────────────────
  const { product, isLoading, refetch } = useDetailProduct(id);

  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct(id);
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct(id);

  const images = product?.images?.filter(Boolean) ?? [];
  const activeImage = images[activeImageIndex] || "";

  // ─── Edit handlers ────────────────────────────────────────────────────────
  const openEditModal = useCallback(() => {
    if (!product) return;
    setEditForm({
      title: product.title || "",
      price: product.price ?? "",
      description: product.description || "",
      images: product.images?.length ? [...product.images] : [""],
    });
    setFormErrors({});
    setIsEditModalVisible(true);
  }, [product]);

  const closeEditModal = useCallback(() => {
    if (isUpdating) return;
    setIsEditModalVisible(false);
    setFormErrors({});
  }, [isUpdating]);

  const handleEditFormChange = (field) => (e) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (index, value) => {
    setEditForm((prev) => {
      const imgs = [...prev.images];
      imgs[index] = value;
      return { ...prev, images: imgs };
    });
  };
  const handleAddImage = () =>
    setEditForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  const handleRemoveImage = (index) => {
    setEditForm((prev) => {
      const imgs = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: imgs.length ? imgs : [""] };
    });
  };

  const handleSubmitEdit = useCallback(async () => {
    const nextErrors = {};
    if (!editForm.title.trim())
      nextErrors.title = "Vui lòng nhập tên sản phẩm.";
    if (!editForm.price || Number(editForm.price) <= 0)
      nextErrors.price = "Vui lòng nhập giá hợp lệ (lớn hơn 0).";
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const validImages = editForm.images.filter((url) => url.trim());
    try {
      await updateProduct({
        title: editForm.title.trim(),
        price: Number(editForm.price),
        description: editForm.description.trim(),
        images: validImages.length ? validImages : product.images,
      });
      await refetch();
      showToast({
        type: "success",
        title: "Cập nhật thành công",
        message: `Sản phẩm "${editForm.title}" đã được cập nhật.`,
      });
      closeEditModal();
    } catch {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
      });
    }
  }, [editForm, updateProduct, refetch, showToast, closeEditModal, product]);

  // ─── Delete handlers ──────────────────────────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteProduct();
      showToast({
        type: "success",
        title: "Xóa thành công",
        message: `Đã xóa sản phẩm "${product?.title}".`,
      });
      router.push(ROUTES.MAIN.PRODUCT_MANAGER.path);
    } catch {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Không thể xóa sản phẩm. Vui lòng thử lại.",
      });
    }
  }, [deleteProduct, product, showToast, router]);

  // ─── Helper render ────────────────────────────────────────────────────────
  const infoItem = (label, value) => (
    <div className={`p-3 rounded-lg ${isDark ? "bg-[#111]" : "bg-gray-50"}`}>
      <label
        className={`text-xs font-medium block mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {label}
      </label>
      <p
        className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}
      >
        {value}
      </p>
    </div>
  );

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className={`rounded-2xl border p-8 text-center shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}
      >
        <i className="pi pi-spin pi-spinner text-2xl" />
        <p
          className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          Đang tải...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <div
          className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}
        >
          <CustomButton
            label="Quay lại"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            onClick={() => router.push(ROUTES.MAIN.PRODUCT_MANAGER.path)}
          />
        </div>
        <div
          className={`rounded-2xl border p-8 text-center shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}
        >
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Không tìm thấy sản phẩm
          </p>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className={`rounded-2xl border p-4 shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}
      >
        <div className="flex items-center justify-between gap-3">
          <CustomButton
            label="Quay lại"
            icon="pi pi-arrow-left"
            severity="secondary"
            outlined
            onClick={() => router.push(ROUTES.MAIN.PRODUCT_MANAGER.path)}
          />
          <div className="flex items-center gap-2">
            <CustomButton
              label="Chỉnh sửa"
              icon="pi pi-pencil"
              severity="warning"
              outlined
              onClick={openEditModal}
            />
            <CustomButton
              label="Xóa"
              icon="pi pi-trash"
              severity="danger"
              outlined
              loading={isDeleting}
              onClick={() => setIsDeleteDialogVisible(true)}
            />
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột ảnh */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <h3
              className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}
            >
              Hình ảnh
            </h3>

            <div
              className={`rounded-xl border overflow-hidden ${isDark ? "border-[#333] bg-[#111]" : "border-gray-200 bg-gray-50"}`}
            >
              {activeImage ? (
                <CustomImage
                  src={activeImage}
                  alt={product.title}
                  previewTitle={product.title}
                  thumbnailClassName="w-full h-56 object-cover"
                />
              ) : (
                <div
                  className={`h-56 flex items-center justify-center ${isDark ? "bg-[#111]" : "bg-gray-100"}`}
                >
                  <i
                    className={`pi pi-image text-4xl ${isDark ? "text-gray-600" : "text-gray-300"}`}
                  />
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                        i === activeImageIndex
                          ? "border-blue-500"
                          : isDark
                            ? "border-[#333] hover:border-gray-500"
                            : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Ảnh ${i + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </button>
                  ))}
                </div>
                <p
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {activeImageIndex + 1} / {images.length} ảnh
                </p>
              </>
            )}
          </div>

          {/* Cột thông tin */}
          <div className="md:col-span-2">
            <h3
              className={`font-semibold mb-3 ${isDark ? "text-gray-100" : "text-gray-800"}`}
            >
              Thông tin sản phẩm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {infoItem("ID", product.id)}
              {infoItem("Tên sản phẩm", product.title)}
              {infoItem("Danh mục", product.category?.name || "N/A")}
              {infoItem("Giá bán", `$${product.price?.toFixed(2) || "0.00"}`)}
              {infoItem("Ngày tạo", formatDate(product.creationAt))}
              {infoItem("Ngày cập nhật", formatDate(product.updatedAt))}
            </div>

            <div
              className={`mt-3 rounded-lg p-3 ${isDark ? "bg-[#111]" : "bg-gray-50"}`}
            >
              <label
                className={`text-xs font-medium block mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Mô tả
              </label>
              <p
                className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {product.description || "Không có mô tả."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh mục liên quan */}
      {product.category && (
        <div
          className={`rounded-2xl border p-6 shadow-sm ${isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"}`}
        >
          <h3
            className={`font-bold text-lg mb-4 ${isDark ? "text-gray-100" : "text-gray-800"}`}
          >
            Danh mục
          </h3>
          <div className="flex items-center gap-4">
            <CustomImage
              src={product.category.image}
              alt={product.category.name}
              previewTitle={product.category.name}
              emptyText="Không có ảnh"
              thumbnailClassName="h-16 w-16 rounded-lg object-cover"
            />
            <div className="space-y-1">
              <p
                className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}
              >
                {product.category.name}
              </p>
              <p
                className={`text-xs font-mono ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                slug: {product.category.slug}
              </p>
              <CustomButton
                label="Xem danh mục"
                icon="pi pi-arrow-right"
                iconPos="right"
                severity="info"
                text
                onClick={() =>
                  router.push(
                    ROUTES.MAIN.CATEGORY_MANAGER.children.DETAIL_CATEGORY.path.replace(
                      ":id",
                      product.category.id,
                    ),
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      <ProductEditModal
        visible={isEditModalVisible}
        isEditMode={true}
        editForm={editForm}
        formErrors={formErrors}
        isDark={isDark}
        onClose={closeEditModal}
        onSubmit={handleSubmitEdit}
        onFormChange={handleEditFormChange}
        onImageChange={handleImageChange}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
      />

      {/* Dialog xác nhận xóa */}
      <CustomConfirmDialog
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        header="Xác nhận xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${product.title}" không?`}
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
