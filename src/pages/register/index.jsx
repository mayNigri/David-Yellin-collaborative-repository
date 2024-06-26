
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'
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
import { useNavigate } from 'react-router-dom';

const validator = z.object({
    email: z.string().email("יש להזין אימייל תקין"),
    password: z.string().min(8, "הסיסמה חייבת להיות באורך של 8 תווים לפחות"),
    fullName: z.string(),
    phone: z.string(),
    college: z.string(),
    track: z.enum(tracks),
    class: z.enum(classes),
    year: z.number().int().min(1, "שנה אקדמית חייבת להיות גדולה מ-0")
})

const RegisterPage = () => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

    const navigate = useNavigate();

    const onSubmit = async ({ email, password, fullName, phone, college, path, department, year }) => {
        // Create User:
        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        // Save User Information In Firestore
        const userDoc = await setDoc(doc(firestore, "users", user.uid), {
            id: user.uid,
            email,
            fullName,
            phone,
            college,
            path,
            department,
            year
        })

        alert("הרשמתך בוצעה בהצלחה");
        navigate("/login")
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">הרשמה</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start max-w-[300px]">
                <Label htmlFor="fullName">שם מלא</Label>
                <Input {...register("fullName", { required: true })} type="text" placeholder="שם מלא" />

                <Label htmlFor="email">אימייל</Label>
                <Input {...register("email", { required: true })} type="text" placeholder="אימייל" />

                <Label htmlFor="phone">מספר טלפון</Label>
                <Input {...register("phone", { required: true })} type="text" placeholder="מספר טלפון" />

                <Label htmlFor="password">סיסמה</Label>
                <Input {...register("password", { required: true })} type="password" placeholder="סיסמא" />

                <Label htmlFor="college">מכללה</Label>
                <Input {...register("college", { required: true })} type="text" placeholder="מכללה" />

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
                <Label htmlFor="class">חוג</Label>
                <Select onValueChange={(val) => setValue('class', val)}>
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

                <Label htmlFor="year">שנה אקדמית</Label>
                <Input {...register("year", { required: true, setValueAs(val) {return Number(val)} })} type="number" placeholder="שנה אקדמית" />
                <div className="flex flex-col items-center w-full">
                    <Button className="bg-black p-2 text-white rounded-md w-full">הרשמה</Button>
                    <p>או</p>
                    <a href="/login">התחברו</a>
                </div>
            </form>
        </div>
    )
}

export default RegisterPage;