import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { LineChart, BarChart } from 'lucide-react';

const Chart: React.FC<{ title: string; data: { date: string, count: number }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.count));
    const minValue = 0; // Assuming counts don't go below zero

    return (
        <div className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="h-64 w-full flex items-end justify-between gap-1">
                {data.map((d, i) => (
                    <div
                        key={i}
                        className="w-full bg-brand-primary-light dark:bg-brand-primary-dark rounded-t-sm hover:opacity-80 transition-opacity"
                        style={{ height: `${(d.count / maxValue) * 100}%` }}
                        title={`${new Date(d.date).toLocaleDateString()}: ${d.count.toLocaleString()}`}
                    />
                ))}
            </div>
        </div>
    );
};


const Analytics: React.FC = () => {
    const { analytics } = useContext(SettingsContext);

    if (!analytics) {
        return <div>Loading analytics data...</div>;
    }
    
    const totalPageViews = analytics.pageViews.reduce((sum, item) => sum + item.count, 0);
    const totalUniqueVisitors = analytics.uniqueVisitors.reduce((sum, item) => sum + item.count, 0);

    return (
        <div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Total Page Views</h4>
                    <p className="text-3xl font-bold">{totalPageViews.toLocaleString()}</p>
                    <p className="text-xs text-success">+5.2% this month</p>
                </div>
                 <div className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Unique Visitors</h4>
                    <p className="text-3xl font-bold">{totalUniqueVisitors.toLocaleString()}</p>
                     <p className="text-xs text-success">+3.8% this month</p>
                </div>
                 <div className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Bounce Rate</h4>
                    <p className="text-3xl font-bold">45.2%</p>
                     <p className="text-xs text-error">-1.1% this month</p>
                </div>
                 <div className="bg-base-200-light dark:bg-base-300-dark p-4 rounded-lg">
                    <h4 className="text-sm text-gray-500 dark:text-gray-400">Avg. Session</h4>
                    <p className="text-3xl font-bold">3m 12s</p>
                    <p className="text-xs text-success">+15s this month</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Chart title="Page Views (Last 30 Days)" data={analytics.pageViews} />
                <Chart title="Unique Visitors (Last 30 Days)" data={analytics.uniqueVisitors} />
            </div>
        </div>
    );
};

export default Analytics;
