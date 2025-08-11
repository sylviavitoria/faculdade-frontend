import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './style/Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
      <div className="logo">
        <h1 className="logo-text"><span>Sistema</span> de Faculdade</h1>
      </div>
      <i
        className={`fa fa-bars menu ${menuOpen ? 'active' : ''}`}
        id="menuToggle"
        data-testid="menuToggle"
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <ul className={`nav ${menuOpen ? 'menu-open' : ''}`} id="menuItems">
        <li><Link to="/" onClick={() => isMobile && setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/member" onClick={() => isMobile && setMenuOpen(false)}>Alunos</Link></li>
        <li><Link to="/agenda" onClick={() => isMobile && setMenuOpen(false)}>Disciplinas</Link></li>
        <li><Link to="/voting-session" onClick={() => isMobile && setMenuOpen(false)}>Professor</Link></li>
        <li><Link to="/vote" onClick={() => isMobile && setMenuOpen(false)}>Matriculas</Link></li>
      </ul>
    </header>
  );
};

export default Header;
