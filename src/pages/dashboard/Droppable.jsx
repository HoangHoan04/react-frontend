import { useDroppable } from "@dnd-kit/core";

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-indigo-600 w-full h-96 flex items-center justify-center"
    >
      {props.children}
      thả vào đây
    </div>
  );
}
export default Droppable;
