import { getDoc, getDocs, orderBy, query, startAt, endAt } from "firebase/firestore";
import { userRef, usersRef } from "./refs";

export const getUserById = async (uid) => {
    const userDoc = await getDoc(userRef(uid));
    return userDoc.data();
}

export const searchUsersByName = async (name) => {
    const q = query(usersRef, orderBy("fullName"), startAt(name), endAt(name + '\uf8ff'))
    const result = await getDocs(q);
    return result.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}