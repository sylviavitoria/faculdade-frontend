import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Student from './pages/Student';
import Professores from './pages/Professores';
import Disciplinas from './pages/Disciplinas';
import Matriculas from './pages/Matriculas';
import Notas from './pages/Notas';
import Relatorios from './pages/Relatorios';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div className="main-content">
          <Header onMenuToggle={toggleSidebar} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alunos" element={<Student />} />
            <Route path="/professores" element={<Professores />} />
            <Route path="/disciplinas" element={<Disciplinas />} />
            <Route path="/matriculas" element={<Matriculas />} />
            <Route path="/notas" element={<Notas />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;