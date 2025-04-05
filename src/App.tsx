import React, {useState, useEffect} from 'react';
import {
    DndContext,
    DragEndEvent,
    closestCorners,
} from '@dnd-kit/core';
import {Layout, Loader2, Search, Menu, X, Home, Settings, Users, Calendar} from 'lucide-react';
import {Column} from './components/Column';
import {TaskModal} from './components/TaskModal';
import {TeamView} from './components/TeamView';

import {SettingsView} from './components/SettingsView';
import {Board, Task, TeamMember, CalendarEvent, Settings as AppSettings} from './types';
import {CalendarView} from "./components/CalanderView.tsx";

const initialBoard: Board = {
    columns: [
        {id: 'todo', title: 'To Do', tasks: [], color: 'from-pink-500 to-rose-500'},
        {id: 'inProgress', title: 'In Progress', tasks: [], color: 'from-blue-500 to-indigo-500'},
        {id: 'done', title: 'Done', tasks: [], color: 'from-green-500 to-emerald-500'},
    ],
};

function App() {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | undefined>();
    const [activeColumnId, setActiveColumnId] = useState<string | undefined>();
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState<'board' | 'team' | 'calendar' | 'settings'>('board');
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [settings, setSettings] = useState<AppSettings>({
        theme: 'light',
        notifications: {
            email: true,
            push: true,
            desktop: true,
        },
        defaultPriority: 'medium',
    });

    useEffect(() => {
        const savedBoard = localStorage.getItem('kanbanBoard');
        const savedTeam = localStorage.getItem('kanbanTeam');
        const savedCalendar = localStorage.getItem('kanbanCalendar');
        const savedSettings = localStorage.getItem('kanbanSettings');

        if (savedBoard) setBoard(JSON.parse(savedBoard));
        if (savedTeam) setTeamMembers(JSON.parse(savedTeam));
        if (savedCalendar) setCalendarEvents(JSON.parse(savedCalendar));
        if (savedSettings) setSettings(JSON.parse(savedSettings));

        setIsLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('kanbanBoard', JSON.stringify(board));
        localStorage.setItem('kanbanTeam', JSON.stringify(teamMembers));
        localStorage.setItem('kanbanCalendar', JSON.stringify(calendarEvents));
        localStorage.setItem('kanbanSettings', JSON.stringify(settings));
    }, [board, teamMembers, calendarEvents, settings]);

    // Handle theme changes
    useEffect(() => {
        // Apply the saved theme when component mounts
        document.documentElement.classList.remove('light', 'dark');
        if (settings.theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.classList.add(settings.theme);
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (settings.theme === 'system') {
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [settings.theme]);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) return;

        const activeTask = findTask(active.id as string);
        if (!activeTask) return;

        const activeColumn = board.columns.find(col =>
            col.tasks.some(task => task.id === active.id)
        );
        const overColumn = board.columns.find(col => col.id === over.id);

        if (!activeColumn || !overColumn) return;

        if (activeColumn.id !== overColumn.id) {
            setBoard(prev => ({
                ...prev,
                columns: prev.columns.map(col => {
                    if (col.id === activeColumn.id) {
                        return {
                            ...col,
                            tasks: col.tasks.filter(task => task.id !== active.id)
                        };
                    }
                    if (col.id === overColumn.id) {
                        return {
                            ...col,
                            tasks: [...col.tasks, activeTask]
                        };
                    }
                    return col;
                })
            }));
        }
    };

    const findTask = (taskId: string): Task | undefined => {
        for (const column of board.columns) {
            const task = column.tasks.find(t => t.id === taskId);
            if (task) return task;
        }
        return undefined;
    };

    const handleAddTask = (columnId: string) => {
        setActiveColumnId(columnId);
        setActiveTask(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setActiveTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = (taskId: string) => {
        setBoard(prev => ({
            ...prev,
            columns: prev.columns.map(col => ({
                ...col,
                tasks: col.tasks.filter(task => task.id !== taskId)
            }))
        }));
    };

    const handleToggleComplete = (taskId: string) => {
        setBoard(prev => ({
            ...prev,
            columns: prev.columns.map(col => ({
                ...col,
                tasks: col.tasks.map(task =>
                    task.id === taskId
                        ? {...task, isCompleted: !task.isCompleted}
                        : task
                )
            }))
        }));
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        if (activeTask) {
            setBoard(prev => ({
                ...prev,
                columns: prev.columns.map(col => ({
                    ...col,
                    tasks: col.tasks.map(task =>
                        task.id === activeTask.id
                            ? {...task, ...taskData}
                            : task
                    )
                }))
            }));
        } else if (activeColumnId) {
            const newTask: Task = {
                id: crypto.randomUUID(),
                ...taskData,
                createdAt: new Date().toISOString(),
            };

            setBoard(prev => ({
                ...prev,
                columns: prev.columns.map(col =>
                    col.id === activeColumnId
                        ? {...col, tasks: [...col.tasks, newTask]}
                        : col
                )
            }));
        }
    };

    const handleAddTeamMember = (member: Omit<TeamMember, 'id'>) => {
        const newMember = {
            ...member,
            id: crypto.randomUUID(),
        };
        setTeamMembers(prev => [...prev, newMember]);
    };

    const handleUpdateTeamMember = (id: string, updates: Partial<TeamMember>) => {
        setTeamMembers(prev =>
            prev.map(member =>
                member.id === id ? {...member, ...updates} : member
            )
        );
    };

    const handleDeleteTeamMember = (id: string) => {
        setTeamMembers(prev => prev.filter(member => member.id !== id));
    };

    const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
        const newEvent = {
            ...event,
            id: crypto.randomUUID(),
        };
        setCalendarEvents(prev => [...prev, newEvent]);
    };

    const handleUpdateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
        setCalendarEvents(prev =>
            prev.map(event =>
                event.id === id ? {...event, ...updates} : event
            )
        );
    };

    const handleDeleteCalendarEvent = (id: string) => {
        setCalendarEvents(prev => prev.filter(event => event.id !== id));
    };

    const handleUpdateSettings = (updates: Partial<AppSettings>) => {
        setSettings(prev => ({...prev, ...updates}));
    };

    const filteredBoard: Board = {
        columns: board.columns.map(column => ({
            ...column,
            tasks: column.tasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase())) ||
                task.assignees.some(assignee => assignee.name.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }))
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={32}/>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-slate-50 flex dark:bg-slate-900 ${settings.theme}`}>
            <div className={`bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out 
      ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
                <div className="p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kanban</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        <X className="h-5 w-5 text-slate-500 dark:text-slate-400"/>
                    </button>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-1 px-2">
                        <li>
                            <button
                                onClick={() => setActiveView('board')}
                                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${activeView === 'board' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                            >
                                <Home className="mr-3 h-5 w-5"/>
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('team')}
                                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${activeView === 'team' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                            >
                                <Users className="mr-3 h-5 w-5"/>
                                Team
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('calendar')}
                                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${activeView === 'calendar' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                            >
                                <Calendar className="mr-3 h-5 w-5"/>
                                Calendar
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('settings')}
                                className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md ${activeView === 'settings' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
                            >
                                <Settings className="mr-3 h-5 w-5"/>
                                Settings
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="mr-4 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400"/>
                                </button>
                                <Layout className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2"/>
                                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Kanban Board</h1>
                            </div>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500"/>
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                        {activeView === 'board' && (
                            <DndContext
                                onDragEnd={handleDragEnd}
                                collisionDetection={closestCorners}
                            >
                                <div className="flex gap-6 overflow-x-auto pb-4">
                                    {filteredBoard.columns.map((column) => (
                                        <Column
                                            key={column.id}
                                            column={column}
                                            onAddTask={handleAddTask}
                                            onEditTask={handleEditTask}
                                            onDeleteTask={handleDeleteTask}
                                            onToggleComplete={handleToggleComplete}
                                        />
                                    ))}
                                </div>
                            </DndContext>
                        )}

                        {activeView === 'team' && (
                            <TeamView
                                teamMembers={teamMembers}
                                onAdd={handleAddTeamMember}
                                onUpdate={handleUpdateTeamMember}
                                onDelete={handleDeleteTeamMember}
                            />
                        )}

                        {activeView === 'calendar' && (
                            <CalendarView
                                events={calendarEvents}
                                onAdd={handleAddCalendarEvent}
                                onUpdate={handleUpdateCalendarEvent}
                                onDelete={handleDeleteCalendarEvent}
                            />
                        )}

                        {activeView === 'settings' && (
                            <SettingsView
                                settings={settings}
                                onUpdate={handleUpdateSettings}
                            />
                        )}
                    </div>
                </main>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={activeTask}
                defaultPriority={settings.defaultPriority}
            />
        </div>
    );
}

export default App;