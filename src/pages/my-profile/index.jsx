import { auth, firestore } from '../../services/firebase'
import { updateCurrentUser, UserCredential } from 'firebase/auth'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useSelector } from 'react-redux'
import { selectUser, selectUserDoc } from '../../redux/auth-slice';
import { useForm } from 'react-hook-form';
import { classes, tracks } from '../../constants/lesson-constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { userRef } from '../../constants/refs';
import { useState } from 'react';
import UserUpdateForm from '../../components/user-form';

const ProfilePage = () => {

    const userDoc = useSelector(selectUserDoc);
    const [loading, setLoading] = useState(false)

    const { register, setValue, formState: { defaultValues }, handleSubmit } = useForm({
        defaultValues: {
            fullName: userDoc.fullName,
            college: userDoc.college,
            track: userDoc.track,
            class: userDoc.class,
            year: userDoc.year,
        },
        disabled: loading
    })

    const update = async (input) => {
        setLoading(true)
        await updateDoc(userRef(auth.currentUser.uid), input)
        setLoading(false)
    }

    return (
        <div className="p-5 space-y-5 flex flex-col items-center justify-center min-h-[calc(100vh-144px)]">
            <h1 className="text-3xl font-bold mb-3">הפרופיל שלי</h1>
            <UserUpdateForm uid={auth.currentUser.uid} />
        </div>
    )
}

export default ProfilePage;