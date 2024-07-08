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

    const { register, setValue, handleSubmit, watch } = useForm({
        defaultValues: {
            from: (new Date()).toISOString().split('T')[0],
            to: (new Date()).toISOString().split('T')[0]
        }
    });

    const onSubmit = ({ from, to }) => {
        getCountFromServer(queryByCreateTime(new Date(from).getTime() - 10800000, new Date(to).getTime() - 10800000))
            .then((data) => setCreatedInTime(data._data.count.integerValue))
    }

    console.log(new Date(watch().from).getTime(), new Date(watch().to).getTime())

    return (
        <div>
            <h2>Reports</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row space-x-reverse space-x-2 items-center">
                <Label>מתאריך: </Label>
                <Input {...register("from", {
                    onChange(e) {
                        setValue('from', e.target.value)
                    }
                })} className="w-40" type="date" />

                <Label>עד לתאריך: </Label>
                <Input {...register("to", {
                    onChange(e) {
                        setValue('to', e.target.value)
                    }
                })} className="w-40" type="date" />

                <Button type="submit">בקש דוח</Button>
            </form>

            {createdInTime}
        </div>
    )
}
export default ReportsTab;