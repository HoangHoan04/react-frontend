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

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};

// ─── Tìm kiếm gộp nhiều tham số ──────────────────────────────────────────
// params: { title, price, priceMin, priceMax, categoryId, categorySlug }
export const useFilterProducts = (params) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQueryString = (p) => {
    const qs = new URLSearchParams();
    if (p.title?.trim()) qs.append("title", p.title.trim());
    if (p.price) qs.append("price", p.price);
    if (p.priceMin) qs.append("price_min", p.priceMin);
    if (p.priceMax) qs.append("price_max", p.priceMax);
    if (p.categoryId) qs.append("categoryId", p.categoryId);
    if (p.categorySlug?.trim())
      qs.append("categorySlug", p.categorySlug.trim());
    return qs.toString();
  };

  const queryString = buildQueryString(params ?? {});
  const hasFilter = Boolean(queryString);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = hasFilter
        ? `${API_ENDPOINTS.PRODUCT.LIST}?${queryString}`
        : API_ENDPOINTS.PRODUCT.LIST;
      const response = await rootApiService.get(url);
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [queryString]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
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
      setProduct(response ?? null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
};

// ─── Tìm kiếm theo tên ────────────────────────────────────────────────────
export const useSearchProductsByTitle = (title) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizedTitle = title?.trim() ?? "";

  const fetchProducts = async () => {
    if (!normalizedTitle) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_TITLE(normalizedTitle),
      );
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [normalizedTitle]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};

// ─── Tìm kiếm theo giá ────────────────────────────────────────────────────
export const useSearchProductsByPrice = (price) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    if (!price) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_PRICE(Number(price)),
      );
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [price]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};

// ─── Tìm kiếm theo khoảng giá ─────────────────────────────────────────────
export const useSearchProductsByPriceRange = (priceMin, priceMax) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const enabled =
    Boolean(priceMin) &&
    Boolean(priceMax) &&
    Number(priceMin) <= Number(priceMax);

  const fetchProducts = async () => {
    if (!enabled) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_PRICE_RANGE(
          Number(priceMin),
          Number(priceMax),
        ),
      );
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [priceMin, priceMax, enabled]);

  useEffect(
    () => subscribeProductsChange(fetchProducts),
    [priceMin, priceMax, enabled],
  );

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};

// ─── Tìm kiếm theo ID danh mục ────────────────────────────────────────────
export const useSearchProductsByCategoryId = (categoryId) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_CATEGORY_ID(Number(categoryId)),
      );
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  useEffect(() => subscribeProductsChange(fetchProducts), [categoryId]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};

// ─── Tìm kiếm theo slug danh mục ──────────────────────────────────────────
export const useSearchProductsByCategorySlug = (categorySlug) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizedSlug = categorySlug?.trim() ?? "";

  const fetchProducts = async () => {
    if (!normalizedSlug) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_CATEGORY_SLUG(normalizedSlug),
      );
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [normalizedSlug]);

  useEffect(() => subscribeProductsChange(fetchProducts), [normalizedSlug]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};

// ─── Thêm sản phẩm ────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

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

  return {
    mutateAsync,
    isPending: isLoading,
    error,
    data,
  };
};

// ─── Cập nhật sản phẩm ────────────────────────────────────────────────────
export const useUpdateProduct = (productId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutateAsync = async (updatedProduct) => {
    if (!productId) {
      throw new Error("Missing product id");
    }

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

  return {
    mutateAsync,
    isPending: isLoading,
    error,
    data,
  };
};

// ─── Xóa sản phẩm ─────────────────────────────────────────────────────────
export const useDeleteProduct = (productId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutateAsync = async () => {
    if (!productId) {
      throw new Error("Missing product id");
    }

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

  return {
    mutateAsync,
    isPending: isLoading,
    error,
    data,
  };
};
