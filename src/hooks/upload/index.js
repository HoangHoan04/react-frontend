import { useMutation } from "@tanstack/react-query";
import rootApiService from "../../services/api.service";
import { API_ENDPOINTS } from "../../services/endpoint";

export const useUploadFile = () => {
  const mutation = useMutation({
    mutationFn: async (file) => {
      if (!file) throw new Error("Vui long chon file");

      const formData = new FormData();
      formData.append("file", file);

      const response = await rootApiService.post(
        API_ENDPOINTS.FILES.UPLOAD_FILE,
        formData,
      );

      return response;
    },
  });

  return mutation;
};
