import React from 'react';
import Banner from '../components/Banner';
import RegistrationSearchById from '../components/RegistrationSearchById';
import '../pages/style/Registration.css';

const Registration: React.FC = () => {
  return (
    <div className="registration-page">
      <Banner
        title="Consulta de Matrículas"
        description="Busque matrículas específicas por ID. Disponível para alunos, professores e administradores."
      />

      <div className="content-container">
        <div className="search-section">
          <RegistrationSearchById />
        </div>
      </div>
    </div>
  );
};

export default Registration;
