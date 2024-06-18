import { Link, Outlet } from "react-router-dom";
import { Bell } from 'lucide-react'
const Header = () => {
    return (
        <div className="p-5">
            <div className="flex flex-row justify-between">
                <ul className="flex flex-row space-x-reverse space-x-2">
                    <li>
                        <Link to="/">
                            דף הבית
                        </Link>
                    </li>
                    <li>
                        <Link to="/login">
                            התחברות
                        </Link>
                    </li>
                    <li>
                        <Link to="/register">
                            הרשמה
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile">
                            הפרופיל שלי
                        </Link>
                    </li>
                </ul>
                <Bell />
            </div>
            <Outlet />
        </div>
    )
}

export default Header;