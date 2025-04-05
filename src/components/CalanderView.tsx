import React, {useState} from 'react';
import {CalendarEvent} from '../types';
import {Plus, Pencil, Trash2, Calendar as CalendarIcon} from 'lucide-react';

interface CalendarViewProps {
    events: CalendarEvent[];
    onAdd: (event: Omit<CalendarEvent, 'id'>) => void;
    onUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
    onDelete: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({events, onAdd, onUpdate, onDelete}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
    const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        participants: []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editEvent) {
            onUpdate(editEvent.id, newEvent);
        } else {
            onAdd(newEvent);
        }
        setIsAddModalOpen(false);
        setEditEvent(null);
        setNewEvent({
            title: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            participants: []
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Calendar Events</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={16}/>
                    Add Event
                </button>
            </div>

            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-white dark:bg-slate-700 rounded-lg shadow p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-white">{event.title}</h3>
                                <div
                                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mt-1">
                                    <CalendarIcon size={14}/>
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                    {event.time && <span>at {event.time}</span>}
                                </div>
                                {event.description && (
                                    <p className="mt-2 text-slate-600 dark:text-slate-300">{event.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditEvent(event);
                                        setNewEvent({
                                            title: event.title,
                                            date: event.date,
                                            time: event.time,
                                            description: event.description,
                                            participants: event.participants,
                                            relatedTaskId: event.relatedTaskId
                                        });
                                        setIsAddModalOpen(true);
                                    }}
                                    className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                                >
                                    <Pencil size={16}/>
                                </button>
                                <button
                                    onClick={() => onDelete(event.id)}
                                    className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
                                >
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">
                            {editEvent ? 'Edit Calendar Event' : 'Add New Calendar Event'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={newEvent.date}
                                            onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time
                                            (optional)</label>
                                        <input
                                            type="time"
                                            value={newEvent.time || ''}
                                            onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description
                                        (optional)</label>
                                    <textarea
                                        value={newEvent.description || ''}
                                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditEvent(null);
                                        setNewEvent({
                                            title: '',
                                            date: new Date().toISOString().split('T')[0],
                                            description: '',
                                            participants: []
                                        });
                                    }}
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editEvent ? 'Update' : 'Add'} Event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};