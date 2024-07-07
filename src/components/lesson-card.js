import { StarIcon } from "lucide-react";

const LessonCard = ({ lesson, isFavorite = false }) => {
  const Fav = StarIcon;

  return (
    <div className="h-52 flex flex-col p-5 w-[300px]">
      <div className="flex flex-row justify-between w-full">
        <div>
          <h2>{lesson.name || "שם השיעור"}</h2>
          <p>{lesson.class || "חוג"}</p>
        </div>

        <Fav className={`${isFavorite ? "fill-yellow-300" : "fill-white"}`} />
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
