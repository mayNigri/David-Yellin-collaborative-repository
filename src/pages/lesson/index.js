import { getDoc } from "firebase/firestore";
import { StarIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { lessonRef, userRef } from "../../constants/refs";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDoc, setUserDoc } from "../../redux/auth-slice";
import { addToFavorites, removeFromFavorites } from "../../constants/lesson-actions";

const LessonPage = () => {
  const lessonId = useParams().id;

  const [lesson, setLesson] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const user = useSelector(selectUserDoc);
  const dispatch = useDispatch()

  useEffect(() => {
    setError(null);
    setLoading(true);
    getDoc(lessonRef(lessonId))
      .then((d) =>
        d.exists() ? setLesson(d.data()) : setError("מערך השיעור לא נמצא")
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const handleAddOrRemoveFavorite = async () => {
    const prom = await (isFavorite ? removeFromFavorites(user.id, lessonId) : addToFavorites(user.id, lessonId));
    const userDoc = await getDoc(userRef(user.id));
    if (userDoc.exists()) {
      dispatch(setUserDoc(userDoc.data()));
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isFavorite = (user.favorites || []).includes(lessonId);
  const Fav = StarIcon;

  return (
    <div>
      <div className="flex gap-10 items-center ">
        <h1>{lesson.name}</h1>
        <button onClick={handleAddOrRemoveFavorite}>
          <Fav className={`${isFavorite ? 'fill-yellow-300' : 'fill-white'}`} />
        </button>
      </div>
      <div>
        <div>
          <div className="divide-dotted"></div>
          <p>יוצר השיעור תאריך יצירה או עדכון כיתה חוג מסלול</p>
        </div>
        <div className="flex flex-row space-x-2 space-x-reverse">
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>
      </div>

      <div>{lesson.description}</div>

      <div>
        <button className="bg-black p-2 text-white rounded-md">
          הורדת שיעור
        </button>
      </div>

      <div className="mt-5 flex flex-col items-start">
        <h2>תגובות</h2>
        <textarea className="shadow-md w-96 border border-black" />
        <button className="bg-black p-2 text-white rounded-md">שליחה</button>
      </div>

      <div className="mt-5">
        <h3>ג׳ניה</h3>
        <p>אחלה שיעור</p>
      </div>
    </div>
  );
};

export default LessonPage;
