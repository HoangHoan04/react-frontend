import { useDashboardStore, useThemeStore, useToastStore } from "@/stores";
import StatsCard from "../../../components/ui/StatsCard";
import ChartSection from "../../../components/ui/ChartSection";
import { useGetProducts } from "../../../hooks";
import { TopExpensiveProducts } from "../../../components/ui/TopExpensiveProducts";
import useStats from "../../../hooks/dasboard";

const DashboardPage = () => {
  const theme = useThemeStore((state) => state.theme);

  const statsLog = useStats();

  const { products, isLoading, error } = useGetProducts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <StatsCard theme={theme} stats={statsLog.stats} />

      <ChartSection products={products} theme={theme} />

      <TopExpensiveProducts products={products} theme={theme} />
    </div>
  );
};

export default DashboardPage;
