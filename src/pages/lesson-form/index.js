const LessonFormPage = () => {

    return (
        <div>
            <h1 className="text-3xl font-bold">יצירת מערך שיעור</h1>
            <form className="flex flex-col items-start justify-start">
                <input type="text" placeholder="שם המערך" />
                <label>מסלול</label>
                <select>
                    <option>גיל הרך</option>
                    <option>גיל הרך חינוך מיוחד</option>
                </select>
                <label>חוג</label>
                <select>
                    <option>שילוב אומנויות</option>
                    <option>חינוך כיתה</option>
                </select>
                <label>כיתה</label>
                <select>
                    <option>גן</option>
                    <option>כיתה א׳</option>
                </select>
                <input type="text" placeholder="תיאור המערך" />

                <input type="file" />
                <button className="bg-black p-2 text-white rounded-md">יצירה</button>
            </form>
        </div>
    );
}

export default LessonFormPage;