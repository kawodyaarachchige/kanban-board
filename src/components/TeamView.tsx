import React, {useState} from 'react';
import {TeamMember} from '../types';
import {Plus, Pencil, Trash2} from 'lucide-react';

interface TeamViewProps {
    teamMembers: TeamMember[];
    onAdd: (member: Omit<TeamMember, 'id'>) => void;
    onUpdate: (id: string, updates: Partial<TeamMember>) => void;
    onDelete: (id: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({teamMembers, onAdd, onUpdate, onDelete}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editMember, setEditMember] = useState<TeamMember | null>(null);
    const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
        name: '',
        avatar: '',
        email: '',
        role: 'Member'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMember) {
            onUpdate(editMember.id, newMember);
        } else {
            onAdd(newMember);
        }
        setIsAddModalOpen(false);
        setEditMember(null);
        setNewMember({name: '', avatar: '', email: '', role: 'Member'});
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Team Management</h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={16}/>
                    Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                    <div key={member.id}
                         className="bg-white dark:bg-slate-700 rounded-lg shadow p-4 flex items-center gap-4">
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-600"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 dark:text-white">{member.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{member.role}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditMember(member);
                                    setNewMember({
                                        name: member.name,
                                        avatar: member.avatar,
                                        email: member.email,
                                        role: member.role
                                    });
                                    setIsAddModalOpen(true);
                                }}
                                className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                            >
                                <Pencil size={16}/>
                            </button>
                            <button
                                onClick={() => onDelete(member.id)}
                                className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 dark:text-white">
                            {editMember ? 'Edit Team Member' : 'Add New Team Member'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={newMember.email}
                                        onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Avatar
                                        URL</label>
                                    <input
                                        type="url"
                                        value={newMember.avatar}
                                        onChange={(e) => setNewMember({...newMember, avatar: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                                    <select
                                        value={newMember.role}
                                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    >
                                        <option value="Member">Member</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Owner">Owner</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditMember(null);
                                        setNewMember({name: '', avatar: '', email: '', role: 'Member'});
                                    }}
                                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editMember ? 'Update' : 'Add'} Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};