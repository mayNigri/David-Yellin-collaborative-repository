import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"
import { useEffect } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { notificationsRef } from "../constants/refs"
import { useSelector } from "react-redux"
import { selectUser } from "../redux/auth-slice"
import { Link } from "react-router-dom"

let timerA = null;

export function NotificationsPopover({ notifications }) {

    const user = useSelector(selectUser);

    const onOpenChange = async (open) => {
        if (open) {
            timerA = setTimeout(async () => {
                await Promise.all(notifications.map(({ id }) => {
                    return updateDoc(doc(notificationsRef(user.uid), id), { read: true })
                }));
            }, 2000);
        }
        else {
            if (timerA)
                clearTimeout(timerA);
        }
    }

    return (
        <Popover onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative">
                    {notifications.filter(n => !n.read).length > 0 &&
                        <span className="w-5 h-5 bg-red-500 rounded-full absolute right-2 top-0">{notifications.filter(n => !n.read).length}</span>
                    }
                    <Bell />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">התראות</h4>
                    </div>
                    <div className="space-y-2">
                        {notifications.map(({ id, user_name, read, lessonId }) => {
                            return (
                                <Link key={id} to={`/lesson/${lessonId}`}>
                                    <p className={`${!read ? 'font-bold' : ""} py-2`}>
                                        תגובה חדשה במערך שיעור שיצרת מאת {user_name}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
