import { addDoc, arrayUnion, deleteDoc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { StarIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { Button, buttonVariants } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "../../components/ui/label";
import { getUserById } from '../../constants/user-actions'
import NotFound from "../not-found";
import LoadingIndicator from "../../components/loading-indicator";
import Rating from "../../components/rating";
import ConfirmationModal from "../../components/confirmation-modal";

const LessonPage = () => {
  const lessonId = useParams().id;

  const [lesson, setLesson] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [creator, setCreator] = useState("")
  const [comments, setComments] = useState([]);
  const [postingComment, setIsPostingComment] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-[calc(100vh-144px)] flex items-center justify-center">
      <LoadingIndicator />
    </div>;
  }

  if (error) {
    return <NotFound />
    // return <div>Error: {error}</div>;
  }

  const isFavorite = (user.favorites || []).includes(lessonId);
  const Fav = StarIcon;


  return (
    <div className="p-5 space-y-5 min-h-[calc(100vh-144px)] justify-center items-center flex flex-col">
      <ConfirmationModal
        show={Boolean(showConfirmationModal)}
        onClose={() => setShowConfirmationModal(null)}
        onConfirm={async () => {
          await deleteDoc(lessonRef(showConfirmationModal));
          navigate("/")
        }}
        message={"האם אתה בטוח שברצונך למחוק את מערך השיעור?"}
      />
      <div className="space-y-5">
        <div className="border bg-white p-5 rounded-md shadow-lg">

          <div className="flex gap-10 items-center justify-between">
            <h1>{lesson.name}</h1>
            <button className="flex space-x-2 space-x-reverse" onClick={handleAddOrRemoveFavorite}>
              <span>{!isFavorite ? "הוספה למועדפים" : "הסרה מהמועדפים"}</span>
              <Fav className={`${isFavorite ? "fill-yellow-300" : "fill-white"}`} />
            </button>
          </div>
          <Rating lessonId={lessonId} />
          <div>
            <div className="">
              <div>
                <div className="space-y-2">
                  <p><b>מסלול: </b> {lesson.track}</p>
                  <p><b>חוג: </b> {lesson.class}</p>
                  <p><b>כיתה: </b> {lesson.grade}</p>
                  <p><b>יוצר השיעור: </b> {creator}</p>
                  <p><b>עודכן לאחרונה: </b> {new Date(lesson.updatedAt.toMillis()).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            </div>


            <div className="py-3">{lesson.description}</div>
          </div>

          {Boolean(lesson.fileUrl) && (
            <div className="py-5 flex gap-2">
              <a
                href={lesson.fileUrl}
                download={lesson.fileUrl.split("/").pop()}
                target="_blank"
                className="bg-black p-2 text-white rounded-md"
              >
                הורדת שיעור
              </a>
              <div>
                <b>פורמט: </b>
                {lesson.fileUrl.split(".").pop().split("?")[0]}
              </div>
            </div>
          )}
          <div className="w-full flex items-end justify-end gap-3">
            <Link className={buttonVariants()} to={`/updatelesson/${lessonId}`}>
              עריכה
            </Link>
            <Button variant="destructive" onClick={() => setShowConfirmationModal(lessonId)}>
              מחיקה
            </Button>
          </div>
        </div>

        <div className="border bg-white p-5 rounded-md shadow-lg">
          <form onSubmit={commentForm.handleSubmit(onPostComment)} className="flex flex-col items-start space-y-2">
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
      </div>
    </div>
  );
};

export default LessonPage;
