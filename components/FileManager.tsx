import React, { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Plus, AlertTriangle, Image, FileText, Video } from 'lucide-react';

const FileManager: React.FC = () => {
  const { settings } = useContext(SettingsContext);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-10 w-10 text-brand-secondary-light dark:text-brand-secondary-dark" />;
      case 'video': return <Video className="h-10 w-10 text-purple-500" />;
      default: return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">File Manager</h3>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary-light dark:bg-brand-primary-dark text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Upload File
        </button>
      </div>

      {settings.files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {settings.files.map(file => (
            <div key={file.id} className="bg-base-200-light dark:bg-base-300-dark rounded-lg p-4 border border-transparent hover:border-brand-primary-light dark:hover:border-brand-primary-dark transition-colors">
              {file.type === 'image' ? (
                <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded-md mb-3" />
              ) : (
                <div className="w-full h-32 bg-base-300-light dark:bg-base-200-dark flex items-center justify-center rounded-md mb-3">
                  {getFileIcon(file.type)}
                </div>
              )}
              <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
              <p className="text-xs text-gray-500">{new Date(file.uploadedDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-base-200-light/50 dark:bg-base-300-dark/50 p-6 rounded-lg text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning mb-3" />
          <p className="font-medium">No files uploaded.</p>
          <p className="text-sm text-gray-500">Click "Upload File" to add assets.</p>
        </div>
      )}
    </div>
  );
};

export default FileManager;