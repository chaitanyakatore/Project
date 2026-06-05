import React from 'react';
import { useGetProjectActivitiesQuery } from '../../services/apiSlice';
import { BarChart3, TrendingUp, CheckSquare, Clock, Users, Activity, PlayCircle, Milestone } from 'lucide-react';

const ProjectDashboard = ({ project, tasks, sprints }) => {
  const { data: activities, isLoading: isActLoading } = useGetProjectActivitiesQuery(project._id);

  // 1. Basic Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalStoryPoints = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const completedStoryPoints = tasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const spCompletionPercentage = totalStoryPoints > 0 ? Math.round((completedStoryPoints / totalStoryPoints) * 100) : 0;

  // 2. Active Sprint
  const activeSprint = sprints.find(s => s.status === 'Active');
  const activeSprintTasks = activeSprint ? tasks.filter(t => t.sprint === activeSprint._id) : [];
  const activeSprintSP = activeSprintTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const activeSprintCompletedSP = activeSprintTasks.filter(t => t.status === 'Done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
  const activeSprintProgress = activeSprintTasks.length > 0 
    ? Math.round((activeSprintTasks.filter(t => t.status === 'Done').length / activeSprintTasks.length) * 100) 
    : 0;

  // 3. Team Workload Calculation
  const workloadMap = {};
  
  // Initialize map with all project members
  if (project.owner) {
    workloadMap[project.owner._id || project.owner] = {
      name: `${project.owner.name} (Owner)`,
      email: project.owner.email,
      taskCount: 0,
      storyPoints: 0,
      completedSP: 0
    };
  }
  if (project.members) {
    project.members.forEach(m => {
      const user = m.user;
      if (user && user._id) {
        workloadMap[user._id] = {
          name: user.name,
          email: user.email,
          taskCount: 0,
          storyPoints: 0,
          completedSP: 0
        };
      }
    });
  }

  // Populate map with task assignments
  tasks.forEach(t => {
    if (t.assignee) {
      const assigneeId = t.assignee._id || t.assignee;
      if (workloadMap[assigneeId]) {
        workloadMap[assigneeId].taskCount += 1;
        workloadMap[assigneeId].storyPoints += (t.storyPoints || 0);
        if (t.status === 'Done') {
          workloadMap[assigneeId].completedSP += (t.storyPoints || 0);
        }
      }
    }
  });

  const workloadList = Object.values(workloadMap).sort((a, b) => b.storyPoints - a.storyPoints);

  // 4. Status Breakdown for custom Stacked Bar Chart
  const statusCounts = {
    'Backlog': 0,
    'To Do': 0,
    'In Progress': 0,
    'Code Review': 0,
    'Testing': 0,
    'Done': 0
  };
  tasks.forEach(t => {
    if (statusCounts[t.status] !== undefined) {
      statusCounts[t.status] += 1;
    }
  });

  // 5. Activity formatter helper
  const formatActivityText = (act) => {
    const userName = act.user ? act.user.name : 'Unknown User';
    const taskTitle = act.task ? `"${act.task.title}"` : 'a ticket';
    
    switch (act.action) {
      case 'TASK_CREATED':
        return `${userName} created task ${taskTitle}`;
      case 'TASK_STATUS_UPDATED':
        return `${userName} moved ${taskTitle} from ${act.details?.oldStatus || 'Backlog'} to ${act.details?.newStatus}`;
      case 'TASK_ASSIGNEE_UPDATED':
        return `${userName} reassigned ${taskTitle} to ${act.details?.newAssignee || 'Unassigned'}`;
      case 'TASK_DELETED':
        return `${userName} deleted task ${taskTitle}`;
      default:
        return `${userName} performed an action on ${taskTitle}`;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 overflow-y-auto h-full w-full">
      {/* Visual Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-2xl font-black text-slate-800">{completedTasks} / {totalTasks}</h3>
            <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${taskCompletionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Story Points Done</p>
            <h3 className="text-2xl font-black text-slate-800">{completedStoryPoints} / {totalStoryPoints} SP</h3>
            <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${spCompletionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sprint</p>
            <h3 className="text-xl font-black text-slate-800 truncate max-w-[160px]">{activeSprint ? activeSprint.name : 'None'}</h3>
            {activeSprint ? (
              <p className="text-xs text-green-600 font-bold mt-1">{activeSprintProgress}% Done ({activeSprintCompletedSP}/{activeSprintSP} SP)</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">No active sprint</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <Milestone size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sprints</p>
            <h3 className="text-2xl font-black text-slate-800">{sprints.length}</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{sprints.filter(s=>s.status==='Completed').length} Sprints Completed</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Status Breakdown + Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown Stacked Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={16} /> Work Item Status Distribution
            </h3>
          </div>
          
          {/* Custom SVG Distribution Chart */}
          <div className="space-y-4 pt-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              const barColor = 
                status === 'Done' ? 'bg-green-500' :
                status === 'Testing' ? 'bg-teal-500' :
                status === 'Code Review' ? 'bg-orange-500' :
                status === 'In Progress' ? 'bg-blue-500' :
                status === 'To Do' ? 'bg-indigo-500' : 'bg-slate-400';

              return (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">{status}</span>
                    <span className="text-slate-800">{count} tasks ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`${barColor} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workload Allocation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Users size={16} /> Team Workload Allocation
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {workloadList.map((worker, index) => {
              const workerSPPercentage = totalStoryPoints > 0 ? (worker.storyPoints / totalStoryPoints) * 100 : 0;
              return (
                <div key={index} className="space-y-1.5 border-b border-slate-55 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">{worker.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{worker.taskCount} tasks assigned</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {worker.storyPoints} SP
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${workerSPPercentage}%` }}></div>
                  </div>
                </div>
              );
            })}
            {workloadList.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-10">No assignees allocated to project yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Burn-down simulation + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Burn-down Chart (SVG-based) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp size={16} /> Burn-Down & Velocity Area Chart
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-semibold">Simulated area progression of remaining vs guideline story points.</p>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="relative w-full h-44 border-b border-l border-slate-200 p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Guidelines diagonal */}
              <line x1="0" y1="10" x2="100" y2="90" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3,3" />
              
              {/* Remaining points area */}
              <path 
                d={`M 0 10 L 20 20 L 40 35 L 60 30 L 80 65 L 100 ${100 - spCompletionPercentage} L 100 100 L 0 100 Z`}
                fill="rgba(147, 51, 234, 0.08)"
                stroke="#a855f7"
                strokeWidth="1.5"
              />
              
              {/* Legend points */}
              <circle cx="0" cy="10" r="1.5" fill="#a855f7" />
              <circle cx="20" cy="20" r="1.5" fill="#a855f7" />
              <circle cx="40" cy="35" r="1.5" fill="#a855f7" />
              <circle cx="60" cy="30" r="1.5" fill="#a855f7" />
              <circle cx="80" cy="65" r="1.5" fill="#a855f7" />
              <circle cx="100" cy={100 - spCompletionPercentage} r="1.5" fill="#a855f7" />
            </svg>
            
            <div className="absolute top-2 right-2 flex flex-col gap-1 text-[9px] font-bold text-slate-400">
              <div className="flex items-center gap-1"><span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span> Remaining SP</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 border-b border-dashed border-slate-400 inline-block"></span> Guide Target</div>
            </div>
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
            <span>Start</span>
            <span>Day 5</span>
            <span>Day 10</span>
            <span>End</span>
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity size={16} /> Recent Activity Timeline
          </h3>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {!isActLoading && activities && activities.length > 0 ? (
              activities.map((act) => (
                <div key={act._id} className="flex gap-3 items-start border-l-2 border-slate-100 pl-4 relative pb-2 last:pb-0">
                  {/* Timeline point indicator */}
                  <div className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border-2 border-white"></div>
                  
                  <div className="flex-1">
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      {formatActivityText(act)}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold">
                      <Clock size={10} /> {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-12">No recent activities logged for this project.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
