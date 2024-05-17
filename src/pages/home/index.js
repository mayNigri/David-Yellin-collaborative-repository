import { getDoc, DocumentReference, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { firestore } from '../../services/firebase';
import { Lesson } from '../../models/Lesson';

const HomePage = () => {

    const [documentData, setDocumentData] = useState();
    const [lessonData, setLessonData] = useState();
    const [lessonsData, setLessonsData] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        getData();
    }, [])

    async function getData() {
        try {
            const docRef = doc(firestore, "Reports/6x9kzHpc9IVG9g5cjj8e")
            const docSnap = await getDoc(docRef)
            setDocumentData(docSnap.data())
        }

        catch (err) {
            setError(err)
        }

        finally {
            setLoading(false)
        }
    }

    async function createLesson() {

        setLoading(true)
        setError(undefined);

        try {
            const newLesson = await Lesson.createLesson({
                title: "Mathematics",
                description: "New Lesson for mathematics",
                teacher: "Yoav"
            })

            setLessonData(newLesson)
        }
        catch (err) {
            setError(err)
        }
        finally {
            setLoading(false)
        }
    }

    async function getListLessons() {

        setLoading(true)
        setError(undefined);

        try {
            const allLessons = await Lesson.listLessons()
            setLessonsData(allLessons)
        }
        catch (err) {
            setError(err)
        }
        finally {
            setLoading(false)
        }
    }

    async function deleteLesson() {
        setLoading(true)
        setError(undefined);
        try {
            await Lesson.deleteLessonById("xzmMdLhNwVbFkgpsipdj")
        }
        catch (err) {
            setError(err)
        }
        finally {
            setLoading(false)
        }

    }

    async function updateLesson() {
        setLoading(true)
        setError(undefined);
        try {
            await Lesson.updateLessonById("aeAWvhhhNKCRU6VQBuUV", {
                title: "Torah"
            })
        }
        catch (err) {
            setError(err)
        }
        finally {
            setLoading(false)
        }

    }


    if (error) {
        return <div>Error: {error.message}</div>
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Home Page</h1>
            I have report with name {documentData?.name}, is paid: {String(documentData?.payed)}

            <button onClick={() => {
                createLesson();
            }}>Create Lesson</button>

            <button onClick={() => {
                getListLessons();
            }}>Get Lessons</button>

            <button onClick={() => {
                deleteLesson();
            }}>Delete Doc</button>


            <button onClick={() => {
                updateLesson();
            }}>Update Doc</button>
            <pre>
                {JSON.stringify(lessonsData.map((item) => ({
                    ...item,
                    created_at: new Date(item.created_at).toDateString()
                })), null, 2)}
            </pre>
            {/* <pre>
                {JSON.stringify(documentData, null, 2)}
            </pre> */}
        </div>
    )
}

export default HomePage;