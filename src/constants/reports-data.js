import { query, getCountFromServer } from "firebase/firestore";
import { lessonsRef, usersRef } from "./refs";

export const count_users = async (college) => {
    const q = query(usersRef);
    const cnt = await getCountFromServer(q);
    return cnt._data.count.integerValue;
}

export const count_lessons = async (college) => {
    const q = query(lessonsRef);
    const cnt = await getCountFromServer(q);
    return cnt._data.count.integerValue;
}

export const count_users_by_college = (usersDocs) => {
    return usersDocs.reduce((prev, cur) => {
        const data = cur.data();
        return {
            ...prev,
            [data.college]: (prev[data.college] || 0) + 1
        }
    }, {});
}

export const count_users_by_year = (usersDocs) => {
    return usersDocs.reduce((prev, cur) => {
        const data = cur.data();
        return {
            ...prev,
            [data.year]: (prev[data.year] || 0) + 1
        }
    }, {});

}

export const count_lessons_by_track = (lessonsDocs) => {
    return lessonsDocs.reduce((prev, cur) => {
        const data = cur.data();
            return {
                ...prev,
                [data.track]: (prev[data.track] || 0) + 1
            };
    }, {});
}

export const count_lessons_by_class = (lessonsDocs) => {
    return lessonsDocs.reduce((prev, cur) => {
        const data = cur.data();
            return {
                ...prev,
                [data.class]: (prev[data.class] || 0) + 1
            };
    }, {});
}

export const count_lessons_by_grade = (lessonsDocs, grades) => {
    return lessonsDocs.reduce((prev, cur) => {
        const data = cur.data();
            return {
                ...prev,
                [data.grade]: (prev[data.grade] || 0) + 1
            };
    }, {});
}