import CategoryDistributionChart from "./CategoryDistributionChart";
import PriceAllocationChart from "./PriceAllocationChart";

const ChartSection = ({ products, theme }) => {
  return (
    <div className="flex h-[500px] items-center justify-between mt-6 gap-3">
      <div
        className={`w-[60%] h-full ${theme === "dark" ? "bg-[#1f1f1f]" : "bg-white"} p-4 rounded-lg shadow border dark:border-gray-700`}
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Phân bố sản phẩm theo danh mục
        </h3>
        <CategoryDistributionChart products={products} theme={theme} />
      </div>

      <div
        className={`w-[40%] h-full ${theme === "dark" ? "bg-[#1f1f1f]" : "bg-white"} p-4 rounded-lg shadow border dark:border-gray-700`}
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Phân bố giá sản phẩm
        </h3>
        <PriceAllocationChart products={products} theme={theme} />
      </div>
    </div>
  );
};

export default ChartSection;
