import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableGroup({ id, children, dragHandleProps }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handle = dragHandleProps ? { ...listeners, ...dragHandleProps } : null;

  return (
    <div ref={setNodeRef} style={style} className="goal-group sortable-group" {...attributes}>
      {children(handle)}
    </div>
  );
}
