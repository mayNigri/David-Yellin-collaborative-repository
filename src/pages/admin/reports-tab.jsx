import { and, count, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { lessonsRef, usersRef } from "../../constants/refs";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { set, useForm } from "react-hook-form";
import { count_users_by_college, count_users_by_year, count_lessons_by_class, count_lessons_by_grade, count_lessons_by_track } from "../../constants/reports-data";
import { Chart, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import PieChart from "./pie";
import BarChart from './bars'

const queryLessonsByCreateTime = (from, to) => query(lessonsRef, where("createdAt", ">=", new Date(from)), where("createdAt", "<=", new Date(to)));
const queryUsersByCreateTime = (from, to) => query(usersRef, where("createdAt", ">=", new Date(from)), where("createdAt", "<=", new Date(to)));
Chart.register(CategoryScale);
Chart.register(ArcElement);
Chart.register(LinearScale);
Chart.register(BarElement);

const ReportsTab = () => {

    const [usersDocs, setUsersDocs] = useState([]);
    const [lessonsDocs, setLessonsDocs] = useState([]);
    const [datesRange, setDatesRange] = useState([new Date(0).getTime(), new Date().getTime()])

    const usersCreated = useMemo(() => usersDocs.filter((doc) => doc.data().createdAt.toMillis() < datesRange[1] && doc.data().createdAt.toMillis() > datesRange[0]).length, [usersDocs, datesRange]);
    const usersByYear = useMemo(() => count_users_by_year(usersDocs), [usersDocs, datesRange]);
    const usersByCollege = useMemo(() => count_users_by_college(usersDocs), [usersDocs, datesRange]);
    const lessonsByTrack = useMemo(() => count_lessons_by_track(lessonsDocs.filter((doc) => doc.data().createdAt.toMillis() < datesRange[1] && doc.data().createdAt.toMillis() > datesRange[0]), [lessonsDocs, datesRange]));
    const lessonsByClass = useMemo(() => count_lessons_by_class(lessonsDocs.filter((doc) => doc.data().createdAt.toMillis() < datesRange[1] && doc.data().createdAt.toMillis() > datesRange[0]), [lessonsDocs, datesRange]));
    const lessonsByGrade = useMemo(() => count_lessons_by_grade(lessonsDocs.filter((doc) => doc.data().createdAt.toMillis() < datesRange[1] && doc.data().createdAt.toMillis() > datesRange[0]), [lessonsDocs, datesRange]));
    const lessonsCreated = useMemo(() => lessonsDocs.filter((doc) => doc.data().createdAt.toMillis() < datesRange[1] && doc.data().createdAt.toMillis() > datesRange[0]).length, [lessonsDocs, datesRange]);

    const [loading, setLoading] = useState(true)


    const { register, setValue, handleSubmit, watch } = useForm({
        defaultValues: {
            from: (new Date(datesRange[0])).toISOString().split('T')[0],
            to: (new Date(datesRange[1])).toISOString().split('T')[0]
        }
    });

    const getUsers = async () => {
        const users = await getDocs(usersRef);
        return users.docs;
    }

    const getLessons = async () => {
        const lessons = await getDocs(lessonsRef);
        return lessons.docs;
    }

    useEffect(() => {

        Promise.all([getUsers().then((docs) => {
            setUsersDocs(docs)
        }),
        getLessons().then((docs) => {
            setLessonsDocs(docs)
        })])
            .then(() => setLoading(false))

    }, [])

    const onSubmit = ({ from, to }) => {

        setDatesRange([new Date(from).getTime(), new Date(to).getTime()]);

    }

    if (loading) {
        return <div></div>
    }

    return (
        <div className="admin-container">

            <h2>דוחות</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row space-x-reverse space-x-2 items-center">
                <Label>מתאריך: </Label>
                <Input {...register("from", {
                    onChange(e) {
                        setValue('from', e.target.value)
                    }
                })} className="w-40" type="date" />

                <Label>עד לתאריך: </Label>
                <Input {...register("to", {
                    onChange(e) {
                        setValue('to', e.target.value)
                    }
                })} className="w-40" type="date" />

                <Button type="submit">בקש דוח</Button>
            </form>

            <p>
                מערכי שיעור שנוצרו בתאריכים שהוזנו: {lessonsCreated}
            </p>

            <p>
                משתמשים שנוצרו בתאריכים שהוזנו: {usersCreated}
            </p>

            <div className="grid grid-cols-2 gap-10">
                <div className="h-96 w-96">
                    <PieChart labels={Object.keys(usersByCollege)} values={Object.values(usersByCollege)} title={"משתמשים רשומים בכל מכללה"} />
                </div>
                <div className="h-96 w-96">
                    <PieChart labels={Object.keys(usersByYear)} values={Object.values(usersByYear)} title={"משתמשים רשומים לפי שנה"} />
                </div>
                <div className="h-96 w-96">
                    <PieChart labels={Object.keys(lessonsByTrack)} values={Object.values(lessonsByTrack)} title={"שיעורים לפי מסלול"} />
                </div>
                <div className="h-96 w-96">
                    <PieChart labels={Object.keys(lessonsByClass)} values={Object.values(lessonsByClass)} title={"שיעורים לפי כיתה"} />
                </div>
                <div className="h-96 w-96">
                    <PieChart labels={Object.keys(lessonsByGrade)} values={Object.values(lessonsByGrade)} title={"שיעורים לפי חוג"} />
                </div>
                <div className="h-96 w-96">
                    <BarChart labels={Object.keys(usersByYear)} values={Object.values(usersByYear)} title={"משתמשים רשומים לפי שנה"} />
                </div>
            </div>
        </div>
    )
}
export default ReportsTab;