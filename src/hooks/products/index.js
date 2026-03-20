import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

// ─── Lấy danh sách sản phẩm ───────────────────────────────────────────────
export const useGetProducts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await rootApiService.get(API_ENDPOINTS.PRODUCT.LIST);
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Tìm kiếm gộp nhiều tham số ──────────────────────────────────────────
// params: { title, price, priceMin, priceMax, categoryId, categorySlug }
export const useFilterProducts = (params) => {
  const buildQueryString = (p) => {
    const qs = new URLSearchParams();
    if (p.title?.trim())        qs.append("title",        p.title.trim());
    if (p.price)                qs.append("price",        p.price);
    if (p.priceMin)             qs.append("price_min",    p.priceMin);
    if (p.priceMax)             qs.append("price_max",    p.priceMax);
    if (p.categoryId)           qs.append("categoryId",   p.categoryId);
    if (p.categorySlug?.trim()) qs.append("categorySlug", p.categorySlug.trim());
    return qs.toString();
  };

  const queryString = buildQueryString(params ?? {});
  const hasFilter = Boolean(queryString);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productsFilter", queryString],
    queryFn: async () => {
      const url = hasFilter
        ? `${API_ENDPOINTS.PRODUCT.LIST}?${queryString}`
        : API_ENDPOINTS.PRODUCT.LIST;
      const response = await rootApiService.get(url);
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Lấy chi tiết 1 sản phẩm ──────────────────────────────────────────────
export const useDetailProduct = (productId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["product", productId],
    enabled: Boolean(productId),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.PRODUCT.DETAIL(productId)
      );
      return response;
    },
  });

  return {
    product: data,
    isLoading,
    error,
    refetch,
  };
};

// ─── Tìm kiếm theo tên ────────────────────────────────────────────────────
export const useSearchProductsByTitle = (title) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productsByTitle", title],
    enabled: Boolean(title?.trim()),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_TITLE(title.trim())
      );
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Tìm kiếm theo giá ────────────────────────────────────────────────────
export const useSearchProductsByPrice = (price) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productsByPrice", price],
    enabled: Boolean(price),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_PRICE(Number(price))
      );
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Tìm kiếm theo khoảng giá ─────────────────────────────────────────────
export const useSearchProductsByPriceRange = (priceMin, priceMax) => {
  const enabled = Boolean(priceMin) && Boolean(priceMax) && Number(priceMin) <= Number(priceMax);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productsByPriceRange", priceMin, priceMax],
    enabled,
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_PRICE_RANGE(
          Number(priceMin),
          Number(priceMax)
        )
      );
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Tìm kiếm theo ID danh mục ────────────────────────────────────────────
export const useSearchProductsByCategoryId = (categoryId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productsByCategoryId", categoryId],
    enabled: Boolean(categoryId),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_CATEGORY_ID(Number(categoryId))
      );
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Tìm kiếm theo slug danh mục ──────────────────────────────────────────
export const useSearchProductsByCategorySlug = (categorySlug) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["productsByCategorySlug", categorySlug],
    enabled: Boolean(categorySlug?.trim()),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.FILTER_PRODUCT.FIND_BY_CATEGORY_SLUG(categorySlug.trim())
      );
      return response;
    },
  });

  return {
    products: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch,
  };
};

// ─── Thêm sản phẩm ────────────────────────────────────────────────────────
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProduct) => {
      const response = await rootApiService.post(
        API_ENDPOINTS.PRODUCT.CREATE,
        newProduct
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutation;
};

// ─── Cập nhật sản phẩm ────────────────────────────────────────────────────
export const useUpdateProduct = (productId) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedProduct) => {
      const response = await rootApiService.put(
        API_ENDPOINTS.PRODUCT.UPDATE(productId),
        updatedProduct
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });

  return mutation;
};

// ─── Xóa sản phẩm ─────────────────────────────────────────────────────────
export const useDeleteProduct = (productId) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await rootApiService.delete(
        API_ENDPOINTS.PRODUCT.DELETE(productId)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return mutation;
};
