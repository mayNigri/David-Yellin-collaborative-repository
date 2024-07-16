import { and, count, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { lessonsRef, usersRef } from "../../constants/refs";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
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

    const [usersCreated, setUsersCreated] = useState(0);
    const [usersByCollege, setUsersByCollege] = useState({});
    const [usersByYear, setUsersByYear] = useState({});
    
    const [lessonsCreated, setLessonsCreated] = useState(0);
    const [lessonsByTrack, setLessonsByTrack] = useState({});
    const [lessonsByClass, setLessonsByClass] = useState({});
    const [lessonsByGrade, setLessonsByGrade] = useState({});

    const [loading, setLoading] = useState(true)

    const [lessonsCreated_alltime, setLessonsCreated_alltime] = useState(0);
    const [usersCreated_alltime, setUsersCreated_alltime] = useState(0);

    const { register, setValue, handleSubmit, watch } = useForm({
        defaultValues: {
            from: (new Date()).toISOString().split('T')[0],
            to: (new Date()).toISOString().split('T')[0]
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
        getCountFromServer(query(lessonsRef))
            .then((data) => setLessonsCreated_alltime(data._data.count.integerValue))

        getCountFromServer(query(usersRef))
            .then((data) => setUsersCreated_alltime(data._data.count.integerValue))

        getUsers().then((docs) => {
            count_users_by_college(docs).then((data) => setUsersByCollege(data));
            count_users_by_year(docs).then((data) => setUsersByYear(data));
        })
            .then(() => setLoading(false))

        getLessons().then((docs) => {
            count_lessons_by_track(docs).then((data) => setLessonsByTrack(data));
            count_lessons_by_class(docs).then((data) => setLessonsByClass(data));
            count_lessons_by_grade(docs).then((data) => setLessonsByGrade(data));
        })
            .then(() => setLoading(false))

    }, [])

    const onSubmit = ({ from, to }) => {
        getCountFromServer(queryLessonsByCreateTime(new Date(from).getTime() - 10800000, new Date(to).getTime() - 10800000))
            .then((data) => setLessonsCreated(data._data.count.integerValue))

        getCountFromServer(queryUsersByCreateTime(new Date(from).getTime() - 10800000, new Date(to).getTime() - 10800000))
            .then((data) => setUsersCreated(data._data.count.integerValue))
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

            <p>
                מערכי שיעור שנוצרו במערכת: {lessonsCreated_alltime}
            </p>

            <p>
                משתמשים שנוצרו במערכת: {usersCreated_alltime}
            </p>
                <div className="grid grid-cols-2 gap-5">
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