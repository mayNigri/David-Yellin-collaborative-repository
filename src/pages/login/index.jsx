import { auth } from '../../services/firebase'
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import { Button } from '../../components/ui/Button';

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", user.uid))
    }

    return (
        <div>
            <h1 className="text-3xl font-bold">התחברות</h1>
            <form onSubmit={login} className="flex flex-col items-start justify-start">
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
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