import { useParams } from "react-router-dom";
import LessonForm from "./lesson-form";


const LessonFormPage = ({ navAfter = true }) => {

  const id = useParams().id;

  return (
    <div className="p-5 space-y-5 flex flex-col items-center justify-center min-h-[calc(100vh-144px)]">
      <h1 className="text-3xl font-bold mb-3">{id ? 'עריכת' : 'יצירת'} מערך שיעור</h1>
      <LessonForm navAfter={navAfter} id={id} />
    </div>
  );
};

export default LessonFormPage;
