import React, { useContext, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import LoginModal from './LoginModal';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { settings } = useContext(SettingsContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 sticky top-0 bg-base-100-light/80 dark:bg-base-100-dark/80 backdrop-blur-sm z-10 border-b border-base-300-light dark:border-base-200-dark">
        <div 
          className="flex items-center gap-3"
        >
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">{settings.siteTitle}</h1>
        </div>
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {isLoggedIn ? (
             <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-base-200-light dark:hover:bg-base-300-dark transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary-light dark:bg-brand-primary-dark text-white hover:opacity-90 transition-opacity"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Login</span>
            </button>
          )}
        </nav>
      </header>
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </>
  );
};

export default Header;