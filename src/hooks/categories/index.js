import { useMutation, useQuery } from "@tanstack/react-query";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

export const useGetCategories = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await rootApiService.get(API_ENDPOINTS.CATEGORY.LIST);
      return response;
    },
  });

  return {
    categories: data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useDetailCategory = (categoryId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["category", categoryId],
    enabled: Boolean(categoryId),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.CATEGORY.DETAIL(categoryId),
      );
      return response;
    },
  });
  return {
    category: data,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateCategory = () => {
  const mutation = useMutation({
    mutationFn: async (newCategory) => {
      const response = await rootApiService.post(
        API_ENDPOINTS.CATEGORY.CREATE,
        newCategory,
      );
      return response;
    },
  });

  return mutation;
};

export const useUpdateCategory = (categoryId) => {
  const mutation = useMutation({
    mutationFn: async (updatedCategory) => {
      const response = await rootApiService.put(
        API_ENDPOINTS.CATEGORY.UPDATE(categoryId),
        updatedCategory,
      );
      return response;
    },
  });

  return mutation;
};

export const useDeleteCategory = (categoryId) => {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await rootApiService.delete(
        API_ENDPOINTS.CATEGORY.DELETE(categoryId),
      );

      return response;
    },
  });

  return mutation;
};

export const useGetProductsByCategory = (categoryId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categoryProducts", categoryId],
    enabled: Boolean(categoryId),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.CATEGORY.GET_ALL_PRODUCTS_BY_CATEGORY(categoryId),
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

export const useGetCategoryBySlug = (slug) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["categoryBySlug", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const response = await rootApiService.get(
        API_ENDPOINTS.CATEGORY.SLUG(slug),
      );
      return response;
    },
  });

  return {
    category: data,
    isLoading,
    error,
    refetch,
  };
};
