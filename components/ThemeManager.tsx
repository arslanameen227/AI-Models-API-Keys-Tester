import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { ThemeContext } from '../context/ThemeContext';
import { CheckCircle } from 'lucide-react';

const ThemeManager: React.FC = () => {
    const { themes } = useContext(SettingsContext);
    const { activeTheme, setActiveTheme } = useContext(ThemeContext);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Site Themes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map(theme => (
                    <div 
                        key={theme.id}
                        className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${activeTheme?.id === theme.id ? 'border-brand-primary-light dark:border-brand-primary-dark' : 'border-base-300-light dark:border-base-300-dark'}`}
                        onClick={() => setActiveTheme(theme)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg">{theme.name}</h4>
                             {activeTheme?.id === theme.id && (
                                <CheckCircle className="h-6 w-6 text-success" />
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
                            <div className="flex-1">
                                <p className="text-xs mb-1 text-gray-500">Light</p>
                                <div className="flex h-10 rounded-md overflow-hidden border border-base-300-light">
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.light['brand-primary-light'] }}></div>
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.light['brand-secondary-light'] }}></div>
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.light['base-100-light'] }}></div>
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.light['base-200-light'] }}></div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs mb-1 text-gray-500">Dark</p>
                                <div className="flex h-10 rounded-md overflow-hidden border border-base-300-dark">
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.dark['brand-primary-dark'] }}></div>
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.dark['brand-secondary-dark'] }}></div>
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.dark['base-100-dark'] }}></div>
                                    <div className="w-1/4" style={{ backgroundColor: theme.colors.dark['base-200-dark'] }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemeManager;
