
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'
import { auth } from '../../services/firebase';
import { Button } from '../../components/ui/Button';

const RegisterPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [path, setPath] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");

    const register = async (e) => {
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
            <form onSubmit={register} className="flex flex-col items-start justify-start">
                <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" placeholder="שם מלא" />
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="אימייל" />
                <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" placeholder="מספר טלפון" />
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="סיסמא" />
                <input onChange={(e) => setCollege(e.target.value)} value={college} type="text" placeholder="מכללה" />
                <input onChange={(e) => setPath(e.target.value)} value={path} type="text" placeholder="מסלול" />
                <input onChange={(e) => setDepartment(e.target.value)} value={department} type="text" placeholder="חוג" />
                <input onChange={(e) => setYear(e.target.value)} value={year} type="text" placeholder="שנת לימודים" />
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