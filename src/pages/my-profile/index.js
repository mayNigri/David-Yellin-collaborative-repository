const ProfilePage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">פרופיל</h1>
            <form className="flex flex-col items-start justify-start">
                <input type="text" placeholder="שם מלא" />
                <input type="text" placeholder="מכללה" />
                <input type="text" placeholder="מסלול" />
                <input type="text" placeholder="חוג" />
                <input type="text" placeholder="שנת לימודים" />
                <button className="bg-black p-2 text-white rounded-md">עדכון</button>
            </form>
        </div>
    )
}

export default ProfilePage;