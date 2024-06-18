import { StarIcon } from 'lucide-react'

const LessonPage = () => {
    return (
        <div>
            <h1>דף שיעור</h1>
            <div>
                <div>
                    <p>
                        יוצר השיעור
                        תאריך יצירה או עדכון
                        כיתה
                        חוג
                        מסלול
                    </p>
                </div>
                <div className='flex flex-row space-x-2 space-x-reverse'>
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                </div>
            </div>

            <div>
                תיאור מערך השיעור
            </div>

            <div>
                <button className="bg-black p-2 text-white rounded-md">הורדת שיעור</button>
            </div>

            <div className='mt-5 flex flex-col items-start'>
                <h2>תגובות</h2>
                <textarea className='shadow-md w-96 border border-black' />
                <button className="bg-black p-2 text-white rounded-md">שליחה</button>
            </div>

            <div className='mt-5'>
                <h3>ג׳ניה</h3>
                <p>אחלה שיעור</p>
            </div>
        </div>
    );
}

export default LessonPage;