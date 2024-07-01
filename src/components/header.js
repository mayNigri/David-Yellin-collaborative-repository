import { Link, Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import { selectUser, selectUserDoc } from "../redux/auth-slice";
import { useSelector } from "react-redux";
import { Button, buttonVariants } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
const Header = () => {
  const user = useSelector(selectUser);
  const userDoc = useSelector(selectUserDoc);

  return (
    <div className="p-5">
      <div className="flex flex-row justify-between">
        <ul className="flex flex-row space-x-reverse space-x-2">
          {user && (
            <li>
              <Link to="/">דף הבית</Link>
            </li>
          )}
          {!user && (
            <>
              <li>
                <Link to="/login">התחברות</Link>
              </li>
              <li>
                <Link to="/register">הרשמה</Link>
              </li>
            </>
          )}
          {user && (
            <li>
              <Link to="/profile">הפרופיל שלי</Link>
            </li>
          )}
        </ul>
        {user && (
          <div className="gap-3 flex items-center">
            <Bell />
            {userDoc.role === 'admin' &&
              <Link to="/admin" className={buttonVariants({ variant: 'ghost' })}>
                פאנל ניהול
              </Link>
            }
            <Button onClick={() => signOut(auth)} variant="destructive">
              התנתקות
            </Button>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default Header;
