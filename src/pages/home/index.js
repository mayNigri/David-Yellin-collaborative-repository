import { getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import LessonCard from "../../components/lesson-card";
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
import { Plus } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"


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
  const [searching, setIsSearching] = useState(false);
  const user = useSelector(selectUserDoc);

  const searchForm = useForm({
    resolver: zodResolver(validator),
  });

  const [lessons, setLessons] = useState([]);
  const [myLessons, setMyLessons] = useState([]);
  const [favlessons, setFavLessons] = useState([]);

  useEffect(() => {
    handleGetMyLessons()

    const q2 = (user.favorites || [])
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
    setMyLessons(docs);
  };

  const handleGetLessonsByFilter = async (input) => {
    setIsSearching(true);
    try {
      const docs = await getLessonsByFilter(input);
      setLessons(docs);
    } catch (e) { }
    setIsSearching(false);
  };

  return (
    <div className="p-5 space-y-5 min-h-[calc(100vh-144px)]">
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
                className="min-w-[300px] h-12 text-lg"
                placeholder="חיפוש"
                {...searchForm.register("free_text")}
              />
              <MagnifyingGlassIcon className="absolute left-2 size-7" />
            </div>

            <Select onValueChange={(val) => searchForm.setValue("track", val)}>
              <SelectTrigger className="w-[180px] h-12 text-lg">
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
              <SelectTrigger className="w-[180px] h-12 text-lg">
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
              <SelectTrigger className="w-[180px] h-12 text-lg">
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
            <Button
              loading={searching}
              type="submit"
              className="p-2 h-12 w-28 text-white rounded-md text-lg"
            >
              חיפוש
            </Button>
          </form>


          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="bottom-5 left-5 fixed rounded-full p-2 border border-primary bg-secondary shadow-xl">
                <Link
                  className={`text-3xl rounded-full`}
                  to="/lesson"
                >
                  <Plus size={40} className="text-primary" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>מערך שיעור חדש</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>

        {lessons.length > 0 &&
          <>
            <h2 className="py-5">תוצאות חיפוש</h2>
            <div id="divider" className="border-b border-slate-300 mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-5">
              {lessons.map((lesson) => (
                <Link
                  key={lesson.id}
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
          </>}

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
                    isFavorite={true}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {myLessons.length > 0 ?
          <>
            <h2 className="py-5">המערכים שלי</h2>
            <div id="divider" className="border-b border-slate-300 mb-5"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-5">
              {myLessons.map((lesson) => (
                <Link
                  key={lesson.id}
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
          </> :
          <div className="text-xl">
            <Link className="text-blue-500 hover:text-blue-700 font-bold" to="/lesson">לחץ כאן</Link> כדי ליצור את המערך הראשון שלך
          </div>

        }


      </div>
    </div>
  );
};

export default HomePage;
