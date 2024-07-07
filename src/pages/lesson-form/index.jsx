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
import { useNavigate } from "react-router-dom";
import { lessonRef, lessonsRef } from '../../constants/refs'
import { uploadFileAndGetUrl } from "../../services/firebase";
import { useState } from "react";


const validator = z.object({
  track: z.enum(tracks),
  class: z.enum(classes),
  grade: z.enum(grades),
  description: z.string(),
  name: z.string(),
  fileUrl: z.string().url().optional(),
});

const LessonFormPage = ({ navAfter = true }) => {

  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validator),
  });

  const onSubmit = async (input) => {
    try {

      const lessonDoc = await addDoc(lessonsRef, {
        uid: user.uid,
        ...input
      });

      const url = await uploadFileAndGetUrl(file, `/lessons/${user.uid}/${lessonDoc.id}.${file.name}`);

      await updateDoc(lessonRef(lessonDoc.id), { fileUrl: url })

      alert('המערך נוצר בהצלחה')

      if (navAfter)
        navigate(`/lesson/${lessonDoc.id}`)
    }
    catch (e) {
      console.error(e)
      alert('שגיאה ביצירת המערך')
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">יצירת מערך שיעור</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start justify-start space-y-2 max-w-[300px]"
      >
        <Label>שם המערך</Label>
        <Input type="text" placeholder="שם המערך" {...register("name")} />
        <Label>מסלול</Label>
        <Select onValueChange={(val) => setValue("track", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="אנא בחר" />
          </SelectTrigger>
          <SelectContent>
            {tracks.map((item) => {
              return <SelectItem key={item} value={item}>{item}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        <Label htmlFor="class">חוג</Label>
        <Select onValueChange={(val) => setValue("class", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue className="w-full" placeholder="אנא בחר" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((item) => {
              return <SelectItem key={item} value={item}>{item}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        <Label>כיתה</Label>
        <Select onValueChange={(val) => setValue("grade", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="אנא בחר" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((item) => {
              return <SelectItem key={item} value={item}>{item}</SelectItem>;
            })}
          </SelectContent>
        </Select>

        <Label>תיאור המערך</Label>
        <Input type="text" placeholder="טקסט חופשי" {...register("description")} />

        <Label>העלאת קובץ המערך</Label>
        <input type="file" onChange={async (e) => {
          setFile(e.target.files[0] || null);
        }} />

        <Button type="submit" className="bg-black p-2 text-white rounded-md">יצירה</Button>
      </form>
    </div>
  );
};

export default LessonFormPage;
