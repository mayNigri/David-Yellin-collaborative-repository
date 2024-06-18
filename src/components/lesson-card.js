import { StarIcon } from 'lucide-react'

const LessonCard = (lesson) => {
    return (
        <div className="rounded-md bg-white shadow-md w-96 h-52 p-3">
            <div className='flex flex-row justify-between w-full'>
                <div>
                    <h2>{lesson.name || "שם השיעור"}</h2>
                    <p>{lesson.major || "חוג"}</p>
                </div>

                <StarIcon />
            </div>

            <div className='mt-5'>
                <p>{lesson.description || "תיאור המערך"}</p>
                <p>{lesson.course || "מסלול"}</p>
                <p>{lesson.class || "כיתה"}</p>
            </div>

        </div>
    );
}

export default LessonCard;