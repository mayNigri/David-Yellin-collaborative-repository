import { getDoc } from "firebase/firestore";
import { userRef } from "./refs";

export const getUserById = async (uid) => {
    const userDoc = await getDoc(userRef(uid));
    return userDoc.data();
}