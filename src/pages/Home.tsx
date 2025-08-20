import Banner from '../components/Banner';

const Home = () => {
  return (
    <div className="dashboard-page">
      <Banner
        title="Bem-vindo ao Sistema da Faculdade!"
        description="Nosso sistema oferece uma plataforma prática e segura para você acompanhar as atividades acadêmicas, participar das assembleias e exercer seu direito de voto com transparência. Conectando alunos, professores e colaboradores para uma gestão colaborativa e eficiente."
      />
    </div>
  );
};

export default Home;
