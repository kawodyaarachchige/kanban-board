import React from 'react';
import {Settings} from '../types';

interface SettingsViewProps {
    settings: Settings;
    onUpdate: (updates: Partial<Settings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({settings, onUpdate}) => {
    const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
        onUpdate({theme});
        document.documentElement.classList.remove('light', 'dark');
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.classList.add(theme);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Settings</h2>

            <div className="bg-white dark:bg-slate-700 rounded-lg shadow p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Appearance</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="theme"
                                checked={settings.theme === 'light'}
                                onChange={() => handleThemeChange('light')}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500"
                            />
                            <span className="dark:text-slate-300">Light</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="theme"
                                checked={settings.theme === 'dark'}
                                onChange={() => handleThemeChange('dark')}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500"
                            />
                            <span className="dark:text-slate-300">Dark</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="theme"
                                checked={settings.theme === 'system'}
                                onChange={() => handleThemeChange('system')}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500"
                            />
                            <span className="dark:text-slate-300">System</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Notifications</h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.notifications.email}
                                onChange={(e) => onUpdate({
                                    notifications: {...settings.notifications, email: e.target.checked}
                                })}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500"
                            />
                            <span className="dark:text-slate-300">Email notifications</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.notifications.push}
                                onChange={(e) => onUpdate({
                                    notifications: {...settings.notifications, push: e.target.checked}
                                })}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500"
                            />
                            <span className="dark:text-slate-300">Push notifications</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.notifications.desktop}
                                onChange={(e) => onUpdate({
                                    notifications: {...settings.notifications, desktop: e.target.checked}
                                })}
                                className="h-4 w-4 text-blue-600 dark:text-blue-500"
                            />
                            <span className="dark:text-slate-300">Desktop notifications</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Task Defaults</h3>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Default
                            Priority</label>
                        <select
                            value={settings.defaultPriority}
                            onChange={(e) => onUpdate({
                                defaultPriority: e.target.value as 'low' | 'medium' | 'high'
                            })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};