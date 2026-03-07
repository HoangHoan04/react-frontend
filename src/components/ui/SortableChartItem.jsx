import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Chart from "../../components/ui/Chart";

export default function SortableChartItem({ id, chart, isDark }) {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log(chart);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full h-80 bg-white dark:bg-gray-800 p-2 rounded-xl shadow relative"
    >
      <div
        {...listeners}
        {...attributes}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 rounded bg-gray-200 dark:bg-gray-700"
      >
        <i className="pi pi-equals"></i>
      </div>

      <Chart
        type={chart.type}
        isDark={isDark}
        small={false}
        data={[
          { name: "Chrome", value: 45 },
          { name: "Firefox", value: 25 },
          { name: "Safari", value: 15 },
          { name: "Edge", value: 10 },
          { name: "Other", value: 5 },
        ]}
      />
    </div>
  );
}
