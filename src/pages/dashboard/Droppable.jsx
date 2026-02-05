import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableChartItem from "../../components/ui/SortableChartItem";

function Droppable({ charts = [], isDark }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  let gridCols = "grid-cols-1";
  if (charts.length === 2) gridCols = "grid-cols-2";
  if (charts.length >= 3) gridCols = "grid-cols-2";

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full border-2 rounded-xl p-2 transition-all 
      ${isOver ? "border-green-500" : "border-indigo-600"}
      `}
    >
      {charts.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Thả biểu đồ vào đây
        </div>
      ) : (
        <SortableContext
          items={charts.filter(Boolean).map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={`grid ${gridCols} gap-4`}>
            {charts.filter(Boolean).map((chart) => (
              <SortableChartItem
                key={chart.id}
                id={chart.id}
                chart={chart}
                isDark={isDark}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
export default Droppable;
