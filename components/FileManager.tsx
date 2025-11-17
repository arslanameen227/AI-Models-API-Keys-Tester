import React, { useContext, useRef } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { Plus, AlertTriangle, Image, FileText, Video, Trash2, Copy } from 'lucide-react';

const FileManager: React.FC = () => {
  const { files, addFile, deleteFile } = useContext(SettingsContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-10 w-10 text-brand-secondary" />;
      case 'video': return <Video className="h-10 w-10 text-purple-500" />;
      default: return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            await addFile(formData);
        } catch(e) {
            alert(`File upload failed: ${e}`);
        }
    }
  };
  
  const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this file? This may break links on your site.')) {
          try {
            await deleteFile(id);
          } catch (e) {
            alert(`Failed to delete file: ${e}`);
          }
      }
  };

  const handleCopyUrl = (url: string) => {
      navigator.clipboard.writeText(url);
      // Optional: Show a toast notification
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="hidden" 
      />
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">File Manager</h3>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Upload File
        </button>
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map(file => (
            <div key={file.id} className="group bg-base-200 p-3 rounded-lg border border-base-300 relative">
              {file.type === 'image' ? (
                <img src={file.url} alt={file.name} className="w-full h-32 object-cover rounded-md mb-2" />
              ) : (
                <div className="w-full h-32 bg-base-300 flex items-center justify-center rounded-md mb-2">
                  {getFileIcon(file.type)}
                </div>
              )}
              <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
              <p className="text-xs text-gray-500">{new Date(file.uploadedDate).toLocaleDateString()}</p>

              <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleCopyUrl(file.url)} className="p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white" title="Copy URL">
                    <Copy size={14}/>
                </button>
                <button onClick={() => handleDelete(file.id)} className="p-1.5 bg-red-600/70 hover:bg-red-600 rounded-full text-white" title="Delete File">
                    <Trash2 size={14}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-base-200/50 p-6 rounded-lg text-center border-2 border-dashed border-base-300">
          <AlertTriangle className="mx-auto h-10 w-10 text-warning mb-3" />
          <p className="font-medium">No files uploaded.</p>
          <p className="text-sm text-gray-500">Click "Upload File" to add assets.</p>
        </div>
      )}
    </div>
  );
};

export default FileManager;