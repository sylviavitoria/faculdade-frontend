import CreateStudent from '../components/CreateStudent';

const Student = () => {
  return (
    <>
      {/* <Banner
        title="Gestão de Alunos"
        description="Gerencie todos os alunos matriculados na instituição. Visualize, edite e acompanhe o progresso acadêmico dos estudantes."
      /> */}
      <div className="content">
        <CreateStudent />
      </div>
    </>
  );
};

export default Student;
