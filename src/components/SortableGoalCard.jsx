import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GoalCard from './GoalCard';

export default function SortableGoalCard({ id, goal, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          cursor: 'grab',
          padding: '4px 6px',
          color: '#888',
          fontSize: 18,
          lineHeight: 1,
          zIndex: 2,
        }}
        title="Drag to reorder"
      >
        ⠿
      </div>
      <div onPointerDown={(e) => e.stopPropagation()} onClick={onClick}>
        <GoalCard goal={goal} />
      </div>
    </div>
  );
}
