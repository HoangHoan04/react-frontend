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
    if (params.title?.trim())        qs.append("title",        params.title.trim());
    if (params.price)                qs.append("price",        params.price);
    if (params.priceMin)             qs.append("price_min",    params.priceMin);
    if (params.priceMax)             qs.append("price_max",    params.priceMax);
    if (params.categoryId)           qs.append("categoryId",   params.categoryId);
    if (params.categorySlug?.trim()) qs.append("categorySlug", params.categorySlug.trim());
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
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!productId) {
      setProduct(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
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

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return { product, isLoading, error, refetch: fetchProduct };
};

// ─── Thêm sản phẩm ────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (newProduct) => {
    setIsLoading(true);
    setError(null);
    try {
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

  return { mutateAsync, isPending: isLoading, error };
};

// ─── Cập nhật sản phẩm ────────────────────────────────────────────────────
export const useUpdateProduct = (productId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async (updatedProduct) => {
    setIsLoading(true);
    setError(null);
    try {
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

  return { mutateAsync, isPending: isLoading, error };
};

// ─── Xóa sản phẩm ─────────────────────────────────────────────────────────
export const useDeleteProduct = (productId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutateAsync = async () => {
    setIsLoading(true);
    setError(null);
    try {
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

  return { mutateAsync, isPending: isLoading, error };
};
