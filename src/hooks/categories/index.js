import { useEffect, useState } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

export const useGetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(API_ENDPOINTS.CATEGORY.LIST);
      setCategories(response || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const refetch = fetchCategories;

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};

export const useDetailCategory = (categoryId) => {
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productsBelongToCategory, setProductsBelongToCategory] = useState([]);
  const [error, setError] = useState(null);

  const fetchProductsBelongToCategory = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await rootApiService.get(
        API_ENDPOINTS.CATEGORY.GET_ALL_PRODUCTS_BY_CATEGORY(id),
      );
      setProductsBelongToCategory(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async () => {
    if (!categoryId) {
      setCategory(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.CATEGORY.DETAIL(categoryId),
      );
      setCategory(response);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProductsBelongToCategory(categoryId);
  }, [categoryId]);

  const refetch = fetchCategory;

  return {
    category,
    productsBelongToCategory,
    isLoading,
    error,
    refetch,
  };
};

export const useCreateCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutateAsync = async (newCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.post(
        API_ENDPOINTS.CATEGORY.CREATE,
        newCategory,
      );
      setData(response);
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

export const useUpdateCategory = (categoryId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutateAsync = async (updatedCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.put(
        API_ENDPOINTS.CATEGORY.UPDATE(categoryId),
        updatedCategory,
      );
      setData(response);
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

export const useDeleteCategory = (categoryId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutateAsync = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.delete(
        API_ENDPOINTS.CATEGORY.DELETE(categoryId),
      );
      setData(response);
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

export const useGetCategoryBySlug = (slug) => {
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    if (!slug) {
      setCategory(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await rootApiService.get(
        API_ENDPOINTS.CATEGORY.SLUG(slug),
      );
      setCategory(response);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [slug]);

  const refetch = fetchCategory;

  return {
    category,
    isLoading,
    error,
    refetch,
  };
};
