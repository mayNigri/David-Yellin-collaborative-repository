import { auth } from '../../services/firebase'
import UserUpdateForm from '../../components/user-form';

const ProfilePage = () => {
    return (
        <div className="p-5 space-y-5 flex flex-col items-center justify-center min-h-[calc(100vh-174px)]">
            <h1 className="text-3xl font-bold mb-3">הפרופיל שלי</h1>
            <UserUpdateForm uid={auth.currentUser.uid} />
        </div>
    )
}

export default ProfilePage;