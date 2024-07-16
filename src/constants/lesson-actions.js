import { addDoc, arrayRemove, arrayUnion, deleteDoc, endAt, getDoc, getDocs, limit, orderBy, query, serverTimestamp, startAt, updateDoc, where } from "firebase/firestore"
import { commentsRef, lessonRef, lessonsRef, notificationsRef, userRef, usersRef } from "./refs";
import { firestore } from "../services/firebase";

export const getMyLessons = async (uid) => {
    const q = query(lessonsRef, where("uid", "==", uid));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({
        ...d.data(),
        id: d.id
    }));
}

export const getLessonsByFilter = async ({ track, _class, grade, free_text }) => {

    const queries = [].concat(track ? where("track", "==", track) : [], _class ? where("class", "==", _class) : [], grade ? where("grade", "==", grade) : []).concat(free_text ? [orderBy("name"), startAt(free_text), endAt(free_text + '\uf8ff')] : []);

    const q = query(lessonsRef, ...queries);
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

export const createLesson = async (uid, input) => {
    const lessonDoc = await addDoc(lessonsRef, {
        uid,
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    })
    return lessonDoc;
}

export const updateLesson = async (lessonId, input) => {
    const lessonDoc = await updateDoc(lessonRef(lessonId), {
        ...input,
        updatedAt: serverTimestamp()
    })
    return lessonDoc;
}

export const getLessonById = async (lessonId) => {
    const doc = await getDoc(lessonRef(lessonId));
    return {
        ...doc.data(),
        id: doc.id
    };
}

export const getLessonComments = async (lessonId, _limit = 5) => {
    const comments = await getDocs(query(commentsRef(lessonId), limit(_limit), orderBy("createdAt", "desc")))
    return comments.docs.map((d) => d.data());
}

export const postComment = async (uid, user_name, lessonId, comment) => {
    const commentDoc = await addDoc(commentsRef(lessonId), {
        uid,
        name: user_name,
        comment,
        createdAt: serverTimestamp()
    })

    const lessonDoc = await getLessonById(lessonId);

    // enable this line in production:
    if (lessonDoc.uid === uid) return commentDoc.id;

    // create notification
    try {
        await addDoc(notificationsRef(lessonDoc.uid), {
            uid,
            user_name,
            lessonId,
            type: "comment",
            createdAt: serverTimestamp(),
            read: false
        })
    }
    catch (e) {
        console.log(e);
    }

    return commentDoc.id;
}

export const searchLessonByName = async (name) => {
    const q = query(lessonsRef, orderBy("name"), startAt(name), endAt(name + '\uf8ff'))
    const result = await getDocs(q);
    return result.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}

export const deleteLesson = async (id) => {
    await deleteDoc(lessonRef(id));
    const toUpdate = await getDocs(query(usersRef, where("favorites", "array-contains", id)));
    console.log(toUpdate.docs.map((d) => d.id));
    const updateArr = await Promise.all(toUpdate.docs.map((d) => {
        return updateDoc(userRef(d.id), {
            favorites: arrayRemove(id)
        });
    }))

    return true;
}