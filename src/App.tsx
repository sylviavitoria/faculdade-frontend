import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Disciplines from './pages/Disciplines';
import Registration from './pages/Registration';
import Notes from './pages/Notes';
import Reports from './pages/Reports';

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
            <Route path="/professores" element={<Teacher />} />
            <Route path="/disciplinas" element={<Disciplines />} />
            <Route path="/matriculas" element={<Registration />} />
            <Route path="/notas" element={<Notes />} />
            <Route path="/relatorios" element={<Reports />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;