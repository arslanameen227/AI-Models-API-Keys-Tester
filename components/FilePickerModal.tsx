import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { SettingsContext } from '../context/SettingsContext';
import { X, Image, CheckCircle } from 'lucide-react';
import { FileObject } from '../types';

interface FilePickerModalProps {
  onClose: () => void;
  onSelect: (url: string, name: string) => void;
}

const FilePickerModal: React.FC<FilePickerModalProps> = ({ onClose, onSelect }) => {
  const { files } = useContext(SettingsContext);
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);

  const imageFiles = files.filter(f => f.type === 'image');

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={onClose}>
      <div className="bg-base-100-light dark:bg-base-200-dark w-full max-w-3xl h-[70vh] rounded-xl shadow-2xl border border-base-300-light dark:border-base-300-dark flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-base-300-light dark:border-base-300-dark">
          <h2 className="text-xl font-bold">Select Media</h2>
          <button onClick={onClose}><X /></button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {imageFiles.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imageFiles.map(file => (
                <div 
                  key={file.id} 
                  className={`relative cursor-pointer group rounded-lg overflow-hidden border-2 ${selectedFile?.id === file.id ? 'border-brand-primary-light dark:border-brand-primary-dark' : 'border-transparent'}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <img src={file.url} alt={file.name} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {selectedFile?.id === file.id && (
                    <div className="absolute top-1 right-1 bg-brand-primary-light dark:bg-brand-primary-dark rounded-full p-0.5">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Image size={48} />
              <p>No images found in File Manager.</p>
            </div>
          )}
        </div>
        
        <footer className="flex justify-end p-4 border-t border-base-300-light dark:border-base-300-dark bg-base-200-light dark:bg-base-100-dark rounded-b-xl">
          <button 
            onClick={() => selectedFile && onSelect(selectedFile.url, selectedFile.name)}
            disabled={!selectedFile}
            className="px-6 py-2 rounded-md text-sm font-medium bg-success text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Insert Media
          </button>
        </footer>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default FilePickerModal;
