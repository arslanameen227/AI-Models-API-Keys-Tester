import React, { useContext, useState } from 'react';
import { ShieldCheck, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SettingsContext } from '../context/SettingsContext';
import LoginModal from './LoginModal';

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { settings } = useContext(SettingsContext);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 sticky top-0 bg-base-100/80 backdrop-blur-sm z-10 border-b border-base-200">
        <div 
          className="flex items-center gap-3"
        >
          <h1 className="text-xl font-bold text-gray-200">{settings.siteTitle}</h1>
        </div>
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
             <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-base-300 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
          ) : (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-brand-primary text-white hover:bg-brand-secondary transition-colors"
            >
              <User className="h-4 w-4" />
              Admin Login
            </button>
          )}
        </nav>
      </header>
      {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} />}
    </>
  );
};

export default Header;