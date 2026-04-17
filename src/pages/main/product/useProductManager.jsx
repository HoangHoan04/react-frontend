import { useState } from "react";
import { useToastStore } from "@/stores";
import {
  useFilterProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../hooks/products";

const EMPTY_SEARCH_FORM = {
  title: "",
  price: "",
  priceMin: "",
  priceMax: "",
  categoryId: "",
  categorySlug: "",
};

const EMPTY_EDIT_FORM = {
  title: "",
  price: "",
  categoryId: "",
  description: "",
  images: [""],
};

const useProductManager = () => {
  const showToast = useToastStore((state) => state.showToast);

  const [searchForm, setSearchForm] = useState(EMPTY_SEARCH_FORM);

  // Modal thêm / chỉnh sửa
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [formErrors, setFormErrors] = useState({});

  // Xóa
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const isEditMode = Boolean(editingProduct?.id);

  // ─── Data & mutations ─────────────────────────────────────────────────────
  const { products, isLoading, fetchWithFilter } = useFilterProducts();
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct(editingProduct?.id);
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct(productToDelete?.id);

  const isFormSubmitting = isCreating || isUpdating;

  // ─── Tìm kiếm ─────────────────────────────────────────────────────────────
  const handleSearchFormChange = (field) => (e) => {
    setSearchForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = () => {
    const { priceMin, priceMax } = searchForm;

    if ((priceMin && !priceMax) || (!priceMin && priceMax)) {
      showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập cả giá tối thiểu và tối đa." });
      return;
    }
    if (priceMin && priceMax && Number(priceMin) > Number(priceMax)) {
      showToast({ type: "error", title: "Lỗi", message: "Giá tối thiểu phải nhỏ hơn giá tối đa." });
      return;
    }

    // Chỉ truyền các trường có giá trị
    const params = {};
    if (searchForm.title.trim())        params.title        = searchForm.title.trim();
    if (searchForm.price)               params.price        = searchForm.price;
    if (searchForm.priceMin)            params.priceMin     = searchForm.priceMin;
    if (searchForm.priceMax)            params.priceMax     = searchForm.priceMax;
    if (searchForm.categoryId)          params.categoryId   = searchForm.categoryId;
    if (searchForm.categorySlug.trim()) params.categorySlug = searchForm.categorySlug.trim();

    fetchWithFilter(params);
  };

  const handleResetSearch = () => {
    setSearchForm(EMPTY_SEARCH_FORM);
    fetchWithFilter(); // load lại toàn bộ
  };

  // ─── Thêm / Chỉnh sửa ────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingProduct(null);
    setEditForm(EMPTY_EDIT_FORM);
    setFormErrors({});
    setIsEditModalVisible(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title || "",
      price: product.price ?? "",
      description: product.description || "",
      images: product.images?.length ? [...product.images] : [""],
    });
    setFormErrors({});
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    if (isFormSubmitting) return;
    setIsEditModalVisible(false);
    setEditingProduct(null);
    setFormErrors({});
  };

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

  const handleSubmitProduct = async () => {
    const nextErrors = {};
    if (!editForm.title.trim()) nextErrors.title = "Vui lòng nhập tên sản phẩm.";
    if (!editForm.price || Number(editForm.price) <= 0) nextErrors.price = "Vui lòng nhập giá hợp lệ (lớn hơn 0).";
    if (!isEditMode && !editForm.categoryId) nextErrors.categoryId = "Vui lòng nhập ID danh mục.";
    if (Object.keys(nextErrors).length > 0) { setFormErrors(nextErrors); return; }

    const validImages = editForm.images.filter((url) => url.trim());
    const payload = {
      title: editForm.title.trim(),
      price: Number(editForm.price),
      description: editForm.description.trim(),
      images: validImages.length ? validImages : ["https://placehold.co/400"],
      ...(!isEditMode && { categoryId: Number(editForm.categoryId) }),
    };

    try {
      if (isEditMode) {
        await updateProduct(payload);
        showToast({ type: "success", title: "Cập nhật thành công", message: `Sản phẩm "${payload.title}" đã được cập nhật.` });
      } else {
        await createProduct(payload);
        showToast({ type: "success", title: "Thêm mới thành công", message: `Đã thêm sản phẩm "${payload.title}".` });
      }
      await fetchWithFilter(); // cập nhật lại danh sách
      closeEditModal();
    } catch {
      showToast({ type: "error", title: "Lỗi", message: `Không thể ${isEditMode ? "cập nhật" : "thêm"} sản phẩm. Vui lòng thử lại.` });
    }
  };

  // ─── Xóa ──────────────────────────────────────────────────────────────────
  const openDeleteDialog = (product) => { setProductToDelete(product); setIsDeleteDialogVisible(true); };
  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setIsDeleteDialogVisible(false);
    setProductToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return;
    try {
      await deleteProduct();
      await fetchWithFilter(); // cập nhật lại danh sách
      showToast({ type: "success", title: "Xóa thành công", message: `Đã xóa sản phẩm "${productToDelete.title}".` });
    } catch {
      showToast({ type: "error", title: "Lỗi", message: "Không thể xóa sản phẩm. Vui lòng thử lại." });
    } finally {
      closeDeleteDialog();
    }
  };

  return {
    products, isLoading,
    refetch: fetchWithFilter,
    searchForm, handleSearchFormChange, handleSearch, handleResetSearch,
    editingProduct, isEditMode, isEditModalVisible, isFormSubmitting,
    editForm, formErrors,
    openCreateModal, openEditModal, closeEditModal,
    handleEditFormChange, handleImageChange, handleAddImage, handleRemoveImage,
    handleSubmitProduct,
    productToDelete, isDeleteDialogVisible, isDeleting,
    openDeleteDialog, closeDeleteDialog, handleConfirmDelete,
  };
};

export default useProductManager;