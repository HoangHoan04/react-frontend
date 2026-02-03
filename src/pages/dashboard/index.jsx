import { DndContext, DragOverlay } from "@dnd-kit/core";
import Droppable from "./Droppable";
import ChoiceMap from "./ChoiceMap";
import { useState } from "react";

const DashboardPage = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [activeId, setActiveId] = useState(null);
  const [overDrop, setOverDrop] = useState(false);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { delta, over } = event;
    if (!over || over.id !== "droppable") {
      setActiveId(null);
      return;
    }

    setPos((prev) => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));

    setActiveId(null);
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
      <div className="dashboard-page w-5/6 h-full bg-[var(--bg-main)] pl-4 pt-4 border border-black rounded-lg relative">
        <div className="flex gap-1">
          <ChoiceMap position={pos} overDrop={overDrop} />
          <Droppable />
        </div>
      </div>

      {/* Draggable “bay tự do” khi kéo */}
      <DragOverlay>
        {activeId ? (
          <button className="px-3 py-2 bg-green-400 rounded-lg">Drag me</button>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DashboardPage;
