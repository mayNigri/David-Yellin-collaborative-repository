import { firestore } from '../services/firebase';
import { addDoc, collection, getDoc, doc, query, getDocs, limit, deleteDoc, updateDoc } from 'firebase/firestore';

const collectionRef = collection(firestore, "Lessons")

const validate = (data) => {

    if (typeof (data.title) !== 'string') {
        return "Please set title as string";
    }

    if (typeof (data.description) !== 'string') {
        return "Please set description as string";
    }

    if (typeof (data.teacher) !== 'string') {
        return "Please set teacher as string";
    }

    return true;
}

const updateValidate = (data) => {

    if ('created_at' in data) {
        return "Cant update created time";
    }

    if ('updated_at' in data) {
        return "Cant update updated time";
    }

    return true;
}

const convertDataToLesson = (id, data) => {
    return new Lesson(
        id,
        data.title,
        data.description,
        data.teacher,
        data.created_at,
        data.updated_at
    )
}

export class Lesson {

    _id;
    _title;
    _teacher;
    _description;
    _created_at;
    _updated_at;

    constructor(id, title, description, teacher, created_at, updated_at) {
        this._id = id;
        this._title = title;
        this._teacher = teacher;
        this._description = description;
        this._created_at = created_at;
        this._updated_at = updated_at;

        // // Rating
        // this.total_rate = 0;
        // this.number_of_rates = 0;
        // this.rating = 0;
    }

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get teacher() {
        return this._teacher
    }

    get created_at() {
        return this._created_at
    }

    get updated_at() {
        return this._created_at
    }

    static async createLesson(data) {
        // validation
        const check = validate(data);
        if (check !== true) {
            throw new Error(check)
        }

        const response = await addDoc(collectionRef, {
            ...data,
            _created_at: Date.now(),
            _updated_at: Date.now()
        });
    }

    static async listLessons(_limit = 10) {
        const q = query(collectionRef, limit(_limit)); // Adjust limit as needed
        const response = await getDocs(q)
        return response.docs.map((_doc) => {
            return convertDataToLesson(_doc.id, _doc.data())
        })
    }

    static async deleteLessonById(id) {
        const lessonDocRef = doc(firestore, `${collectionRef.path}/${id}`)
        const response = await deleteDoc(lessonDocRef)
    }

    static async updateLessonById(id, data) {

        // validation
        const check = updateValidate(data);
        if (check !== true) {
            throw new Error(check)
        }


        const lessonDocRef = doc(firestore, `${collectionRef.path}/${id}`)


        // update function
        const response = await updateDoc(lessonDocRef, {
            ...data,
            updated_at: Date.now()
        });
    }

    static async getLessonById(id) {
        const lessonDocRef = doc(firestore, `${collectionRef.path}/${id}`)
        const lessonDocSnap = await getDoc(lessonDocRef)
        const lessonDoc = lessonDocSnap.data();

        return convertDataToLesson(id, lessonDoc);
    }
}