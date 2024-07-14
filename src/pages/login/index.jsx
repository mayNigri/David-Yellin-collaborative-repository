import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { Button } from '../../components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { COLOR_WHITE, COLOR_YELLOW, COLOR_BLUE } from '../../lib/utils'
import logo_blue from '../../lib/logo_blue.png'
import { Link } from 'react-router-dom';
import { useState } from 'react';

const validator = z.object({
    email: z.string().email("יש להזין אימייל תקין"),
    password: z.string().min(8, "סיסמא חייבת להיות באורך של 8 תווים לפחות"),
})

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

const LoginPage = () => {

    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(validator)
    });

    const login = async ({ email, password }) => {
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error.message)
            alert("התרחשה שגיאה בעת התחברות, נסה שוב")
        }
        setLoading(false);
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: COLOR_WHITE }}>

            <div className="min-h-screen flex items-center justify-center w-1/2 flex-col space-y-2" style={{ backgroundColor: COLOR_WHITE }}>
                <h1 className="text-3xl font-bold py-5">התחברות</h1>
                <form onSubmit={handleSubmit(login)} className="flex flex-col items-start justify-start max-w-[400px] space-y-5">
                    <div>
                        <Label htmlFor="email">אימייל *</Label>
                        <Input {...register('email', { required: true })} type="text" placeholder="אימייל" />
                        {errors.email && <p className='text-red-700'>{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password">סיסמה *</Label>
                        <Input {...register('password', { required: true })} type="password" placeholder="סיסמה" />
                        {errors.password && <p className='text-red-700'>{errors.password.message}</p>}
                    </div>

                    <div className="flex flex-row space-x-reverse space-x-2 items-center">
                        <Button loading={loading} >התחברות</Button>
                        <Link className="text-blue-500 hover:text-blue-700" to="/register">הרשמה</Link>
                    </div>
                    <Link to="/forgot-my-password">
                        שכחתי את הסיסמה
                    </Link>
                </form>
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

export default LoginPage;