import { useThemeStore } from "@/stores";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import Chart from "../../components/ui/Chart";
import ChoiceChart from "./ChoiceChart";
import Droppable from "./Droppable";

const DashboardPage = () => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [overDrop, setOverDrop] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [droppedCharts, setDroppedCharts] = useState([]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { delta, over, active } = event;
    if (!over || over.id !== "droppable") {
      setActiveId(null);
      return;
    }

    setPos((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));

    if (over.id === "droppable") {
      setDroppedCharts((prev) => {
        const exists = prev.some((c) => c.id === active.id);

        if (!exists) {
          return [
            ...prev,
            {
              // id: active.id,
              id: Date.now().toString(),
              type: "bar",
              data: [
                { name: "Chrome", value: 45 },
                { name: "Firefox", value: 25 },
                { name: "Safari", value: 15 },
                { name: "Edge", value: 10 },
                { name: "Other", value: 5 },
              ],
            },
          ];
        }

        // Nếu đã tồn tại → reorder
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);

        // nếu over là droppable (không phải item), thì không reorder
        if (newIndex === -1) return prev;

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };
  const handleDragOver = (event) => {
    setOverDrop(event.over?.id === "droppable");
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div
        className={`dashboard-page w-full h-full  p-4 border border-black rounded-lg relative ${isDark ? "bg-gray-900" : "bg-[var(--bg-main)]"}`}
      >
        <div className="flex gap-1 h-full">
          <ChoiceChart
            position={pos}
            overDrop={overDrop}
            isDark={isDark}
            activeId={activeId}
          />
          <Droppable charts={droppedCharts} isDark={isDark} />
        </div>
      </div>

      <DragOverlay>
        {activeId === "drag-map" ? (
          <Chart
            type="bar"
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
