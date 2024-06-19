import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { Button } from '../../components/ui/Button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const validator = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

const LoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

    const login = async ({ email, password }) => {
        e.preventDefault();
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", user.uid))
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">התחברות</h1>
            <form onSubmit={handleSubmit(login)} className="flex flex-col items-start justify-start">
                <input {...register('email', { required: true })} type="text" placeholder="Email" />
                <input {...register('password', { required: true })} type="password" placeholder="Password" />
                <div className="flex flex-row space-x-reverse space-x-2 items-center">
                    <Button className="bg-black p-2 text-white rounded-md">Login</Button>
                    <p>או</p>
                    <a href="/register">הרשמה</a>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;