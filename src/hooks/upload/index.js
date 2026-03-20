import { useState } from "react";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutateAsync = async (file) => {
    if (!file) {
      const err = new Error("Vui long chon file");
      setError(err);
      throw err;
    }

    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await rootApiService.post(
        API_ENDPOINTS.FILES.UPLOAD_FILE,
        formData,
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
