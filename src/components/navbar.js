import { COLOR_YELLOW, COLOR_WHITE, COLOR_BLUE } from "../lib/utils";
import { Link, Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import { selectUser, selectUserDoc } from "../redux/auth-slice";
import { useSelector } from "react-redux";
import { Button, buttonVariants } from "./ui/button";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import logo from "../lib/logo_white.png";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './ui/popover'
import { NotificationsPopover } from "./notifications-popover";
import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { notificationsQuery, notificationsRef, notificationsRefNoRead } from "../constants/refs";

const NavBar = () => {
  const user = useSelector(selectUser);
  const userDoc = useSelector(selectUserDoc);

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(notificationsQuery(user.uid), (snapshot) => {
      setNotifications(snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id
      })))
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <div className="flex flex-row justify-between p-2 bg-primary text-white h-16">
      <ul className="flex flex-row space-x-reverse space-x-2 items-center">
        <li className="px-2">
          <img src={logo} alt="logo" style={{ width: "50px" }} />
        </li>
        {user && (
          <li>
            <Link to="/" className={buttonVariants({ variant: "ghost" })}>
              דף הבית
            </Link>
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
            <Link
              to="/profile"
              className={buttonVariants({ variant: "ghost" })}
            >
              הפרופיל שלי
            </Link>
          </li>
        )}
      </ul>
      {user && (
        <div className="gap-3 flex items-center">
          {userDoc.role === "admin" && (
            <Link to="/admin" className={buttonVariants({ variant: "ghost" })}>
              פאנל ניהול
            </Link>
          )}


          <NotificationsPopover notifications={notifications} />
          <Button onClick={() => signOut(auth)} variant="destructive">
            התנתקות
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
