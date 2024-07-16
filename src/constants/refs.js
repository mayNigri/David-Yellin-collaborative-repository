import { collection, doc, query, where, limit, orderBy, startAfter, getDocs, getCountFromServer, startAt, Timestamp } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const lessonsRef = collection(firestore, "lessons");
export const usersRef = collection(firestore, "users");
export const lessonRef = (id) => doc(collection(firestore, "lessons"), id);
export const userRef = (id) => doc(collection(firestore, "users"), id);
export const commentsRef = (lessonId) => collection(lessonRef(lessonId), "comments");
export const commentRef = (lessonId, commentId) => doc(commentsRef(lessonId), commentId);
export const notificationsRef = (uid) => collection(firestore, doc(firestore, "users", uid).path, "notifications")
export const notificationsQuery = (uid, _limit = 20) => query(collection(firestore, doc(firestore, "users", uid).path, "notifications"), orderBy("createdAt"), limit(_limit))


const ITEMS_PER_PAGE = 8;
export const getLessonsByPageQuery = async (lastDate, ...queryParams) => {

    const startAfterQ = lastDate ? [startAfter(lastDate)] : []

    const docs = await getDocs(query(lessonsRef, ...queryParams, limit(ITEMS_PER_PAGE), orderBy("createdAt", "desc"), ...startAfterQ));
    const cnt = await getCountFromServer(query(lessonsRef, ...queryParams, orderBy("createdAt", "desc")))
    return {
        docs: docs.docs.map((d) => ({
            ...d.data(),
            id: d.id,
        })),
        count: cnt._data.count.integerValue
    }
}
