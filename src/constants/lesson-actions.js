import { arrayRemove, arrayUnion, endAt, getDoc, getDocs, limit, orderBy, query, startAt, updateDoc, where } from "firebase/firestore"
import { lessonsRef, userRef } from "./refs";

export const getMyLessons = async (uid) => {
    const q = query(lessonsRef, limit(5), where("uid", "==", uid));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }));
}

export const getLessonsByFilter = async ({ track, _class, grade, free_text }) => {

    const queries = [].concat(track ? where("track", "==", track) : [], _class ? where("class", "==", _class) : [], grade ? where("grade", "==", grade) : []).concat(free_text ? [orderBy("name"), startAt(free_text), endAt(free_text + '\uf8ff')] : []);

    const q = query(lessonsRef, limit(5), ...queries);
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }));
}

export const searchByFieldText = async (searchText) => {
    const docs = await getDocs(query(lessonsRef,));

    return docs.map((d) => ({
        ...d.data(),
        id: d.id
    }));
}


export const addToFavorites = async (uid, lessonId) => {
    const r = await updateDoc(userRef(uid), {
        favorites: arrayUnion(lessonId)
    });

    return r;

}

export const removeFromFavorites = async (uid, lessonId) => {
    const r = await updateDoc(userRef(uid), {
        favorites: arrayRemove(lessonId)
    });

    return r;
}