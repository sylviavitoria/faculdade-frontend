import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './style/Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'fa-home' },
    { path: '/alunos', label: 'Alunos', icon: 'fa-user-graduate' },
    { path: '/professores', label: 'Professores', icon: 'fa-chalkboard-teacher' },
    { path: '/disciplinas', label: 'Disciplinas', icon: 'fa-book' },
    { path: '/matriculas', label: 'Matrículas', icon: 'fa-clipboard-list' },
    { path: '/notas', label: 'Notas', icon: 'fa-star' },
    { path: '/relatorios', label: 'Relatórios', icon: 'fa-chart-bar' },
    { path: '/logout', label: 'Logs do Sistema', icon: 'fa-sign-out-alt' }
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <div className={`sidebar ${isMobile ? (isOpen ? 'open' : '') : 'desktop'}`}>        
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <Link to={item.path} className="sidebar-link" onClick={handleLinkClick}>
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
