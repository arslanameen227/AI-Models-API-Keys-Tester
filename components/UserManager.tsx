import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { User, Shield } from 'lucide-react';

const UserManager: React.FC = () => {
    const { users } = useContext(SettingsContext);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">User management is currently simulated. Full functionality coming soon.</p>
            
            <div className="space-y-3">
                {users.map(user => (
                    <div key={user.id} className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-base-300-light dark:bg-base-200-dark rounded-full">
                                <User className="h-6 w-6 text-gray-500 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="font-medium text-base-content-light dark:text-base-content-dark">{user.username}</p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                    <Shield size={12} />
                                    <span>{user.role}</span>
                                </div>
                            </div>
                        </div>
                        <button disabled className="px-3 py-1 text-sm rounded-md bg-base-300-light dark:bg-base-200-dark text-gray-500 cursor-not-allowed">
                            Edit
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManager;
