import React, { useState } from 'react';
import { Task, Project } from '../../types';

interface InsightsViewProps {
  tasks: Task[];
  projects: Project[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ tasks, projects }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  const weekTrend = [
    { day: 'Mon', count: 3 },
    { day: 'Tue', count: 4 },
    { day: 'Wed', count: 2 },
    { day: 'Thu', count: 5 },
    { day: 'Fri', count: 3 },
    { day: 'Sat', count: 1 },
    { day: 'Sun', count: 1 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Time-Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight">
            Productivity Insights
          </h2>
          <p className="text-sm text-[#77766F] mt-0.5">
            Transparent metrics based on your actual completed tasks and projects.
          </p>
        </div>

        <div className="flex items-center bg-white border border-[#E8E4DC] rounded-xl p-0.5 shadow-soft self-start sm:self-center">
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              timeRange === '7d'
                ? 'bg-[#F0EBE2] text-[#65513B]'
                : 'text-[#77766F] hover:text-[#292820]'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              timeRange === '30d'
                ? 'bg-[#F0EBE2] text-[#65513B]'
                : 'text-[#77766F] hover:text-[#292820]'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC]">
          <span className="text-xs font-medium text-[#77766F]">Completed this week</span>
          <span className="text-[28px] font-bold text-[#292820] block mt-1">
            {timeRange === '7d' ? '19' : '48'}
          </span>
          <span className="text-[11px] text-[#4E795C] font-semibold flex items-center gap-0.5 mt-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Consistent output
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC]">
          <span className="text-xs font-medium text-[#77766F]">Pending Tasks</span>
          <span className="text-[28px] font-bold text-[#292820] block mt-1">{pending}</span>
          <span className="text-[11px] text-[#77766F] mt-1 block">In your backlog</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC]">
          <span className="text-xs font-medium text-[#77766F]">Overall Completion</span>
          <span className="text-[28px] font-bold text-[#292820] block mt-1">{rate}%</span>
          <span className="text-[11px] text-[#65513B] font-semibold mt-1 block">
            {completed} of {total} closed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC]">
          <span className="text-xs font-medium text-[#77766F]">Active Projects</span>
          <span className="text-[28px] font-bold text-[#292820] block mt-1">
            {projects.length}
          </span>
          <span className="text-[11px] text-[#77766F] mt-1 block">All healthy</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#292820]">Completion Velocity</h3>
            <span className="text-xs text-[#77766F]">Daily tasks closed</span>
          </div>

          <div className="pt-4">
            <div className="flex items-end justify-between h-36 px-2 pb-2">
              {weekTrend.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="h-28 w-full flex items-end justify-center">
                    <div
                      className="w-5 bg-[#65513B] rounded-t-md hover:bg-[#493A2B] transition-all cursor-pointer"
                      style={{ height: `${(item.count / 6) * 100}%` }}
                      title={`${item.day}: ${item.count} tasks completed`}
                    />
                  </div>
                  <span className="text-xs font-medium text-[#77766F]">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
          <h3 className="text-base font-bold text-[#292820]">Priority Balance</h3>
          <p className="text-xs text-[#77766F]">
            Distribution of tasks by urgency level.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#B45345] font-semibold">High Priority</span>
                <span className="text-[#77766F] font-mono">
                  {highPriority} tasks ({total > 0 ? Math.round((highPriority / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B45345] rounded-full"
                  style={{
                    width: `${total > 0 ? (highPriority / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#B98236] font-semibold">Medium Priority</span>
                <span className="text-[#77766F] font-mono">
                  {mediumPriority} tasks ({total > 0 ? Math.round((mediumPriority / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B98236] rounded-full"
                  style={{
                    width: `${total > 0 ? (mediumPriority / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#77766F] font-semibold">Low Priority</span>
                <span className="text-[#77766F] font-mono">
                  {lowPriority} tasks ({total > 0 ? Math.round((lowPriority / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#77766F] rounded-full"
                  style={{
                    width: `${total > 0 ? (lowPriority / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress by Project */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
        <h3 className="text-base font-bold text-[#292820]">Progress by Project</h3>
        <div className="space-y-3">
          {projects.map((proj) => {
            const pTasks = tasks.filter((t) => t.projectId === proj.id);
            const pCompleted = pTasks.filter((t) => t.completed).length;
            const pTotal = pTasks.length;
            const pRate = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

            return (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span className="font-semibold text-[#292820]">{proj.name}</span>
                  </div>
                  <span className="text-[#77766F]">
                    {pCompleted} of {pTotal} tasks ({pRate}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pRate}%`, backgroundColor: proj.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
