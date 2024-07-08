import { and, count, getCountFromServer, query, where } from "firebase/firestore";
import { lessonsRef } from "../../constants/refs";
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";

const queryByCreateTime = (from, to) => query(lessonsRef, where("createdAt", ">=", from), where("createdAt", "<=", to));

const ReportsTab = () => {

    const [createdInTime, setCreatedInTime] = useState(0);

    const { register, setValue } = useForm({
        defaultValues: {
            from: (new Date()).toISOString().split('T')[0],
            to: (new Date()).toISOString().split('T')[0]
        }
    });

    useEffect(() => {
        getCountFromServer(queryByCreateTime(1720444805331, 1720444805336))
            .then((data) => setCreatedInTime(data._data.count.integerValue))
    }, [])

    return (
        <div>
            <h2>Reports</h2>
            <form className="flex flex-row space-x-reverse space-x-2 items-center">
                <Label>מתאריך: </Label>
                <Input {...register("from", {
                    onChange(e) {
                        setValue((new Date(e.target.value)).toISOString().split('T')[0])
                    }
                })} className="w-40" type="date" />

                <Label>עד לתאריך: </Label>
                <Input {...register("to", {
                    onChange(e) {
                        setValue((new Date(e.target.value)).toISOString().split('T')[0])
                    }
                })} className="w-40" type="date" />

                <Button type="submit">בקש דוח</Button>
            </form>
        </div>
    )
}
export default ReportsTab;