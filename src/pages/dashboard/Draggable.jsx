import { useDraggable } from "@dnd-kit/core";

const Draggable = ({ id, children, position, overDrop }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: overDrop ? "scale(9)" : "scale(1)",
        transition: "transform 0.2s ease",
      }}
    >
      {children}
    </div>
  );
};

export default Draggable;
