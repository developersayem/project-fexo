import React from 'react'
import { Search, Plus, Timer, Pause, Play, Check, Trash2, X, Zap } from 'lucide-react'
import { Task } from '../types/task'
import { Button } from '../components/ui/button'

interface TasksHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  newTaskListTitle: string
  setNewTaskListTitle: (title: string) => void
  handleAddTask: () => void
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  newTaskListTitle,
  setNewTaskListTitle,
  handleAddTask
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Search Input Bar */}
      <div className="bg-[oklch(0.269_0_0)] rounded-lg border-white/10 border-1 border-solid flex px-3 py-1.5 items-center gap-2">
        <Search className="size-4 text-[#a1a1a1]" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-neutral-200 text-sm focus:outline-none placeholder-[#a1a1a1] w-40"
        />
      </div>

      {/* Quick Add input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Quick add task..."
          value={newTaskListTitle}
          onChange={(e) => setNewTaskListTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddTask()
          }}
          className="bg-[oklch(0.205_0_0)] border border-neutral-800 rounded-xl px-4 py-1.5 text-sm text-neutral-200 focus:outline-none placeholder-neutral-500 w-36"
        />
        <Button
          onClick={handleAddTask}
          className="bg-[oklch(0.488_0.243_264.376)] font-semibold rounded-xl text-white text-sm leading-5 flex px-4 py-2 items-center gap-2"
        >
          <Plus className="size-4" />
          <span>New Task</span>
          <span className="text-white/60 text-xs leading-4 ml-1">⌘N</span>
        </Button>
      </div>
    </div>
  )
}

interface TasksContentProps {
  tasks: Task[]
  tasksTabFilter: 'Today' | 'All' | 'In Progress' | 'Completed' | 'Overdue'
  setTasksTabFilter: (filter: 'Today' | 'All' | 'In Progress' | 'Completed' | 'Overdue') => void
  searchQuery: string
  selectedTaskId: string
  setSelectedTaskId: (id: string) => void
  formatTime: (secs: number) => string
  handleTogglePlayPause: (id: string) => void
  handleToggleComplete: (id: string) => void
  handleDeleteTask: (id: string) => void
}

export const TasksContent: React.FC<TasksContentProps> = ({
  tasks,
  tasksTabFilter,
  setTasksTabFilter,
  searchQuery,
  selectedTaskId,
  setSelectedTaskId,
  formatTime,
  handleTogglePlayPause,
  handleToggleComplete,
  handleDeleteTask
}) => {
  const getFilteredTasks = (): Task[] => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())

      if (tasksTabFilter === 'All') {
        return matchesSearch
      } else {
        return t.status === tasksTabFilter && matchesSearch
      }
    })
  }

  const filteredTasks = getFilteredTasks()

  return (
    <div className="flex flex-col flex-1">
      {/* Category selector chips row */}
      <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-4 items-center gap-2">
        {(['Today', 'All', 'In Progress', 'Completed', 'Overdue'] as const).map((chip) => {
          const isChipActive = tasksTabFilter === chip
          return (
            <div
              key={chip}
              onClick={() => setTasksTabFilter(chip)}
              className={`cursor-pointer text-sm leading-5 flex px-4 py-1.5 items-center gap-2 transition-all ${
                isChipActive
                  ? 'bg-[oklch(0.488_0.243_264.376)] font-semibold rounded-full text-white'
                  : 'bg-[oklch(0.269_0_0)] font-medium rounded-full text-[#a1a1a1] border-white/10 border border-solid hover:bg-neutral-800/40'
              }`}
            >
              {chip}
            </div>
          )
        })}
      </div>

      {/* Table Column headers */}
      <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-2 items-center gap-0">
        <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
          Priority
        </div>
        <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider flex-1">
          Task Name
        </div>
        <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
          Project
        </div>
        <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
          Due Date
        </div>
        <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-24">
          Estimated
        </div>
        <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-32">
          Status
        </div>
        <div className="font-semibold text-right uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
          Actions
        </div>
      </div>

      {/* Tasks List Grid Rows */}
      <div className="overflow-y-auto flex px-8 py-4 flex-col flex-1 gap-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isSelected = task.id === selectedTaskId
            const isInProgress = task.status === 'In Progress'
            const isCompleted = task.status === 'Completed'
            const isOverdue = task.status === 'Overdue'

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`bg-[oklch(0.205_0_0)] transition-all cursor-pointer relative rounded-xl border-1 border-solid flex items-center overflow-hidden ${
                  isSelected ? 'border-[oklch(0.488_0.243_264.376)]/50' : 'border-white/10'
                } ${isCompleted ? 'opacity-70' : ''}`}
              >
                <div
                  style={{ backgroundColor: task.priorityColor }}
                  className="shrink-0 self-stretch w-1"
                />
                <div className="flex px-4 py-3 items-center flex-1 gap-0">
                  {/* Priority flag */}
                  <div className="w-28">
                    <span
                      style={{ color: task.priorityColor }}
                      className="font-semibold text-xs leading-4"
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Task details column */}
                  <div className="flex flex-col flex-1 gap-0.5 pr-4">
                    <span
                      className={`font-semibold text-neutral-50 text-sm leading-5 ${
                        isCompleted ? 'line-through text-neutral-500' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.loggedTime > 0 && (
                      <div className="flex mt-0.5 items-center gap-2">
                        <Timer className="size-3 text-[oklch(0.488_0.243_264.376)]" />
                        <span className="text-[oklch(0.488_0.243_264.376)] font-mono font-semibold text-xs leading-4">
                          {formatTime(task.loggedTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Column */}
                  <div className="w-28">
                    <span className="bg-[oklch(0.269_0_0)] font-medium rounded-full text-[#a1a1a1] text-xs leading-4 px-2 py-1">
                      {task.category}
                    </span>
                  </div>

                  {/* Due Date Column */}
                  <div className="w-28">
                    <span
                      className={`text-xs leading-4 ${isOverdue ? 'text-[oklch(0.704_0.191_22.216)]' : 'text-[#a1a1a1]'}`}
                    >
                      {task.dueDateLabel}
                    </span>
                  </div>

                  {/* Estimated hours Column */}
                  <div className="w-24">
                    <span className="text-[#a1a1a1] text-xs leading-4">{task.estimatedTime}</span>
                  </div>

                  {/* Status badge Column */}
                  <div className="w-32">
                    <span
                      className={`font-semibold rounded-full text-xs leading-4 px-2 py-1 ${
                        isCompleted
                          ? 'bg-[oklch(0.696_0.17_162.48)]/20 text-[oklch(0.696_0.17_162.48)]'
                          : isInProgress
                            ? 'bg-[oklch(0.488_0.243_264.376)]/20 text-[oklch(0.488_0.243_264.376)]'
                            : isOverdue
                              ? 'bg-[oklch(0.704_0.191_22.216)]/20 text-[oklch(0.704_0.191_22.216)]'
                              : 'bg-[oklch(0.269_0_0)] border border-white/10 text-[#a1a1a1]'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  {/* Actions Column */}
                  <div className="flex justify-end items-center gap-2 w-28">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePlayPause(task.id)
                      }}
                      className="bg-[oklch(0.488_0.243_264.376)] rounded-full flex justify-center items-center w-7 h-7 border-none cursor-pointer hover:opacity-90"
                    >
                      {isInProgress ? (
                        <Pause className="size-3 text-white" />
                      ) : (
                        <Play className="size-3 text-white" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleComplete(task.id)
                      }}
                      className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 rounded-full border-white/10 border border-solid flex justify-center items-center w-7 h-7 cursor-pointer"
                    >
                      <Check
                        className={`size-3 ${isCompleted ? 'text-[oklch(0.696_0.17_162.48)]' : 'text-[#a1a1a1]'}`}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTask(task.id)
                      }}
                      className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 rounded-full border-white/10 border border-solid flex justify-center items-center w-7 h-7 cursor-pointer"
                    >
                      <Trash2 className="size-3 text-[#a1a1a1]" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12 text-[oklch(0.708_0_0)] text-sm">
            No matching tasks found for the active filter.
          </div>
        )}
      </div>
    </div>
  )
}

