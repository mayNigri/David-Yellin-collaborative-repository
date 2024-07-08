import { collection, doc, query, where, limit } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const lessonsRef = collection(firestore, "lessons");
export const usersRef = collection(firestore, "users");
export const lessonRef = (id) => doc(collection(firestore, "lessons"), id);
export const userRef = (id) => doc(collection(firestore, "users"), id);
export const commentsRef = (lessonId) => collection(lessonRef(lessonId), "comments");
export const commentRef = (lessonId, commentId) => doc(commentsRef(lessonId), commentId);
export const notificationsRef = (uid) => collection(firestore, doc(firestore, "users", uid).path, "notifications")
export const notificationsQuery = (uid, _limit = 20) => query(collection(firestore, doc(firestore, "users", uid).path, "notifications"), limit(_limit))
