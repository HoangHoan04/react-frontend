import { useLoadingStore } from "@/stores";
import Lottie from "lottie-react";
import { loading } from "../../assets/animations";

export const LoadingRenderer = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="w-52 h-52">
        <Lottie animationData={loading} loop />
      </div>

      <span className="mt-4 text-xl font-semibold text-white">
        Đang tải dữ liệu...
      </span>
    </div>
  );
};
