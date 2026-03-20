import { useState } from "react";
import SelectOption from "../../../components/common/SelectOption";
import Chart from "../../../components/ui/Chart";
import PopupDateRangePicker from "../../../components/ui/PopupDateRangePicker";
import { useDashboardStore } from "../../../stores";
import ChartDraggableItem from "./Draggable";

const ChoiceChart = ({ isDark }) => {
  const {
    selectedChart,
    setSelectedChart,
    data,
    setData,
    isVisible,
    setIsVisible,
  } = useDashboardStore();
  const [selectedTable, setSelectedTable] = useState("none");
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  return (
    <section className="w-2/6 p-2">
      <div className="py-2">
        <h2
          className={`text-xl font-bold  ${isDark ? "text-white" : "text-black"}`}
        >
          Loại biểu đồ
        </h2>
        <div className="flex justify-between items-center">
          <button
            className={`p-2 rounded-lg hover:cursor-pointer border ${isDark ? "border-gray-600" : "border-white"} hover:border-gray-600 ${selectedChart === "bar" ? (isDark ? "bg-gray-700" : "bg-gray-200") : ""}`}
            onClick={() => setSelectedChart("bar")}
          >
            <img src="/chart/column_chart.png" className="inline-block mr-2" />
          </button>
          <button
            className={`p-2 rounded-lg hover:cursor-pointer border ${isDark ? "border-gray-600" : "border-white"} hover:border-gray-600 ${selectedChart === "line" ? (isDark ? "bg-gray-700" : "bg-gray-200") : ""}`}
            onClick={() => setSelectedChart("line")}
          >
            <img src="/chart/line_chart.png" className="inline-block mr-2" />
          </button>
          <button
            className={`p-2 rounded-lg hover:cursor-pointer border ${isDark ? "border-gray-600" : "border-white"} hover:border-gray-600 ${selectedChart === "pie" ? (isDark ? "bg-gray-700" : "bg-gray-200") : ""}`}
            onClick={() => setSelectedChart("pie")}
          >
            <img src="/chart/pie_chart.png" className="inline-block mr-2" />
          </button>
        </div>
      </div>

      <div className="my-4">
        <h2 className="text-xl font-bold">Chọn Bảng</h2>
        <SelectOption
          options={[
            { value: "san-pham", label: "Sản Phẩm" },
            { value: "nguoi-dung", label: "Người Dùng" },
            { value: "the-loai", label: "Thể Loại" },
          ]}
          onChange={(option) => {
            setSelectedTable(option.value);
          }}
          isDark={isDark}
        />
      </div>

      <div className="my-4">
        <h2 className="text-xl font-bold mb-2">Chọn Khoảng Thời Gian</h2>
        <PopupDateRangePicker isDark={isDark} setDateRange={setDateRange} />
      </div>

      <div className="flex justify-center">
        <button
          className=" mt-4 mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:cursor-pointer"
          onClick={() => setIsVisible(true)}
        >
          Xác nhận
        </button>
      </div>

      {isVisible && (
        <div className="w-full h-52 border-black border-2 border-dashed mt-4 rounded-2xl relative overflow-hidden">
          <ChartDraggableItem id="drag-map">
            <Chart
              type={selectedChart}
              isDark={isDark}
              small={true}
              data={[
                { name: "Chrome", value: 45 },
                { name: "Firefox", value: 25 },
                { name: "Safari", value: 15 },
                { name: "Edge", value: 10 },
                { name: "Other", value: 5 },
              ]}
            />
          </ChartDraggableItem>
        </div>
      )}
    </section>
  );
};

export default ChoiceChart;
