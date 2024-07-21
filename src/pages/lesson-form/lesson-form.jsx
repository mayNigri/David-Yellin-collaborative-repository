import { z } from "zod";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { classes, grades, tracks } from "../../constants/lesson-constants";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useSelector } from "react-redux";
import { selectUser } from '../../redux/auth-slice'
import { addDoc, updateDoc } from "firebase/firestore";
import { FieldValue } from 'firebase/firestore'
import { useNavigate, useParams } from "react-router-dom";
import { lessonRef, lessonsRef } from '../../constants/refs'
import { uploadFileAndGetUrl } from "../../services/firebase";
import { useRef, useState } from "react";
import { createLesson, getLessonById, updateLesson } from "../../constants/lesson-actions";
import LoadingIndicator from "../../components/loading-indicator";

const validator = z.object({
    track: z.enum(tracks, { required_error: 'אנא בחר מסלול' }),
    class: z.enum(classes, { required_error: 'אנא בחר חוג' }),
    grade: z.enum(grades, { required_error: 'אנא בחר כיתה' }),
    description: z.string("אנא הזן תיאור למערך השיעור"),
    name: z.string("אנא הזן שם למערך השיעור"),
    fileUrl: z.string().url().optional(),
});

const LessonForm = ({ navAfter = true, id, afterUpdate }) => {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(id ? true : false)

    const fileRef = useRef(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, defaultValues },
    } = useForm({
        resolver: zodResolver(validator),
        defaultValues: id ? async () => {
            const lessonDoc = await getLessonById(id);
            setLoading(false)
            return lessonDoc;
        } : {
            track: "",
            class: "",
            grade: "",
            description: "",
            name: "",
        }
    });

    const onSubmit = async (input) => {

        setLoading(true)
        if (id) {
            if (file) {
                const fileUrl = await uploadFileAndGetUrl(file, `/lessons/${user.uid}/${id}.${file.name}`);
                await updateLesson(id, { fileUrl })
                const lessonDoc = await updateLesson(id, {
                    ...input,
                    fileUrl
                });

            }
            else {
                const lessonDoc = await updateLesson(id, input);
            }

            if (navAfter) {
                navigate(`/lesson/${id}`)
            }

        }
        else {
            const lessonDoc = await createLesson(user.uid, input);

            if (file) {
                const fileUrl = await uploadFileAndGetUrl(file, `/lessons/${user.uid}/${lessonDoc.id}.${file.name}`);
                await updateLesson(lessonDoc.id, { fileUrl })
            }

            if (navAfter) {
                navigate(`/lesson/${lessonDoc.id}`)
            }
        }

        afterUpdate && await afterUpdate(input);

        setLoading(false)
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <LoadingIndicator />
        </div>
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}
            className="gap-5 grid grid-cols-2 max-w-[500px]"
        >
            <div>
                <Label>שם המערך</Label>
                <Input type="text" placeholder="שם המערך" {...register("name")} />
            </div>
            <div>
                <Label>מסלול</Label>
                <Select defaultValue={defaultValues.track} onValueChange={(val) => setValue("track", val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="אנא בחר" />
                    </SelectTrigger>
                    <SelectContent>
                        {tracks.map((item) => {
                            return <SelectItem key={item} value={item}>{item}</SelectItem>;
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="class">חוג</Label>
                <Select defaultValue={defaultValues.class} onValueChange={(val) => setValue("class", val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue className="w-full" placeholder="אנא בחר" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((item) => {
                            return <SelectItem key={item} value={item}>{item}</SelectItem>;
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>כיתה</Label>
                <Select defaultValue={defaultValues.grade} onValueChange={(val) => setValue("grade", val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="אנא בחר" />
                    </SelectTrigger>
                    <SelectContent>
                        {grades.map((item) => {
                            return <SelectItem key={item} value={item}>{item}</SelectItem>;
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>תיאור המערך</Label>
                <Input type="text" placeholder="טקסט חופשי" {...register("description")} />
            </div>

            <div>
                <Label>העלאת קובץ המערך</Label>
                <Button type="button" onClick={() => fileRef.current.click()}>לחץ כאן להעלאת קובץ המערך</Button>
                {
                    !id ? (file && <p><b>שם הקובץ:</b> {file.name}</p>)
                        :
                        <p>{defaultValues && Boolean(defaultValues.fileUrl) && decodeURIComponent(defaultValues?.fileUrl.split(`${id}.`).pop().split("?alt")[0]) || ""}</p>
                }
                <input ref={fileRef} hidden type="file" onChange={async (e) => {
                    setFile(e.target.files[0] || null);
                }} />
            </div>

            <Button loading={loading} type="submit" className="p-2 text-white rounded-md">{
                id ? 'עדכון' : 'יצירה'
            }</Button>
        </form>
    );
};

export default LessonForm;
