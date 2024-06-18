import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const LoginPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">התחברות</h1>
            <form className="flex flex-col items-start justify-start">
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <div className="flex flex-row space-x-reverse space-x-2 items-center">
                    <button className="bg-black p-2 text-white rounded-md">Login</button>
                    <p>או</p>
                    <a href="/register">הרשמה</a>
                </div>
            </form>
        </div>
    )
}

export default LoginPage;