import { useDraggable } from "@dnd-kit/core";

const ChartDraggableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab w-full h-full flex items-center justify-center"
    >
      {children}
    </div>
  );
};

export default ChartDraggableItem;
