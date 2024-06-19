import { auth, firestore } from '../../services/firebase'
import { updateCurrentUser, UserCredential } from 'firebase/auth'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import { Button } from '../../components/ui/button';

const ProfilePage = () => {

    const update = async (e) => {
        e.preventDefault();
        await updateCurrentUser(auth, {
            displayName: "",
            photoURL: "",
            email: "",
            phoneNumber: "",
        })

        await setDoc(doc(firestore, "users", auth.currentUser.uid), {
            name: "",
            college: "",
            course: "",
            department: "",
            year: "",
        })
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">פרופיל</h1>
            <form onSubmit={update} className="flex flex-col items-start justify-start">
                <input type="text" placeholder="שם מלא" />
                <input type="text" placeholder="מכללה" />
                <input type="text" placeholder="מסלול" />
                <input type="text" placeholder="חוג" />
                <input type="text" placeholder="שנת לימודים" />
                <Button className="bg-black p-2 text-white rounded-md">עדכון</Button>
            </form>
        </div>
    )
}

export default ProfilePage;