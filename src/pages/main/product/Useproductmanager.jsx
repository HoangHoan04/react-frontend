import { useEffect, useState } from "react";
import { useLoadingStore, useToastStore } from "@/stores";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";

const SEARCH_TYPES = {
  title: "Tên sản phẩm",
  price: "Giá chính xác",
  priceRange: "Khoảng giá",
  categoryId: "ID danh mục",
  categorySlug: "Slug danh mục",
};

const useProductManager = () => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const showToast = useToastStore((state) => state.showToast);

  const [products, setProducts] = useState([]);

  // Search
  const [activeSearchType, setActiveSearchType] = useState("title");
  const [searchForm, setSearchForm] = useState({
    title: "",
    price: "",
    priceMin: "",
    priceMax: "",
    categoryId: "",
    categorySlug: "",
  });

  // Modal: Xem chi tiet
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  // Modal: Chinh sua
  const [editProduct, setEditProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", price: "", description: "", images: [""] });
  const [imageErrors, setImageErrors] = useState({});

  // Modal: Xoa
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // --- Fetch all -----------------------------------------------------------
  const fetchAllProducts = async () => {
    try {
      showLoading();
      const data = await rootApiService.get(API_ENDPOINTS.PRODUCT.LIST);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showToast({ type: "error", title: "Loi", message: "Không thể tải danh sách sản phẩm" });
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // --- Search handlers -----------------------------------------------------
  const handleSearchFormChange = (field) => (e) => {
    setSearchForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = async () => {
    const { title, price, priceMin, priceMax, categoryId, categorySlug } = searchForm;

    let endpoint = null;

    switch (activeSearchType) {
      case "title":
        if (!title.trim()) { showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập tên sản phẩm." }); return; }
        endpoint = API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_TITLE(title.trim());
        break;
      case "price":
        if (!price) { showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập giá." }); return; }
        endpoint = API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_PRICE(Number(price));
        break;
      case "priceRange":
        if (!priceMin || !priceMax) { showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập cả giá min và max." }); return; }
        if (Number(priceMin) > Number(priceMax)) { showToast({ type: "error", title: "Lỗi", message: "Giá min phải nhỏ hơn giá max." }); return; }
        endpoint = API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_PRICE_RANGE(Number(priceMin), Number(priceMax));
        break;
      case "categoryId":
        if (!categoryId) { showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập ID danh mục." }); return; }
        endpoint = API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_CATEGORY_ID(Number(categoryId));
        break;
      case "categorySlug":
        if (!categorySlug.trim()) { showToast({ type: "error", title: "Lỗi", message: "Vui lòng nhập Slug danh mục." }); return; }
        endpoint = API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_CATEGORY_SLUG(categorySlug.trim());
        break;
      default:
        return;
    }

    try {
      showLoading();
      const data = await rootApiService.get(endpoint);
      setProducts(Array.isArray(data) ? data : []);
      if (!data?.length) {
        showToast({ type: "warn", title: "Không có kết quả", message: "Không tìm thấy sản phẩm nào." });
      }
    } catch (error) {
      console.error("Search error:", error);
      showToast({ type: "error", title: "Lỗi", message: "Tìm kiếm thất bại. Vui lòng thử lại." });
    } finally {
      hideLoading();
    }
  };

  const handleResetSearch = () => {
    setSearchForm({ title: "", price: "", priceMin: "", priceMax: "", categoryId: "", categorySlug: "" });
    fetchAllProducts();
  };

  // --- Xem chi tiet --------------------------------------------------------
  const openViewModal = (product) => { setSelectedProduct(product); setIsViewModalVisible(true); };
  const closeViewModal = () => { setIsViewModalVisible(false); setSelectedProduct(null); };

  // --- Chinh sua -----------------------------------------------------------
  const openEditModal = (product) => {
    setEditProduct(product);
    setEditForm({
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      images: product.images?.length ? [...product.images] : [""],
    });
    setImageErrors({});
    setIsEditModalVisible(true);
  };
  const closeEditModal = () => { setIsEditModalVisible(false); setEditProduct(null); setImageErrors({}); };

  const handleEditFormChange = (field) => (e) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleImageChange = (index, value) => {
    setEditForm((prev) => { const imgs = [...prev.images]; imgs[index] = value; return { ...prev, images: imgs }; });
    setImageErrors((prev) => ({ ...prev, [index]: false }));
  };
  const handleAddImage = () => setEditForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  const handleRemoveImage = (index) => {
    setEditForm((prev) => {
      const imgs = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: imgs.length ? imgs : [""] };
    });
    setImageErrors((prev) => { const copy = { ...prev }; delete copy[index]; return copy; });
  };

  const handleEditSubmit = async () => {
    if (!editForm.title.trim()) { showToast({ type: "error", title: "Lỗi", message: "Tên sản phẩm không được để trống." }); return; }
    if (!editForm.price || Number(editForm.price) <= 0) { showToast({ type: "error", title: "Lỗi", message: "Giá bán phải lớn hơn 0." }); return; }

    const validImages = editForm.images.filter((url) => url.trim());
    try {
      showLoading();
      await rootApiService.put(API_ENDPOINTS.PRODUCT.UPDATE(editProduct.id), {
        title: editForm.title.trim(),
        price: Number(editForm.price),
        description: editForm.description.trim(),
        images: validImages.length ? validImages : editProduct.images,
      });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? { ...p, title: editForm.title.trim(), price: Number(editForm.price), description: editForm.description.trim(), images: validImages.length ? validImages : p.images }
            : p
        )
      );
      showToast({ type: "success", title: "Cập nhật thành công", message: `Sản phẩm "${editForm.title}" đã được cập nhật.` });
      closeEditModal();
    } catch {
      showToast({ type: "error", title: "Lỗi", message: "Không thể nhập nhật sản phẩm. Vui lòng thử lại." });
    } finally {
      hideLoading();
    }
  };

  // --- Xoa -----------------------------------------------------------------
  const openDeleteModal = (product) => { setDeleteProduct(product); setIsDeleteModalVisible(true); };
  const closeDeleteModal = () => { setIsDeleteModalVisible(false); setDeleteProduct(null); };

  const handleDeleteConfirm = async () => {
    try {
      showLoading();
      await rootApiService.delete(API_ENDPOINTS.PRODUCT.DELETE(deleteProduct.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
      showToast({ type: "success", title: "Xóa thành công", message: `Sản phẩm "${deleteProduct.title}" đã được xóa.` });
      closeDeleteModal();
    } catch {
      showToast({ type: "error", title: "Lỗi", message: "Không thể xóa sản phẩm. Vui lòng thử lại." });
    } finally {
      hideLoading();
    }
  };

  return {
    // data
    products,
    // search
    activeSearchType, setActiveSearchType,
    searchForm, handleSearchFormChange, handleSearch, handleResetSearch,
    SEARCH_TYPES,
    // view modal
    selectedProduct, isViewModalVisible, openViewModal, closeViewModal,
    // edit modal
    editProduct, isEditModalVisible, editForm, imageErrors,
    openEditModal, closeEditModal,
    handleEditFormChange, handleImageChange, handleAddImage, handleRemoveImage,
    setImageErrors, handleEditSubmit,
    // delete modal
    deleteProduct, isDeleteModalVisible, openDeleteModal, closeDeleteModal, handleDeleteConfirm,
  };
};

export default useProductManager;