import { COLOR_YELLOW, COLOR_WHITE, COLOR_BLUE } from "../lib/utils";
import { Link, Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import { selectUser, selectUserDoc } from "../redux/auth-slice";
import { useSelector } from "react-redux";
import { Button, buttonVariants } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const NavBar = () => {
    const user = useSelector(selectUser);
    const userDoc = useSelector(selectUserDoc);
 
    return (
        <div className="flex flex-row justify-between" style={{backgroundColor : COLOR_YELLOW}}>
        <ul className="flex flex-row space-x-reverse space-x-2">
          {user && (
            <li>
              <Link to="/"  className={buttonVariants({ variant: 'ghost' })}>דף הבית</Link>
            </li>
          )}
          {/* {!user && (
            <>
              <li>
                <Link to="/login">התחברות</Link>
              </li>
              <li>
                <Link to="/register">הרשמה</Link>
              </li>
            </>
          )} */}
          {user && (
            <li>
              <Link to="/profile" className={buttonVariants({ variant: 'ghost' })}>הפרופיל שלי</Link>
            </li>
          )}
        </ul>
        {user && (
          <div className="gap-3 flex items-center">
            <Bell  />
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
    )
  };
  
  export default NavBar;
  