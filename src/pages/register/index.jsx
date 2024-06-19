
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'
import { auth, firestore } from '../../services/firebase';
import { Button } from '../../components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { classes, hugim, maslulim } from '../../constants/lesson-constants';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';

const validator = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    fullName: z.string(),
    phone: z.string(),
    college: z.string(),
    path: z.enum(maslulim),
    department: z.enum(hugim),
    year: z.enum(classes)
})

const RegisterPage = () => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

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

                <Label htmlFor="path">מסלול</Label>
                <Select onValueChange={(val) => setValue('path', val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="אנא בחר" />
                    </SelectTrigger>
                    <SelectContent>
                        {maslulim.map((item) => {
                            return (
                                <SelectItem value={item}>{item}</SelectItem>
                            )
                        })
                        }
                    </SelectContent>
                </Select>
                <Label htmlFor="department">חוג</Label>
                <Select onValueChange={(val) => setValue('department', val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="אנא בחר" />
                    </SelectTrigger>
                    <SelectContent>
                        {hugim.map((item) => {
                            return (
                                <SelectItem value={item}>{item}</SelectItem>
                            )
                        })
                        }
                    </SelectContent>
                </Select>

                <Label htmlFor="year">שנה</Label>
                <Select onValueChange={(val) => setValue('year', val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="אנא בחר" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((item) => {
                            return (
                                <SelectItem value={item}>{item}</SelectItem>
                            )
                        })
                        }
                    </SelectContent>
                </Select>
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