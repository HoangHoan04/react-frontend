import { useEffect, useState } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

// ─── Lấy danh sách sản phẩm ───────────────────────────────────────────────
export const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(API_ENDPOINTS.PRODUCT.LIST);
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, isLoading, error, refetch: fetchProducts };
};

// ─── Tìm kiếm gộp nhiều tham số ──────────────────────────────────────────
// params: { title, price, priceMin, priceMax, categoryId, categorySlug }
export const useFilterProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQueryString = (params = {}) => {
    const qs = new URLSearchParams();
    if (params.title?.trim()) qs.append("title", params.title.trim());
    if (params.price) qs.append("price", params.price);
    if (params.priceMin) qs.append("price_min", params.priceMin);
    if (params.priceMax) qs.append("price_max", params.priceMax);
    if (params.categoryId) qs.append("categoryId", params.categoryId);
    if (params.categorySlug?.trim())
      qs.append("categorySlug", params.categorySlug.trim());
    return qs.toString();
  };

  const fetchWithFilter = async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryString = buildQueryString(params);
      const url = queryString
        ? `${API_ENDPOINTS.PRODUCT.LIST}?${queryString}`
        : API_ENDPOINTS.PRODUCT.LIST;
      const response = await rootApiService.get(url);
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load toàn bộ khi mount
  useEffect(() => {
    fetchWithFilter();
  }, []);

  return { products, isLoading, error, fetchWithFilter };
};

// ─── Lấy chi tiết 1 sản phẩm ──────────────────────────────────────────────
export const useDetailProduct = (productId) => {
  // Khởi tạo state để lưu trữ dữ liệu sản phẩm, trạng thái loading và lỗi
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Hàm để gọi API lấy chi tiết sản phẩm
  const fetchProduct = async () => {
    if (!productId) {
      setProduct(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API để lấy chi tiết sản phẩm dựa trên productId
      const response = await rootApiService.get(
        API_ENDPOINTS.PRODUCT.DETAIL(productId),
      );
      setProduct(response);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  // Gọi hàm fetchProduct khi component mount hoặc khi productId thay đổi
  useEffect(() => {
    fetchProduct();
  }, [productId]);
  // Trả về dữ liệu sản phẩm, trạng thái loading, lỗi và hàm refetch để gọi lại API khi cần thiết
  return { product, isLoading, error, refetch: fetchProduct };
};

// ─── Thêm sản phẩm ────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  // Khởi tạo state để lưu trữ trạng thái loading và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Hàm để gọi API tạo mới sản phẩm
  const mutateAsync = async (newProduct) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API để tạo mới sản phẩm với dữ liệu newProduct
      const response = await rootApiService.post(
        API_ENDPOINTS.PRODUCT.CREATE,
        newProduct,
      );
      setData(response);
      notifyProductsChanged();
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Trả về hàm mutateAsync để gọi API tạo sản phẩm, cùng với trạng thái loading và lỗi
  return { mutateAsync, isPending: isLoading, error };
};

// ─── Cập nhật sản phẩm ────────────────────────────────────────────────────
export const useUpdateProduct = (productId) => {
  // Khởi tạo state để lưu trữ trạng thái loading và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Hàm để gọi API cập nhật sản phẩm dựa trên productId
  const mutateAsync = async (updatedProduct) => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API để cập nhật sản phẩm với dữ liệu updatedProduct và productId
      const response = await rootApiService.put(
        API_ENDPOINTS.PRODUCT.UPDATE(productId),
        updatedProduct,
      );
      setData(response);
      notifyProductsChanged();
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Trả về hàm mutateAsync để gọi API cập nhật sản phẩm, cùng với trạng thái loading và lỗi

  return { mutateAsync, isPending: isLoading, error };
};

// ─── Xóa sản phẩm ─────────────────────────────────────────────────────────
export const useDeleteProduct = (productId) => {
  // khởi tạo state để lưu trữ trạng thái loading và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // hàm để gọi API xóa sản phẩm dựa trên productId
  const mutateAsync = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi API để xóa sản phẩm với productId
      const response = await rootApiService.delete(
        API_ENDPOINTS.PRODUCT.DELETE(productId),
      );
      setData(response);
      notifyProductsChanged();
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Trả về hàm mutateAsync để gọi API xóa sản phẩm, cùng với trạng thái loading và lỗi
  return { mutateAsync, isPending: isLoading, error };
};
