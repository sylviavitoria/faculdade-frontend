import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Student from './pages/Student';
import Teacher from './pages/Teacher';
import Disciplines from './pages/Disciplines';
import Registration from './pages/Registration';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                  <div className="main-content">
                    <Header onMenuToggle={toggleSidebar} />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/alunos" element={<Student />} />
                      <Route path="/professores" element={<Teacher />} />
                      <Route path="/disciplinas" element={<Disciplines />} />
                      <Route path="/matriculas" element={<Registration />} />
                    </Routes>
                    <Footer />
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;