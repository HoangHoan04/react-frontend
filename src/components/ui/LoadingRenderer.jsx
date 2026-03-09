import { useLoadingStore } from "@/stores";
import GlobalLoading from "./Loading";

export const LoadingRenderer = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return <GlobalLoading />;
};
