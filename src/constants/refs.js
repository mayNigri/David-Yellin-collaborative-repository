import { collection, doc } from "firebase/firestore";
import { firestore } from "../services/firebase";

export const lessonsRef = collection(firestore, "lessons");
export const usersRef = collection(firestore, "users");
export const lessonRef = (id) => doc(collection(firestore, "lessons"), id);
export const userRef = (id) => doc(collection(firestore, "users"), id);
