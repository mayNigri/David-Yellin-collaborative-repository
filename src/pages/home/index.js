import { getDocs, query, limit, where, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import LessonCard from "../../components/lesson-card";
import FiltersModal from "../../components/filters-modal";
import { useSelector } from "react-redux";
import { selectUserDoc } from "../../redux/auth-slice";
import { Button, buttonVariants } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { lessonRef, lessonsRef } from "../../constants/refs";
import { Link } from "react-router-dom";
import {
  getMyLessons,
  getLessonsByFilter,
} from "../../constants/lesson-actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classes, grades, tracks } from "../../constants/lesson-constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
const validator = z.object({
  track: z
    .enum(tracks.concat([null]))
    .nullable()
    .optional(),
  _class: z
    .enum(classes.concat([null]))
    .nullable()
    .optional(),
  grade: z
    .enum(grades.concat([null]))
    .nullable()
    .optional(),
  free_text: z.string().trim().optional(),
});

const HomePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const user = useSelector(selectUserDoc);
  const searchForm = useForm({
    resolver: zodResolver(validator),
  });

  const [lessons, setLessons] = useState([]);
  const [favlessons, setFavLessons] = useState([]);

  useEffect(() => {
    const q = query(lessonsRef, limit(5));
    getDocs(q).then((querySnapshot) => {
      setLessons(
        querySnapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }))
      );
    });

    const q2 = user.favorites
      .slice(user.favorites.length - 3, user.favorites.length)
      .map((id) => getDoc(lessonRef(id)));

    Promise.all(q2).then((docs) => {
      setFavLessons(
        docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }))
      );
    });
  }, []);

  const handleGetMyLessons = async () => {
    const docs = await getMyLessons(user.id);
    setLessons(docs);
  };

  const handleGetLessonsByFilter = async (input) => {
    console.log(input);
    const docs = await getLessonsByFilter(input);
    setLessons(docs);
  };

  return (
    <div className="p-5 space-y-5">
      <h1>דף הבית</h1>
      <p>שלום, {user.fullName}</p>
      <div>
        <div className="flex flex-row items-center space-x-reverse space-x-2 justify-between">
          <form
            onSubmit={searchForm.handleSubmit(
              handleGetLessonsByFilter,
              (err) => {
                console.log(err);
              }
            )}
            className="flex flex-row items-center space-x-reverse space-x-2"
          >
            <div className="flex items-center relative">
              <Input
                type="text"
                className="min-w-[300px]"
                placeholder="חיפוש"
                {...searchForm.register("free_text")}
              />
              <MagnifyingGlassIcon className="absolute left-2" />
            </div>

            <Select onValueChange={(val) => searchForm.setValue("track", val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue value={null} placeholder="מסלול" />
              </SelectTrigger>
              <SelectContent>
                {tracks.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => searchForm.setValue("_class", val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue value={null} placeholder="חוג" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select onValueChange={(val) => searchForm.setValue("grade", val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue value={null} placeholder="כיתה" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((item) => {
                  return (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button type="submit" className="p-2 text-white rounded-md">
              חיפוש
            </Button>
          </form>

          <div className="flex gap-2">
            <Button onClick={handleGetMyLessons}>המערכים שלי</Button>
            <Link
              className={buttonVariants({ variant: "default" })}
              to="/lesson"
            >
              יצירת מערך שיעור
            </Link>
          </div>
        </div>

        {favlessons.length > 0 && (
          <div>
            <h2 className="py-5">המועדפים שלי</h2>
            <div id="divider" className="border-b border-slate-300 mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {favlessons.map((lesson) => (
                <Link
                  className="w-fit border rounded-lg"
                  to={`/lesson/${lesson.id}`}
                >
                  <LessonCard
                    lesson={lesson}
                    isFavorite={(user.favorites || []).includes(lesson.id)}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        <h2 className="py-5">המערכים שלי</h2>
        <div id="divider" className="border-b border-slate-300 mb-5"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-5">
          {lessons.map((lesson) => (
            <Link
              className="w-fit border rounded-lg"
              to={`/lesson/${lesson.id}`}
            >
              <LessonCard
                lesson={lesson}
                isFavorite={(user.favorites || []).includes(lesson.id)}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
