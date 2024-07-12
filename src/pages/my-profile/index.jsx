import { auth, firestore } from '../../services/firebase'
import { updateCurrentUser, UserCredential } from 'firebase/auth'
import { getDoc, doc, setDoc } from 'firebase/firestore'
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

const ProfilePage = () => {

    const userDoc = useSelector(selectUserDoc);

    const { register, setValue, formState: { defaultValues } } = useForm({
        defaultValues: {
            fullName: userDoc.fullName,
            college: userDoc.college,
            track: userDoc.track,
            class: userDoc.class,
            year: userDoc.year,
        }
    })

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
            track: "",
            class: "",
            year: "",
        })
    }

    return (
        <div className="p-5 space-y-5 flex flex-col items-center justify-center min-h-[calc(100vh-144px)]">
            <h1 className="text-3xl font-bold mb-3">הפרופיל שלי</h1>
            <form onSubmit={update} className="items-center max-w-[400px] grid-cols-2 grid gap-5 justify-center">
                <div>
                    <Label>שם מלא</Label>
                    <Input type="text" {...register("fullName")} placeholder="שם מלא" />
                </div>
                <div>
                    <Label>מכללה</Label>
                    <Input type="text" {...register("college")} placeholder="מכללה" />
                </div>
                <div>
                    <Label>מסלול</Label>
                    <Select value={defaultValues.track} onValueChange={(val) => setValue('track', val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="אנא בחר" />
                        </SelectTrigger>
                        <SelectContent>
                            {tracks.map((item) => {
                                return (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                )
                            })
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>חוג</Label>
                    <Select defaultValue={defaultValues.class} onValueChange={(val) => setValue('class', val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="אנא בחר" />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map((item) => {
                                return (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                )
                            })
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>שנת לימודים</Label>
                    <Input type="text" {...register("year")} placeholder="שנת לימודים" />
                </div>
                <Button className="bg-black p-2 text-white rounded-md">עדכון</Button>
            </form>
        </div>
    )
}

export default ProfilePage;