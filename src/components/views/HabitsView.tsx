import React, { useState } from 'react';
import { Habit, Goal, Project } from '../../types';

interface HabitsViewProps {
  habits: Habit[];
  goals: Goal[];
  projects: Project[];
  onToggleHabitToday: (habitId: string) => void;
  onCreateHabit: (habit: Partial<Habit>) => void;
  onCreateGoal: (goal: Partial<Goal>) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  goals,
  projects,
  onToggleHabitToday,
  onCreateHabit,
  onCreateGoal,
}) => {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // New habit form
  const [habitTitle, setHabitTitle] = useState('');
  const [targetDays, setTargetDays] = useState(5);
  const [habitColor, setHabitColor] = useState('#65513B');

  // New goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [progress, setProgress] = useState(0);
  const [goalProjectId, setGoalProjectId] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to generate last 7 days strings
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 6,
    };
  });

  const handleHabitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (habitTitle.trim()) {
      onCreateHabit({
        title: habitTitle.trim(),
        targetDaysPerWeek: targetDays,
        color: habitColor,
      });
      setHabitTitle('');
      setIsHabitModalOpen(false);
    }
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goalTitle.trim()) {
      onCreateGoal({
        title: goalTitle.trim(),
        targetDate: targetDate || undefined,
        progress,
        projectId: goalProjectId || undefined,
      });
      setGoalTitle('');
      setTargetDate('');
      setProgress(0);
      setIsGoalModalOpen(false);
    }
  };

  const getProject = (pId?: string) => projects.find((p) => p.id === pId);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Habits Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#292820] tracking-tight">
              Daily Habits
            </h2>
            <p className="text-xs sm:text-sm text-[#77766F] mt-0.5">
              Build consistent routines and track your weekly completion rhythm.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsHabitModalOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer self-start sm:self-center"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Habit</span>
          </button>
        </div>

        {/* Habits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(todayStr);

            return (
              <div
                key={habit.id}
                className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC] flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-bold text-[#292820] block truncate">
                      {habit.title}
                    </span>
                    <span className="text-xs text-[#77766F]">
                      Target: {habit.targetDaysPerWeek} days / week
                    </span>
                  </div>

                  {/* Streak pill */}
                  <div className="flex items-center gap-1 bg-[#FDF4E7] text-[#B98236] border border-[#F5E0C2] px-2 py-0.5 rounded-full text-xs font-bold shrink-0">
                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                    <span>{habit.streak}d streak</span>
                  </div>
                </div>

                {/* 7-Day Completion Bubbles */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DC]/60">
                  <div className="flex items-center gap-1.5">
                    {last7Days.map((day) => {
                      const done = habit.completedDates.includes(day.dateStr);
                      return (
                        <div key={day.dateStr} className="flex flex-col items-center gap-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              done
                                ? 'bg-[#4E795C] text-white'
                                : day.isToday
                                ? 'border-2 border-dashed border-[#65513B] text-[#65513B]'
                                : 'bg-[#F0EBE2] text-[#77766F]'
                            }`}
                          >
                            {done ? '✓' : ''}
                          </div>
                          <span className="text-[10px] text-[#77766F] font-mono">
                            {day.dayName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggle Today Action Button */}
                  <button
                    type="button"
                    onClick={() => onToggleHabitToday(habit.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCompletedToday
                        ? 'bg-[#EBF2EB] text-[#4E795C] border border-[#D8E5D8]'
                        : 'bg-[#65513B] text-white hover:bg-[#493A2B]'
                    }`}
                  >
                    {isCompletedToday ? 'Completed Today ✓' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#292820] tracking-tight">
              Active Goals
            </h2>
            <p className="text-xs sm:text-sm text-[#77766F] mt-0.5">
              Long-term milestones, target completion dates, and project progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer self-start sm:self-center"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Goal</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const proj = getProject(goal.projectId);
            return (
              <div
                key={goal.id}
                className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-[#77766F]">
                      {goal.category || 'Milestone'}
                    </span>
                    {goal.targetDate && (
                      <span className="text-[11px] text-[#77766F] bg-[#F7F5F0] px-2 py-0.5 rounded-full border border-[#E8E4DC]/60">
                        Target {goal.targetDate}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#292820] mt-2 line-clamp-2">
                    {goal.title}
                  </h3>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E8E4DC]/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#77766F]">{proj ? proj.name : 'Independent'}</span>
                    <span className="font-bold text-[#292820]">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#65513B] rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Create Modal */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsHabitModalOpen(false)}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-modal border border-[#E8E4DC] p-5 space-y-4 z-50 animate-fadeIn">
            <h3 className="text-base font-bold text-[#292820]">Create New Habit</h3>
            <form onSubmit={handleHabitSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  placeholder="e.g. Study for 30 minutes"
                  className="w-full h-9 px-3 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Target Days per Week (1–7)
                </label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={targetDays}
                  onChange={(e) => setTargetDays(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsHabitModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#77766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#65513B] text-white text-xs font-semibold"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Create Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsGoalModalOpen(false)}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-modal border border-[#E8E4DC] p-5 space-y-4 z-50 animate-fadeIn">
            <h3 className="text-base font-bold text-[#292820]">Create New Goal</h3>
            <form onSubmit={handleGoalSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Master FastAPI & Docker"
                  className="w-full h-9 px-3 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Initial Progress: {progress}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#65513B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#77766F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#65513B] text-white text-xs font-semibold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
