import { getDoc, getDocs, limit, query, where } from "firebase/firestore"
import { lessonsRef } from "./refs";

export const getMyLessons = async (uid) => {
    const q = query(lessonsRef, limit(5), where("uid", "==", uid));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }));
}

export const getLessonsByFilter = async (filter) => {
    const q = query(lessonsRef, limit(5), where("filter", "==", filter));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }));
}