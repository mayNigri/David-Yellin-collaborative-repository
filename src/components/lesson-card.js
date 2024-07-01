import { StarIcon } from "lucide-react";

const LessonCard = ({ lesson, isFavorite = false }) => {

  const Fav = StarIcon;

  return (
    <div className="rounded-md bg-white shadow-md w-96 h-52 p-3">
      <div className="flex flex-row justify-between w-full">
        <div>
          <h2>{lesson.name || "שם השיעור"}</h2>
          <p>{lesson.class || "חוג"}</p>
        </div>

        <Fav className={`${isFavorite ? 'fill-yellow-300' : 'fill-white'}`} />
      </div>

      <div className="mt-5">
        <p>{lesson.description || "תיאור המערך"}</p>
        <p>{lesson.track || "מסלול"}</p>
        <p>{lesson.grade || "כיתה"}</p>
      </div>
    </div>
  );
};

export default LessonCard;
