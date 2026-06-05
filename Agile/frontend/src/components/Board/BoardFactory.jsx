import React from 'react';
import KanbanBoard from './KanbanBoard';
import ScrumBoard from './ScrumBoard';

const BoardFactory = ({
  project,
  tasks,
  sprints,
  onDeleteTask,
  onOpenTask,
  onCreateTask,
  onUpdateTask,
  onDragEnd,
  onCreateSprint,
  onUpdateSprint,
  onDeleteSprint
}) => {
  const type = project.projectType || 'Kanban';

  switch (type) {
    case 'Scrum':
      return (
        <ScrumBoard
          project={project}
          tasks={tasks}
          sprints={sprints}
          onDeleteTask={onDeleteTask}
          onOpenTask={onOpenTask}
          onCreateTask={onCreateTask}
          onUpdateTask={onUpdateTask}
          onDragEnd={onDragEnd}
          onCreateSprint={onCreateSprint}
          onUpdateSprint={onUpdateSprint}
          onDeleteSprint={onDeleteSprint}
        />
      );
    case 'Kanban':
    default:
      return (
        <KanbanBoard
          tasks={tasks}
          onDeleteTask={onDeleteTask}
          onOpenTask={onOpenTask}
          onDragEnd={onDragEnd}
        />
      );
  }
};

export default BoardFactory;
