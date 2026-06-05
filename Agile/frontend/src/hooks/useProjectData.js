import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError(err.response?.data?.message || 'Failed to load project');
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, [projectId]);

  const fetchSprints = useCallback(async () => {
    try {
      const { data } = await api.get(`/sprints/project/${projectId}`);
      setSprints(data);
    } catch (err) {
      console.error('Failed to fetch sprints:', err);
    }
  }, [projectId]);

  const initData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchProject(), fetchTasks(), fetchSprints()]);
    setLoading(false);
  }, [fetchProject, fetchTasks, fetchSprints]);

  useEffect(() => {
    if (projectId) {
      initData();
    }
  }, [projectId, initData]);

  // Unified drag end handler supporting both Column drags and Backlog/Sprint drags
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskToMove = tasks.find((t) => t._id === draggableId);
    if (!taskToMove) return;

    // Check if dragging on the Board (status columns)
    const isBoardDrag = ['To Do', 'In Progress', 'Done'].includes(source.droppableId);

    if (isBoardDrag) {
      // Re-order within status columns
      const newTasks = Array.from(tasks);
      const destTasks = newTasks.filter(t => t.status === destination.droppableId).sort((a, b) => a.position - b.position);
      const filteredDestTasks = destTasks.filter(t => t._id !== draggableId);
      filteredDestTasks.splice(destination.index, 0, taskToMove);

      // Calculate position
      let newPosition = 1024;
      if (filteredDestTasks.length === 1) {
        newPosition = 1024;
      } else if (destination.index === 0) {
        newPosition = filteredDestTasks[1].position / 2;
      } else if (destination.index === filteredDestTasks.length - 1) {
        newPosition = filteredDestTasks[filteredDestTasks.length - 2].position + 1024;
      } else {
        const prevPos = filteredDestTasks[destination.index - 1].position;
        const nextPos = filteredDestTasks[destination.index + 1].position;
        newPosition = (prevPos + nextPos) / 2;
      }

      // Optimistic update
      const updatedTask = { ...taskToMove, status: destination.droppableId, position: newPosition };
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));

      try {
        await api.put(`/tasks/${draggableId}`, {
          status: destination.droppableId,
          position: newPosition
        });
      } catch (err) {
        console.error('Failed to update task status/position', err);
        fetchTasks(); // revert on failure
      }
    } else {
      // Backlog & Sprints drag (source.droppableId and destination.droppableId are either 'backlog' or a sprint ID)
      const destSprintId = destination.droppableId === 'backlog' ? null : destination.droppableId;
      
      // Re-order within sprint/backlog lists
      const newTasks = Array.from(tasks);
      const destTasks = newTasks.filter(t => t.sprint === destSprintId).sort((a, b) => a.position - b.position);
      const filteredDestTasks = destTasks.filter(t => t._id !== draggableId);
      filteredDestTasks.splice(destination.index, 0, taskToMove);

      // Calculate position
      let newPosition = 1024;
      if (filteredDestTasks.length === 1) {
        newPosition = 1024;
      } else if (destination.index === 0) {
        newPosition = filteredDestTasks[1].position / 2;
      } else if (destination.index === filteredDestTasks.length - 1) {
        newPosition = filteredDestTasks[filteredDestTasks.length - 2].position + 1024;
      } else {
        const prevPos = filteredDestTasks[destination.index - 1].position;
        const nextPos = filteredDestTasks[destination.index + 1].position;
        newPosition = (prevPos + nextPos) / 2;
      }

      // Optimistic update
      const updatedTask = { ...taskToMove, sprint: destSprintId, position: newPosition };
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));

      try {
        await api.put(`/tasks/${draggableId}`, {
          sprint: destSprintId,
          position: newPosition
        });
      } catch (err) {
        console.error('Failed to update task sprint/position', err);
        fetchTasks(); // revert on failure
      }
    }
  };

  const createTask = async (taskData) => {
    try {
      const { data } = await api.post(`/tasks/project/${projectId}`, taskData);
      setTasks(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId, updateFields) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, updateFields);
      setTasks(prev => prev.map(t => t._id === taskId ? data : t));
      return data;
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  const createSprint = async (sprintData) => {
    try {
      const { data } = await api.post(`/sprints/project/${projectId}`, sprintData);
      setSprints(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to create sprint:', err);
      throw err;
    }
  };

  const updateSprint = async (sprintId, sprintData) => {
    try {
      const { data } = await api.put(`/sprints/${sprintId}`, sprintData);
      setSprints(prev => prev.map(s => s._id === sprintId ? data : s));
      // Reload tasks because completing a sprint can change task sprint association to null
      if (sprintData.status === 'Completed') {
        fetchTasks();
      }
      return data;
    } catch (err) {
      console.error('Failed to update sprint:', err);
      throw err;
    }
  };

  const deleteSprint = async (sprintId) => {
    try {
      await api.delete(`/sprints/${sprintId}`);
      setSprints(prev => prev.filter(s => s._id !== sprintId));
      fetchTasks(); // Tasks returned to backlog
    } catch (err) {
      console.error('Failed to delete sprint:', err);
      throw err;
    }
  };

  return {
    project,
    tasks,
    sprints,
    loading,
    error,
    handleDragEnd,
    createTask,
    updateTask,
    deleteTask,
    createSprint,
    updateSprint,
    deleteSprint,
    refreshTasks: fetchTasks,
    refreshSprints: fetchSprints
  };
};
