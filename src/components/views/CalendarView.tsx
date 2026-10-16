import React, { useState } from 'react';
import { Task } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenTaskModalWithDate: (date: string) => void;
}

type CalendarMode = 'month' | 'week' | 'agenda';

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onSelectTask,
  onOpenTaskModalWithDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState<CalendarMode>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Navigate
  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in month grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = totalDaysInPrevMonth - i;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ day: d, isCurrentMonth: false, dateStr });
  }

  // Current month days
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, isCurrentMonth: true, dateStr });
  }

  // Next month leading days (to complete 35 or 42 grid cells)
  const remaining = 35 - calendarDays.length > 0 ? 35 - calendarDays.length : 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const dateStr = `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, isCurrentMonth: false, dateStr });
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // Agenda view items (sorted by date)
  const scheduledTasks = tasks
    .filter((t) => t.dueDate)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Calendar Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-[#292820] tracking-tight">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-1 bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl p-0.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous month"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#77766F] hover:text-[#292820] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 h-8 flex items-center justify-center rounded-lg hover:bg-white text-xs font-semibold text-[#292820] cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next month"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#77766F] hover:text-[#292820] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                mode === 'month'
                  ? 'bg-white text-[#65513B] shadow-soft'
                  : 'text-[#77766F] hover:text-[#292820]'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                mode === 'agenda'
                  ? 'bg-white text-[#65513B] shadow-soft'
                  : 'text-[#77766F] hover:text-[#292820]'
              }`}
            >
              Agenda List
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenTaskModalWithDate(todayStr)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Month View Grid */}
      {mode === 'month' && (
        <div className="bg-white rounded-2xl shadow-soft border border-[#E8E4DC] overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#E8E4DC] bg-[#FDFCFB] text-center text-xs font-bold text-[#77766F] py-2.5">
            {daysOfWeek.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-[#E8E4DC]/60">
            {calendarDays.map((cell, idx) => {
              const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
              const isToday = cell.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  onClick={() => onOpenTaskModalWithDate(cell.dateStr)}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors hover:bg-[#F7F5F0]/60 cursor-pointer ${
                    !cell.isCurrentMonth ? 'bg-[#FAF8F5]/60 text-[#77766F]/60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#65513B] text-white'
                          : cell.isCurrentMonth
                          ? 'text-[#292820]'
                          : 'text-[#77766F]/60'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[10px] text-[#77766F] font-mono hidden sm:inline">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task chips in date cell */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto no-scrollbar">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(task);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[11px] truncate font-medium transition-colors cursor-pointer ${
                          task.completed
                            ? 'bg-[#EBF2EB] text-[#4E795C] line-through'
                            : task.priority === 'high'
                            ? 'bg-[#FAECEB] text-[#B45345]'
                            : 'bg-[#F0EBE2] text-[#65513B]'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10px] text-[#77766F] block text-center">
                        +{dayTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda List View */}
      {mode === 'agenda' && (
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
          <h3 className="text-base font-bold text-[#292820]">Scheduled Agenda</h3>
          {scheduledTasks.length > 0 ? (
            <div className="divide-y divide-[#E8E4DC]/60">
              {scheduledTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="py-3 flex items-center justify-between hover:bg-[#F7F5F0] px-3 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <span
                      className={`text-sm font-semibold block ${
                        task.completed ? 'line-through text-[#77766F]' : 'text-[#292820]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-xs text-[#77766F] mt-0.5 block">
                      Date: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                      task.priority === 'high'
                        ? 'bg-[#FAECEB] text-[#B45345]'
                        : 'bg-[#F0EBE2] text-[#65513B]'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#77766F]">No tasks with scheduled dates.</p>
          )}
        </div>
      )}
    </div>
  );
};
