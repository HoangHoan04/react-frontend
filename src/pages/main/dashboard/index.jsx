import { useDashboardStore, useThemeStore, useToastStore } from "@/stores";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import Chart from "../../../components/ui/Chart";
import ChoiceChart from "./ChoiceChart";
import Droppable from "./Droppable";

const DashboardPage = () => {
  // get state
  const theme = useThemeStore((state) => state.theme);
  const chartType = useDashboardStore((state) => state.selectedChart);
  const { setIsVisible } = useDashboardStore();
  const showToast = useToastStore((state) => state.showToast);

  const isDark = theme === "dark";

  const [activeId, setActiveId] = useState(null);
  const [droppedCharts, setDroppedCharts] = useState([]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleRemoveChart = (chartId) => {
    setDroppedCharts((prev) => prev.filter((chart) => chart.id !== chartId));
    showToast({
      message: "Xóa biểu đồ thành công!",
      type: "success",
      title: "Xóa biểu đồ",
    });
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const overId = over.id;
    const isNewChart = active.id === "drag-map";
    let addedNewChart = false;
    let reachedLimit = false;

    setDroppedCharts((prev) => {
      if (isNewChart && prev.length >= 4) {
        reachedLimit = true;
        return prev;
      }

      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const overIndex = prev.findIndex((c) => c.id === overId);

      if (isNewChart) {
        addedNewChart = true;
        const newChart = {
          id: Date.now().toString(),
          type: chartType,
          data: [
            { name: "Chrome", value: 45 },
            { name: "Firefox", value: 25 },
            { name: "Safari", value: 15 },
            { name: "Edge", value: 10 },
            { name: "Other", value: 5 },
          ],
        };

        if (overId === "droppable") {
          return [...prev, newChart];
        }

        if (overIndex >= 0) {
          const next = [...prev];
          next.splice(overIndex, 0, newChart);
          return next;
        }

        return prev;
      }

      if (oldIndex === -1 || overId === "droppable" || overIndex === -1) {
        return prev;
      }

      if (oldIndex === overIndex) {
        return prev;
      }

      return arrayMove(prev, oldIndex, overIndex);
    });

    if (reachedLimit) {
      showToast({
        message: "Bạn chỉ có thể thêm tối đa 4 biểu đồ!",
        type: "error",
        title: "Lỗi thêm biểu đồ",
      });
    } else if (addedNewChart) {
      showToast({
        message: "Thêm biểu đồ thành công!",
        type: "success",
        title: "Thêm biểu đồ",
      });
      setIsVisible(false);
    }

    setActiveId(null);
  };
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={`w-full h-full  p-4 border border-black rounded-lg relative `}
      >
        <div className="flex gap-1 h-full">
          <ChoiceChart isDark={isDark} />
          <Droppable
            charts={droppedCharts}
            isDark={isDark}
            onRemoveChart={handleRemoveChart}
          />
        </div>
      </div>

      <DragOverlay>
        {activeId === "drag-map" ? (
          <Chart
            type={chartType}
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
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardPage;
