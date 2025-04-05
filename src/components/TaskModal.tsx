import React, {useState, useEffect} from 'react';
import {X, Plus, Tag, MessageSquare} from 'lucide-react';
import {Task, User, Comment, SAMPLE_USERS} from '../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    task?: Task;
    defaultPriority?: Task['priority'];
}

export function TaskModal({isOpen, onClose, onSave, task, defaultPriority = 'medium'}: TaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Task['priority']>(defaultPriority);
    const [dueDate, setDueDate] = useState('');
    const [labels, setLabels] = useState<string[]>([]);
    const [newLabel, setNewLabel] = useState('');
    const [assignees, setAssignees] = useState<User[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            setDueDate(task.dueDate || '');
            setLabels(task.labels);
            setAssignees(task.assignees);
            setComments(task.comments);
            setIsCompleted(task.isCompleted);
        } else {
            setTitle('');
            setDescription('');
            setPriority(defaultPriority);
            setDueDate('');
            setLabels([]);
            setAssignees([]);
            setComments([]);
            setIsCompleted(false);
        }
    }, [task, defaultPriority]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            priority,
            dueDate: dueDate || undefined,
            labels,
            assignees,
            comments,
            isCompleted,
        });
        onClose();
    };

    const handleAddLabel = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLabel.trim() && !labels.includes(newLabel.trim())) {
            setLabels([...labels, newLabel.trim()]);
            setNewLabel('');
        }
    };

    const handleRemoveLabel = (labelToRemove: string) => {
        setLabels(labels.filter(label => label !== labelToRemove));
    };

    const handleToggleAssignee = (user: User) => {
        const isAssigned = assignees.some(a => a.id === user.id);
        if (isAssigned) {
            setAssignees(assignees.filter(a => a.id !== user.id));
        } else {
            setAssignees([...assignees, user]);
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment: Comment = {
                id: crypto.randomUUID(),
                userId: SAMPLE_USERS[0].id,
                content: newComment.trim(),
                createdAt: new Date().toISOString(),
            };
            setComments([...comments, comment]);
            setNewComment('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {task ? 'Edit Task' : 'New Task'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            <X size={20}/>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as Task['priority'])}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Labels
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {labels.map((label) => (
                                    <span
                                        key={label}
                                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center"
                                    >
                    <Tag size={12} className="mr-1"/>
                                        {label}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveLabel(label)}
                                            className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                                        >
                      <X size={12}/>
                    </button>
                  </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="Add a label"
                                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLabel}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
                                >
                                    <Plus size={20}/>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Assignees
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SAMPLE_USERS.map((user) => {
                                    const isAssigned = assignees.some(a => a.id === user.id);
                                    return (
                                        <button
                                            key={user.id}
                                            type="button"
                                            onClick={() => handleToggleAssignee(user)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                                isAssigned
                                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                                                    : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span className="text-sm">{user.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Comments
                            </label>
                            <div className="space-y-3 mb-3">
                                {comments.map((comment) => {
                                    const user = SAMPLE_USERS.find(u => u.id === comment.userId);
                                    return (
                                        <div key={comment.id} className="flex gap-3">
                                            <img
                                                src={user?.avatar}
                                                alt={user?.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="font-medium text-sm dark:text-white">{user?.name}</span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddComment}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600"
                                >
                                    <MessageSquare size={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="completed"
                                checked={isCompleted}
                                onChange={(e) => setIsCompleted(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
                            />
                            <label htmlFor="completed" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                Mark as completed
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}