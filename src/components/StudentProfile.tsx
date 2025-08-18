import { useState, useEffect } from 'react';
import { studentService } from '../service/StudentService';
import { StudentResponse } from '../types/Student';

const StudentProfile = () => {
  const [studentData, setStudentData] = useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        const data = await studentService.getMe();
        setStudentData(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do perfil';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div>Carregando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" style={{ textAlign: 'center', padding: '2rem' }}>
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="student-profile">
      <div className="page-header">
        <h1>Meus Dados</h1>
        <p>Visualize suas informações acadêmicas</p>
      </div>

      {studentData && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="profile-info">
              <h2>{studentData.nome}</h2>
              <p className="profile-role">Aluno</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>
                <i className="fas fa-id-card"></i>
                Matrícula
              </label>
              <span>{studentData.matricula}</span>
            </div>

            <div className="detail-group">
              <label>
                <i className="fas fa-envelope"></i>
                E-mail
              </label>
              <span>{studentData.email}</span>
            </div>

            <div className="detail-group">
              <label>
                <i className="fas fa-user"></i>
                Nome Completo
              </label>
              <span>{studentData.nome}</span>
            </div>

            <div className="detail-group">
              <label>
                <i className="fas fa-calendar"></i>
                ID do Aluno
              </label>
              <span>#{studentData.id}</span>
            </div>
          </div>

          <div className="profile-actions">
            <div className="info-note">
              <i className="fas fa-info-circle"></i>
              <p>Para alterar seus dados, entre em contato com a secretaria acadêmica.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
