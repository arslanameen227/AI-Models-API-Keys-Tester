import React, { useContext, useState } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Plugin } from '../types';
import { Puzzle, CheckCircle, Power, PowerOff, Download, Trash2, Loader } from 'lucide-react';

const PluginManager: React.FC = () => {
    const { plugins, updatePluginState } = useContext(SettingsContext);
    const [loadingPlugin, setLoadingPlugin] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAction = async (id: string, action: 'install' | 'uninstall' | 'activate' | 'deactivate') => {
        setLoadingPlugin(id);
        setError(null);
        try {
            await updatePluginState(id, action);
        } catch (e: any) {
            setError(`Failed to ${action} plugin: ${e.message}`);
        } finally {
            setLoadingPlugin(null);
        }
    };
    
    const ActionButton: React.FC<{ plugin: Plugin }> = ({ plugin }) => {
        const isLoading = loadingPlugin === plugin.id;

        if (!plugin.isInstalled) {
            return (
                <button 
                    onClick={() => handleAction(plugin.id, 'install')}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
                    {isLoading ? <Loader size={16} className="animate-spin" /> : <Download size={16} />} Install
                </button>
            );
        }

        return (
            <div className="flex items-center gap-2">
                {plugin.isActive ? (
                     <button
                        onClick={() => handleAction(plugin.id, 'deactivate')}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-gray-400">
                        {isLoading ? <Loader size={16} className="animate-spin" /> : <PowerOff size={16} />} Deactivate
                    </button>
                ) : (
                    <button
                        onClick={() => handleAction(plugin.id, 'activate')}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400">
                         {isLoading ? <Loader size={16} className="animate-spin" /> : <Power size={16} />} Activate
                    </button>
                )}
                 <button
                    onClick={() => handleAction(plugin.id, 'uninstall')}
                    disabled={isLoading || plugin.isActive}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                     {isLoading ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />} Uninstall
                </button>
            </div>
        )
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-2">Plugin Management</h3>
            <p className="text-sm text-gray-500 mb-6">Install, activate, and manage plugins to extend the framework's functionality.</p>

            {error && <p className="text-error bg-error/10 p-3 rounded-md mb-4">{error}</p>}
            
            <div className="space-y-4">
                {plugins.map(plugin => (
                    <div key={plugin.id} className="bg-base-200 p-4 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <Puzzle className="h-8 w-8 text-brand-primary mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg">{plugin.name} <span className="text-sm font-normal text-gray-500">v{plugin.version}</span></h4>
                                <p className="text-sm text-gray-500">{plugin.description}</p>
                                <p className="text-xs text-gray-400 mt-1">by {plugin.author}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                           <div className="flex items-center gap-2 text-xs">
                             {plugin.isInstalled ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-500"><CheckCircle size={12} /> Installed</span>
                             ) : (
                                <span className="px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">Not Installed</span>
                             )}
                             {plugin.isInstalled && (
                                plugin.isActive ? (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400"><Power size={12} /> Active</span>
                                ) : (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500"><PowerOff size={12} /> Inactive</span>
                                )
                             )}
                           </div>
                           <ActionButton plugin={plugin} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PluginManager;