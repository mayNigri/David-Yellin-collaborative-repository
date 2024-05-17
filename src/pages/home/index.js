import { getDoc, DocumentReference, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { firestore } from '../../services/firebase';

const HomePage = () => {

    const [documentData, setDocumentData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        getData();
    }, [])

    async function getData() {
            try{
                const docRef = doc(firestore, "Reports/6x9kzHpc9IVG9g5cjj8e")
                const docSnap = await getDoc(docRef)
                setDocumentData(docSnap.data())
            }

            catch(err){
                setError(err)
            }

            finally{
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
            {/* <pre>
                {JSON.stringify(documentData, null, 2)}
            </pre> */}
        </div>
    )
}

export default HomePage;