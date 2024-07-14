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

const UserUpdateForm = ({ uid, afterUpdate }) => {

    const [loading, setLoading] = useState(false)
    const [loadingUser, setLoadingUser] = useState(true);

    const { register, setValue, formState: { defaultValues }, handleSubmit } = useForm({
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
            <Button loading={loading} className="bg-black p-2 text-white rounded-md">עדכון</Button>
        </form>
    )
}

export default UserUpdateForm;