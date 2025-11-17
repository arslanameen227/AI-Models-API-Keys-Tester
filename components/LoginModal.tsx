import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import { X, Loader } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      onClose();
    }
  };
  
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-base-200 w-full max-w-md m-4 p-8 rounded-xl shadow-2xl border border-base-300 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X />
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-base-300 border border-gray-500 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-base-300 border border-gray-500 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="password"
            />
          </div>
          {error && <p className="text-sm text-error text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 bg-brand-primary text-white font-semibold rounded-md shadow-lg hover:bg-brand-secondary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="animate-spin h-5 w-5" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
};

export default LoginModal;