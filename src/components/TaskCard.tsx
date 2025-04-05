import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Pencil, Trash2, MessageSquare, CheckCircle } from 'lucide-react';
import { Task, PRIORITY_COLORS, LABEL_COLORS } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
      <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className={`rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 cursor-move group ${
              task.isCompleted ? 'opacity-75' : ''
          } bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task.id);
                }}
                className={`p-1 rounded-full transition-colors ${
                    task.isCompleted
                        ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                        : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
                }`}
            >
              <CheckCircle size={18} className={task.isCompleted ? 'fill-current' : ''} />
            </button>
            <h3 className={`font-medium text-slate-900 dark:text-white ${task.isCompleted ? 'line-through' : ''}`}>
              {task.title}
            </h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md transition-colors"
            >
              <Pencil size={14} className="text-slate-600 dark:text-slate-300" />
            </button>
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
            >
              <Trash2 size={14} className="text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400" />
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{task.description}</p>

        {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.labels.map((label, index) => (
                  <span
                      key={label}
                      className={`text-xs px-2 py-1 rounded-full ${LABEL_COLORS[index % LABEL_COLORS.length]} dark:bg-opacity-20`}
                  >
              {label}
            </span>
              ))}
            </div>
        )}

        {task.assignees.length > 0 && (
            <div className="flex -space-x-2 mb-3">
              {task.assignees.map((assignee) => (
                  <img
                      key={assignee.id}
                      src={assignee.avatar}
                      alt={assignee.name}
                      title={assignee.name}
                      className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-700"
                  />
              ))}
            </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full ${PRIORITY_COLORS[task.priority]} dark:bg-opacity-20`}>
            {task.priority}
          </span>
            {task.comments.length > 0 && (
                <span className="flex items-center text-slate-500 dark:text-slate-400">
              <MessageSquare size={12} className="mr-1" />
                  {task.comments.length}
            </span>
            )}
          </div>

          {task.dueDate && (
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <Calendar size={12} className="mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
          )}
        </div>
      </div>
  );
}