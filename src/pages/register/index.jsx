
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { auth, firestore } from '../../services/firebase';
import { Button } from '../../components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { classes, tracks } from '../../constants/lesson-constants';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { COLOR_WHITE, COLOR_YELLOW, COLOR_BLUE } from '../../lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import logo_blue from '../../lib/logo_blue.png'
import { useEffect, useMemo, useState } from 'react';
import { getColleges } from '../../constants/config-actions';

const WavyLine = () => (
    <svg
        height="100%"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 200"
        preserveAspectRatio="none"
        style={{ fill: 'none', stroke: COLOR_YELLOW, strokeWidth: 4 }}
    >
        <path d="M10 0 C 15 500, 5 50, 10 1000 C 15 1500, 5 1500, 10 2000" />
    </svg>
)


const errorCodes = {
    ['auth/email-already-in-use']: "האימייל כבר קיים במערכת",
    ['auth/phone-number-already-exists']: "מספר הטלפון כבר קיים במערכת",
}


const RegisterPage = () => {

    const [colleges, setColleges] = useState([]);

    const validator = useMemo(() => z.object({
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
        college: z.enum(colleges, {
            required_error: "יש לבחור מכללה"
        }),
        track: z.enum(tracks, { required_error: "יש לבחור מסלול" }),
        _class: z.enum(classes, { required_error: "יש לבחור חוג" }),
        year: z.number({
            required_error: "יש להזין שנה אקדמית"
        }).int().min(1, "שנה אקדמית חייבת להיות גדולה מ-0")
    }), [colleges])

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

    useEffect(() => {
        getColleges()
            .then((c) => setColleges(c))
    }, [])

    const navigate = useNavigate();
    const [firebaseError, setfirebaseError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            alert("הרשמתך בוצעה בהצלחה");
            navigate("/login")
        }
        catch (e) {
            setfirebaseError({
                message: errorCodes[e.code] || "שגיאה בעת הרשמה"
            });
        }

        setLoading(false)

    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: COLOR_WHITE }}>

            <div className="min-h-screen flex items-center justify-center w-1/2 flex-col" style={{ backgroundColor: COLOR_WHITE }}>
                <h1 className="text-3xl font-bold py-5">הרשמה</h1>
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
                        <Select onValueChange={(val) => setValue('college', val)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="אנא בחר" />
                            </SelectTrigger>
                            <SelectContent>
                                {colleges.map((item) => {
                                    return (
                                        <SelectItem key={item} value={item}>{item}</SelectItem>
                                    )
                                })
                                }
                            </SelectContent>
                        </Select>
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
                        <Input {...register("year", { required: true, setValueAs(val) { return Number(val) } })} type="number" placeholder="שנה אקדמית" />
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <Button loading={loading} type="submit">הרשמה</Button>
                    </div>

                    <div>
                        משתמש קיים? <Link className='text-blue-500 hover:text-blue-700' to="/login">התחברו</Link>
                    </div>
                </form>
                {Object.keys(errors).concat(firebaseError ? [firebaseError] : []).length > 0 && <div className='text-red-500 my-5'>
                    {Object.keys(errors).map((err) => {
                        if (errors[err].message) return <p className='list-item'>{errors[err].message}</p>
                    })}
                    {firebaseError && <p className='list-item'>{firebaseError.message}</p>}
                </div>}
            </div>
            <div className="wavy-line-container flex justify-center items-center h-full" style={{ height: '100%' }}>
                <WavyLine />
            </div>

            <div className='flex justify-center w-1/2'>
                <img src={logo_blue} alt="logo_blue" />
            </div>

        </div>
    )
}

export default RegisterPage;