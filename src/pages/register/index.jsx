
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'
import { auth } from '../../services/firebase';
import { Button } from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { classes, hugim, maslulim } from '../../constants/lesson-constants';

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

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

    const onSubmit = async ({ email, password, fullName, phone, college, path, department, year }) => {
        e.preventDefault();
        // Create User:
        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        // Save User Information In Firestore
        const userDoc = await setDoc(doc(db, "users", user.uid), {
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start justify-start">
                <input {...register("fullName", { required: true })} type="text" placeholder="שם מלא" />
                <input {...register("email", { required: true })} type="text" placeholder="אימייל" />
                <input {...register("phone", { required: true })} type="text" placeholder="מספר טלפון" />
                <input {...register("password", { required: true })} type="password" placeholder="סיסמא" />
                <input {...register("college", { required: true })} type="text" placeholder="מכללה" />
                <input {...register("path", { required: true })} type="text" placeholder="מסלול" />
                <input {...register("department", { required: true })} type="text" placeholder="חוג" />
                <input {...register("year", { required: true })} type="text" placeholder="שנת לימודים" />
                <div className="flex flex-row space-x-reverse space-x-2 items-center">
                    <Button className="bg-black p-2 text-white rounded-md">הרשמה</Button>
                    <p>או</p>
                    <a href="/login">התחברו</a>
                </div>
            </form>
        </div>
    )
}

export default RegisterPage;