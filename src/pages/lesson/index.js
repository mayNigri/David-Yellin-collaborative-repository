import { addDoc, arrayUnion, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { StarIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import { commentsRef, lessonRef, userRef } from "../../constants/refs";
import { useDispatch, useSelector } from "react-redux";
import { selectUserDoc, setUserDoc } from "../../redux/auth-slice";
import {
  addToFavorites,
  getLessonById,
  getLessonComments,
  postComment,
  removeFromFavorites,
} from "../../constants/lesson-actions";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "../../components/ui/label";
import { getUserById } from '../../constants/user-actions'

const LessonPage = () => {
  const lessonId = useParams().id;

  const [lesson, setLesson] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [creator, setCreator] = useState("")
  const [comments, setComments] = useState([]);
  const [postingComment, setIsPostingComment] = useState(false);

  const user = useSelector(selectUserDoc);
  const dispatch = useDispatch();

  const getLessonDoc = async () => {
    setError(null);
    setLoading(true);

    try {
      const lessonData = await getLessonById(lessonId);
      if (!lessonData) {
        setError("מערך השיעור לא נמצא");
        setLoading(false);
        return;
      }

      setLesson(lessonData);

      const creatorDoc = await getUserById(lessonData.uid);
      if (!creatorDoc) {
        setCreator("משתמש לא נמצא")
      }
      setCreator(creatorDoc.fullName);

      const lessonComments = await getLessonComments(lessonId);
      setComments(lessonComments);
    }
    catch (e) {
      setError(e.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLessonDoc();
  }, [lessonId]);

  const handleAddOrRemoveFavorite = async () => {
    const prom = await (isFavorite
      ? removeFromFavorites(user.id, lessonId)
      : addToFavorites(user.id, lessonId));
    const userDoc = await getDoc(userRef(user.id));
    if (userDoc.exists()) {
      dispatch(setUserDoc(userDoc.data()));
    }
  };

  const commentForm = useForm({
    defaultValues: {
      comment: ""
    },
    disabled: postingComment
  })

  const onPostComment = async (input) => {
    // post comment
    try {
      setIsPostingComment(true)
      await postComment(user.id, user.fullName, lessonId, input.comment)
      const querySnapshot = await getLessonComments(lessonId);
      setComments(querySnapshot)
    }
    catch (e) {

    }
    commentForm.reset();
    setIsPostingComment(false);
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
    <div className="p-5 space-y-5">
      <div className="flex gap-10 items-center">
        <h1>{lesson.name}</h1>
        <button className="flex space-x-2 space-x-reverse" onClick={handleAddOrRemoveFavorite}>
          <span>{!isFavorite ? "הוספה למועדפים" : "הסרה מהמועדפים"}</span>
          <Fav className={`${isFavorite ? "fill-yellow-300" : "fill-white"}`} />
        </button>
      </div>
      <div>
        <div className="space-y-5">
          <div>
            <div>
              <p><b>מסלול: </b> {lesson.track}</p>
              <p><b>חוג: </b> {lesson.class}</p>
              <p><b>כיתה: </b> {lesson.grade}</p>

              <p><b>יוצר השיעור: </b> {creator}</p>
            </div>
            <div>
              <p><b>עודכן לאחרונה: </b> {new Date(lesson.updatedAt).toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row space-x-2 py-5 space-x-reverse">
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </div>

        <div>{lesson.description}</div>
      </div>

      {Boolean(lesson.fileUrl) && (
        <div>
          <a
            href={lesson.fileUrl}
            download={lesson.fileUrl.split("/").pop()}
            target="_blank"
            className="bg-black p-2 text-white rounded-md"
          >
            הורדת שיעור
          </a>
        </div>
      )}

      <form onSubmit={commentForm.handleSubmit(onPostComment)} className="mt-5 flex flex-col items-start space-y-2">
        <Label>הוספת תגובה</Label>
        <Textarea {...commentForm.register("comment")} className="w-[500px]" />
        <Button loading={postingComment}>שליחה</Button>
      </form>

      {comments.length > 0 && <h2>תגובות</h2>}
      {comments.map((comment) =>
        <div className="mt-2 border rounded-md w-[500px] p-2">
          <p><h3 className="inline">{comment.name}</h3><span className="text-sm inline mx-2">{new Date(comment.createdAt.toMillis()).toLocaleDateString("en-GB")}</span></p>
          <p className="whitespace-normal break-words">{comment.comment}</p>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