interface TasksSidebarProps {
  selectedTask: Task | undefined
  setSelectedTaskId: (id: string) => void
  formatTime: (secs: number) => string
  handleTogglePlayPause: (id: string) => void
  onStartFocus: (id: string) => void
}

export const TasksSidebar: React.FC<TasksSidebarProps> = ({
  selectedTask,
  setSelectedTaskId,
  formatTime,
  handleTogglePlayPause,
  onStartFocus
}) => {
  return (
    <div className="min-h-screen bg-[oklch(0.205_0_0)] shrink-0 border-white/10 border-t-0 border-r-0 border-b-0 border-l-1 border-solid flex flex-col gap-0 w-72">
      {/* Header Task Details */}
      <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid p-6">
        <div className="flex mb-1 justify-between items-center">
          <h2 className="font-semibold text-neutral-50 text-sm leading-5">Task Details</h2>
          <button
            onClick={() => setSelectedTaskId('')}
            className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 rounded-md border-white/10 border-1 border-solid flex justify-center items-center w-6 h-6 border-none cursor-pointer"
          >
            <X className="size-3 text-[#a1a1a1]" />
          </button>
        </div>
        <p className="text-[#a1a1a1] text-xs leading-4">Selected task info</p>
      </div>

      {/* Task Details pane attributes */}
      {selectedTask ? (
        <div className="overflow-y-auto flex p-6 flex-col flex-1 gap-6">
          {/* Priority and Title */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: selectedTask.priorityColor }}
                className="rounded-full w-2 h-2"
              />
              <span
                style={{ color: selectedTask.priorityColor }}
                className="font-semibold uppercase text-xs leading-4 tracking-wider"
              >
                {selectedTask.priority} Priority
              </span>
            </div>
            <h3 className="font-bold text-neutral-50 text-lg leading-7">{selectedTask.title}</h3>
            <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5">
              {selectedTask.description}
            </p>
          </div>

          {/* Table statistics */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                Project
              </span>
              <span className="bg-[oklch(0.269_0_0)] font-medium rounded-full text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-2 py-1">
                {selectedTask.category}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                Due Date
              </span>
              <span className="font-medium text-neutral-50 text-xs leading-4">
                {selectedTask.dueDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                Estimated
              </span>
              <span className="font-medium text-neutral-50 text-xs leading-4">
                {selectedTask.estimatedHours} hours
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                Actual
              </span>
              <span className="text-[oklch(0.488_0.243_264.376)] font-mono font-semibold text-xs leading-4">
                {formatTime(selectedTask.loggedTime)}
              </span>
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
              Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedTask.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[oklch(0.488_0.243_264.376)]/20 text-[oklch(0.488_0.243_264.376)] font-medium rounded-full text-xs leading-4 px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Progress bar details */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
              Progress
            </span>
            <div className="bg-[oklch(0.269_0_0)] rounded-full w-full h-1.5 overflow-hidden">
              <div
                style={{
                  width: `${Math.min(100, Math.round((selectedTask.loggedTime / (selectedTask.estimatedHours * 3600)) * 100))}%`
                }}
                className="bg-[oklch(0.488_0.243_264.376)] rounded-full h-1.5 transition-all duration-300"
              />
            </div>
            <div className="flex mt-1 justify-between items-center">
              <span className="text-[#a1a1a1] text-xs leading-4">
                {Math.floor(selectedTask.loggedTime / 60)}m elapsed
              </span>
              <span className="text-[#a1a1a1] text-xs leading-4">
                {selectedTask.estimatedHours}h estimated
              </span>
            </div>
          </div>

          {/* Status indicator badge */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
              Status
            </span>
            <span
              className={`font-semibold rounded-full text-xs leading-4 px-3 py-1.5 w-fit ${
                selectedTask.status === 'Completed'
                  ? 'bg-[oklch(0.696_0.17_162.48)]/20 text-[oklch(0.696_0.17_162.48)]'
                  : selectedTask.status === 'In Progress'
                    ? 'bg-[oklch(0.488_0.243_264.376)]/20 text-[oklch(0.488_0.243_264.376)]'
                    : selectedTask.status === 'Overdue'
                      ? 'bg-[oklch(0.704_0.191_22.216)]/20 text-[oklch(0.704_0.191_22.216)]'
                      : 'bg-[oklch(0.269_0_0)] border border-white/10 text-[#a1a1a1]'
              }`}
            >
              {selectedTask.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-xs text-neutral-500">
          Click a task to review detailed milestones.
        </div>
      )}

      {/* Sidebar bottom action */}
      {selectedTask && (
        <div className="border-white/10 border-t border-r-0 border-b-0 border-l-0 border-solid p-6 flex flex-col gap-2">
          {selectedTask.status === 'In Progress' && (
            <Button
              onClick={() => onStartFocus(selectedTask.id)}
              className="bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] text-neutral-900 font-bold rounded-xl text-sm leading-5 flex py-2.5 justify-center items-center gap-2 w-full border-none shadow-lg shadow-primary/20 cursor-pointer animate-pulse"
            >
              <Zap className="size-4" />
              <span>Maximize Focus</span>
            </Button>
          )}
          <Button
            onClick={() => {
              const wasInProgress = selectedTask.status === 'In Progress'
              handleTogglePlayPause(selectedTask.id)
              if (!wasInProgress) {
                onStartFocus(selectedTask.id)
              }
            }}
            className={`${
              selectedTask.status === 'In Progress'
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                : 'bg-[oklch(0.488_0.243_264.376)] text-white'
            } font-semibold rounded-xl text-sm leading-5 flex py-2.5 justify-center items-center gap-2 w-full cursor-pointer`}
          >
            {selectedTask.status === 'In Progress' ? (
              <>
                <Pause className="size-4" />
                <span>Pause Focus</span>
              </>
            ) : (
              <>
                <Zap className="size-4" />
                <span>Start Focus</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
