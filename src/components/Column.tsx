import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {Plus} from 'lucide-react';
import {TaskCard} from './TaskCard';
import {Column as ColumnType, Task} from '../types';

interface ColumnProps {
    column: ColumnType;
    onAddTask: (columnId: string) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleComplete: (taskId: string) => void;
}

export function Column({column, onAddTask, onEditTask, onDeleteTask, onToggleComplete}: ColumnProps) {
    const {setNodeRef} = useDroppable({
        id: column.id,
    });

    return (
        <div className="w-80 flex-shrink-0">
            <div className={`h-2 rounded-t-lg bg-gradient-to-r ${column.color}`}/>
            <div className="bg-white dark:bg-slate-800 rounded-b-lg shadow-sm p-4 flex flex-col h-[calc(100vh-12rem)]">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">{column.title}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{column.tasks.length} tasks</p>
                    </div>
                    <button
                        onClick={() => onAddTask(column.id)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <Plus size={20} className="text-slate-600 dark:text-slate-300"/>
                    </button>
                </div>
                <div
                    ref={setNodeRef}
                    className="flex-1 overflow-y-auto space-y-3 p-1"
                >
                    <SortableContext
                        items={column.tasks.map(task => task.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {column.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onToggleComplete={onToggleComplete}
                            />
                        ))}
                    </SortableContext>
                </div>
            </div>
        </div>
    );
}