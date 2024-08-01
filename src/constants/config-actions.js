import { arrayRemove, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import { collegesRef } from "./refs";

export const getColleges = async () => {
    const doc = await getDoc(collegesRef);
    return doc.data().names || [];
}

export const addCollege = async (name) => {
    await updateDoc(collegesRef, {
        names: arrayUnion(name)
    });
}

export const removeCollege = async (name) => {
    await updateDoc(collegesRef, {
        names: arrayRemove(name)
    });
}