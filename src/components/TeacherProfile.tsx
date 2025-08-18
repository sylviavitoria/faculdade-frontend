import { useState, useEffect } from 'react';
import { teacherService } from '../service/TeacherService';
import { TeacherResponse } from '../types/Teacher';

const TeacherProfile = () => {
  const [teacherData, setTeacherData] = useState<TeacherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        setLoading(true);
        const data = await teacherService.getMe();
        setTeacherData(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do perfil';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
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
    <div className="teacher-profile">
      <div className="page-header">
        <h1>Meus Dados</h1>
        <p>Visualize suas informações como professor</p>
      </div>

      {teacherData && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <i className="fas fa-chalkboard-teacher"></i>
            </div>
            <div className="profile-info">
              <h2>{teacherData.nome}</h2>
              <p className="profile-role">Professor</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>
                <i className="fas fa-envelope"></i>
                E-mail
              </label>
              <span>{teacherData.email}</span>
            </div>

            <div className="detail-group">
              <label>
                <i className="fas fa-user"></i>
                Nome Completo
              </label>
              <span>{teacherData.nome}</span>
            </div>

            <div className="detail-group">
              <label>
                <i className="fas fa-id-badge"></i>
                ID do Professor
              </label>
              <span>#{teacherData.id}</span>
            </div>
          </div>

          <div className="profile-actions">
            <div className="info-note">
              <i className="fas fa-info-circle"></i>
              <p>Para alterar seus dados, entre em contato com a administração.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
