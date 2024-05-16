import { getDoc, DocumentReference, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { firestore } from '../../services/firebase';

const HomePage = () => {

    const [documentData, setDocumentData] = useState();

    useEffect(() => {
        // start on doing this
        getDoc(doc(firestore, "Reports/6x9kzHpc9IVG9g5cjj8e"))
            .then((res) => setDocumentData(res.data()))
    }, [])

    return (
        <div>
            <h1>Home Page</h1>
            I have report with name {documentData.name}, is paid: {String(documentData.payed)}
            {/* <pre>
                {JSON.stringify(documentData, null, 2)}
            </pre> */}
        </div>
    )
}

export default HomePage;