const RegisterPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold">הרשמה</h1>
            <form className="flex flex-col items-start justify-start">
                <input type="text" placeholder="שם מלא" />
                <input type="text" placeholder="אימייל" />
                <input type="text" placeholder="מספר טלפון" />
                <input type="password" placeholder="סיסמא" />
                <input type="text" placeholder="מכללה" />
                <input type="text" placeholder="מסלול" />
                <input type="text" placeholder="חוג" />
                <input type="text" placeholder="שנת לימודים" />

                <div className="flex flex-row space-x-reverse space-x-2 items-center">
                    <button className="bg-black p-2 text-white rounded-md">הרשמה</button>
                    <p>או</p>
                    <a href="/login">התחברו</a>
                </div>
            </form>
        </div>
    )
}

export default RegisterPage;