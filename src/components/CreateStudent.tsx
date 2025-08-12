import StudentForm from './form/StudentForm';
import useStudentForm from '../hooks/useStudentForm';
import CreateEntity from './generic/CreateEntity';
import './style/Forms.css';

function CreateStudent() {
  const { formData, errors, isSubmitting, isSubmitted, handleChange, handleSubmit } = useStudentForm();

  return (
    <div className="create-student">
      <CreateEntity
        title="Cadastrar Estudante"
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        FormComponent={StudentForm}
      />
    </div>
  );
}

export default CreateStudent;
