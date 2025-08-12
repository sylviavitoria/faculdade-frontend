import { useState, useEffect } from 'react';
import './style/Header.css';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
          <button className="btn-user">
            <i className="fas fa-user"></i>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
