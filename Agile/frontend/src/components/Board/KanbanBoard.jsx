import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from '../Kanban/Column';

const columnsInit = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Done', title: 'Done' }
];

const KanbanBoard = ({ tasks, onDeleteTask, onOpenTask, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full items-start p-6 overflow-x-auto">
        {columnsInit.map((column) => {
          // Kanban tasks are sorted by position
          const columnTasks = tasks
            .filter((t) => t.status === column.id)
            .sort((a, b) => a.position - b.position);
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              onDelete={onDeleteTask}
              onOpen={onOpenTask}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
