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
import { classes, hugim, maslulim } from "../../constants/lesson-constants";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useSelector } from "react-redux";
import {selectUser} from '../../redux/auth-slice'
import { addDoc, collection } from "firebase/firestore";
import {firestore} from '../../services/firebase'
import { useNavigate } from "react-router-dom";

const validator = z.object({
  path: z.enum(maslulim),
  department: z.enum(hugim),
  year: z.enum(classes),
  description: z.string(),
  name: z.string(),
  fileUrl: z.string().url().optional(),
});

const LessonFormPage = () => {

  const user = useSelector(selectUser);
  const navigate = useNavigate();

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
      const lessonDoc = await addDoc(collection(firestore, "lessons"), {
        uid: user.uid,
        ...input
      })
      alert('המערך נוצר בהצלחה')
      navigate(`/lesson/${lessonDoc.id}`)
    }
    catch(e) {
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
        <Select onValueChange={(val) => setValue("path", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="אנא בחר" />
          </SelectTrigger>
          <SelectContent>
            {maslulim.map((item) => {
              return <SelectItem key={item} value={item}>{item}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        <Label htmlFor="hug">חוג</Label>
        <Select id="hug" onValueChange={(val) => setValue("department", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue className="w-full" placeholder="אנא בחר" />
          </SelectTrigger>
          <SelectContent>
            {hugim.map((item) => {
              return <SelectItem key={item} value={item}>{item}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        <Label>כיתה</Label>
        <Select onValueChange={(val) => setValue("year", val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="אנא בחר" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((item) => {
              return <SelectItem key={item} value={item}>{item}</SelectItem>;
            })}
          </SelectContent>
        </Select>

        <Label>תיאור המערך</Label>
        <Input type="text" placeholder="טקסט חופשי" {...register("description")} />

        <Label>העלאת קובץ המערך</Label>
        <input type="file" />

        <Button type="submit" className="bg-black p-2 text-white rounded-md">יצירה</Button>
      </form>
    </div>
  );
};

export default LessonFormPage;
