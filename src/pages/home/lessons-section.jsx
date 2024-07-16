import { Link } from "react-router-dom";
import LessonCard from "../../components/lesson-card";
import { useSelector } from "react-redux";
import { selectUserDoc } from "../../redux/auth-slice";
import { Button } from "../../components/ui/button";

const LessonsSection = ({ lessons, title, count, onPressFetchMore }) => {
    const user = useSelector(selectUserDoc);
    return (
        <>
            <h2 className="py-5">{title}</h2>
            <div id="divider" className="border-b border-slate-300 mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-5">
                {lessons.map((lesson) => (
                    <Link
                        key={lesson.id}
                        className="w-fit border rounded-lg"
                        to={`/lesson/${lesson.id}`}
                    >
                        <LessonCard
                            lesson={lesson}
                            isFavorite={(user.favorites || []).includes(lesson.id)}
                        />
                    </Link>
                ))}
            </div>
            {lessons.length < count && <Button onClick={onPressFetchMore}>הצג עוד תוצאות</Button>}
            <p>מציג {lessons.length} תוצאות מתוך {count}</p>
        </>
    );
}

export default LessonsSection;