
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { auth, firestore } from '../../services/firebase';
import { Button } from '../../components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { classes, grades, tracks } from '../../constants/lesson-constants';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import logo_blue from '../../lib/logo_blue.png'
import { useState } from 'react';

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

const errorCodes = {
    ['auth/email-already-in-use']: "האימייל כבר קיים במערכת",
    ['auth/phone-number-already-exists']: "מספר הטלפון כבר קיים במערכת",
}


const RegisterForm = () => {

    const [firebaseError, setfirebaseError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(validator),
        disabled: loading
    });

    const onSubmit = async ({ email, password, fullName, phone, college, track, year, _class }) => {
        // Create User:
        setLoading(true)
        setfirebaseError(null);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password)

            // Save User Information In Firestore
            const userDoc = await setDoc(doc(firestore, "users", user.uid), {
                id: user.uid,
                email,
                fullName,
                phone,
                college,
                track,
                class: _class,
                year,
                createdAt: serverTimestamp()
            })
            alert("משתמש נוסף בהצלחה");
        }
        catch (e) {
            setfirebaseError({
                message: errorCodes[e.code] || "שגיאה בעת הרשמה"
            });
        }

        setLoading(false)

    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="items-start max-w-[400px] grid-cols-2 grid gap-5 justify-center">
            <div>
                <Label htmlFor="fullName">שם מלא</Label>
                <Input {...register("fullName", { required: true })} type="text" placeholder="שם מלא" />
            </div>

            <div>
                <Label htmlFor="email">אימייל</Label>
                <Input {...register("email", { required: true })} type="text" placeholder="אימייל" />
            </div>


            <div>
                <Label htmlFor="phone">מספר טלפון</Label>
                <Input {...register("phone", { required: true })} type="text" placeholder="מספר טלפון" />
            </div>

            <div>
                <Label htmlFor="password">סיסמה</Label>
                <Input {...register("password", { required: true })} type="password" placeholder="סיסמא" />
            </div>

            <div>
                <Label htmlFor="college">מכללה</Label>
                <Input {...register("college", { required: true })} type="text" placeholder="מכללה" />
            </div>

            <div>
                <Label htmlFor="track">מסלול</Label>
                <Select onValueChange={(val) => setValue('track', val)}>
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
                <Label htmlFor="_class">חוג</Label>
                <Select onValueChange={(val) => setValue('_class', val)}>
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
                <Label htmlFor="year">שנה אקדמית</Label>
                <Input {...register("year", { required: true, valueAsNumber: true, min: 1, max: 6 })} min={1} max={6} type="number" placeholder="שנה אקדמית" />
            </div>

            <div className="flex flex-col items-center w-full">
                <Button loading={loading} type="submit" className="bg-black p-2 text-white rounded-md w-full">הוסף</Button>
            </div>

            {firebaseError && <p>{firebaseError.message}</p>}
        </form>
    )
}

export default RegisterForm;