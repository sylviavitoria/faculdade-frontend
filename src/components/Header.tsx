import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import './style/Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <div className="header-content">
        <div className="header-left">
          {isMobile && (
            <button 
              className="menu-toggle"
              onClick={onMenuToggle}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars"></i>
            </button>
          )}
          <div className="header-title">
            <h1>Sistema de Faculdade</h1>
          </div>
        </div>
        <div className="header-actions">
          <div className="user-menu">
            <button 
              className="btn-user"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <i className="fas fa-user"></i>
              <span>{user?.nome || 'Usuário'}</span>
              <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p><strong>{user?.nome}</strong></p>
                  <p>{user?.email}</p>
                  <p className="role-info">
                    <span>Role: </span>
                    <span className="role-badge">{user?.role?.replace('ROLE_', '') || 'N/A'}</span>
                  </p>
                </div>
                <button onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
