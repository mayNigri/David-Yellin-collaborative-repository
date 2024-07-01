import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { Button } from '../../components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const validator = z.object({
    email: z.string().email("יש להזין אימייל תקין"),
    password: z.string().min(8, "סיסמא חייבת להיות באורך של 8 תווים לפחות"),
})

const LoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

    const login = async ({ email, password }) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error.message)
            alert("התרחשה שגיאה בעת התחברות, נסה שוב")
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center flex-col space-y-2'>
            <h1 className="text-3xl font-bold">התחברות</h1>
            <form onSubmit={handleSubmit(login)} className="flex flex-col items-start justify-start max-w-[400px] space-y-2">
            <Label htmlFor="email">אימייל *</Label>
            <Input {...register('email', { required: true })} type="text" placeholder="אימייל" />
            {errors.email && <p className='text-red-700'>{errors.email.message}</p>}
            <Label htmlFor="password">סיסמה *</Label>
            <Input {...register('password', { required: true })} type="password" placeholder="סיסמה" />
            {errors.password && <p className='text-red-700'>{errors.password.message}</p>}
            <div className="flex flex-row space-x-reverse space-x-2 items-center">
                <Button className="bg-black p-2 text-white rounded-md">התחברות</Button>
                <p>או</p>
                <a href="/register">הרשמה</a>
            </div>
            </form>
        </div>
    )
}

export default LoginPage;