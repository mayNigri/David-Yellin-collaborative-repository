import { updateDoc } from 'firebase/firestore'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useForm } from 'react-hook-form';
import { classes, tracks } from '../constants/lesson-constants';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { userRef } from '../constants/refs';
import { useState } from 'react';
import { getUserById } from '../constants/user-actions';
import LoadingIndicator from './loading-indicator';
import { useDispatch } from 'react-redux';
import { setUserDoc } from '../redux/auth-slice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const validator = z.object({
    email: z.string({
        required_error: "יש להזין אימייל"
    }).email("יש להזין אימייל תקין"),
    password: z.string({
        required_error: "יש להזין סיסמה"
    }).min(8, "הסיסמה חייבת להיות באורך של 8 תווים לפחות"),
    fullName: z.string({
        required_error: "יש להזין שם מלא"
    }),
    phone: z.string({
        required_error: "יש להזין מספר טלפון"
    }).regex(/^05\d{8}$/, "מספר טלפון חייב להיות באורך של 10 ספרות"),
    college: z.string({
        required_error: "יש להזין מכללה"
    }),
    track: z.enum(tracks, { required_error: "יש לבחור מסלול" }),
    _class: z.enum(classes, { required_error: "יש לבחור חוג" }),
    year: z.number({
        required_error: "יש להזין שנה אקדמית"
    }).int().min(1, "שנה אקדמית חייבת להיות גדולה מ-0")
})

const UserUpdateForm = ({ uid, afterUpdate }) => {

    const [loading, setLoading] = useState(false)
    const [loadingUser, setLoadingUser] = useState(true);
    const dispatch = useDispatch();

    const { register, setValue, formState: { defaultValues }, handleSubmit } = useForm({
        resolver: zodResolver(validator),
        defaultValues: async () => {
            const result = await getUserById(uid)
            setLoadingUser(false);
            return result;
        },
        disabled: loading
    })

    const update = async (input) => {
        setLoading(true)
        await updateDoc(userRef(uid), input)
        afterUpdate && await afterUpdate(input);
        const userDoc = await getUserById(uid)
        dispatch(setUserDoc(userDoc))
        setLoading(false)
    }

    if (loadingUser) {
        return <div className='flex items-center justify-center min-h-screen'>
            <LoadingIndicator />
        </div>
    }

    return (
        <form onSubmit={handleSubmit(update)} className="items-center max-w-[400px] grid-cols-2 grid gap-5 justify-center">
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
                <Select defaultValue={defaultValues.track} onValueChange={(val) => setValue('track', val)}>
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
                <Input {...register("year", { required: true, valueAsNumber: true, min: 1, max: 6 })} min={1} max={6} type="number" placeholder="שנה אקדמית" />
            </div>
            <Button loading={loading} className="bg-black p-2 text-white rounded-md">עדכון</Button>
        </form>
    )
}

export default UserUpdateForm;