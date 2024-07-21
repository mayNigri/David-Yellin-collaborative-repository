import { getDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import LessonCard from "../../components/lesson-card";
import { useSelector } from "react-redux";
import { selectUserDoc } from "../../redux/auth-slice";
import { Button, buttonVariants } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { getLessonsByPageQuery, lessonRef, lessonsRef } from "../../constants/refs";
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
import LessonsSection from "./lessons-section";


const validator = z.object({
  track: z
    .enum(tracks.concat(""))
    .nullable()
    .optional(),
  _class: z
    .enum(classes.concat(""))
    .nullable()
    .optional(),
  grade: z
    .enum(grades.concat(""))
    .nullable()
    .optional(),
  free_text: z.string().trim().optional(),
});

const HomePage = () => {
  const [searching, setIsSearching] = useState(false);
  const user = useSelector(selectUserDoc);

  const searchForm = useForm({
    resolver: zodResolver(validator),
    defaultValues: {
      track: undefined,
      _class: undefined,
      grade: undefined,
    }
  });

  const [lastFilters, setLastFilters] = useState({
    track: undefined,
    _class: undefined,
    grade: undefined
  })

  const watchFields = searchForm.watch()

  const [lessons, setLessons] = useState([]);
  const [lessonsCount, setLessonsCount] = useState(0);
  const [lessonsPage, setLessonsPage] = useState(0);

  const [myLessons, setMyLessons] = useState([]);
  const [myLessonsCount, setMyLessonsCount] = useState(0);

  const [favlessons, setFavLessons] = useState([]);
  const [favlessonsCount, setFavlessonsCount] = useState(0);

  useEffect(() => {
    handleGetMyLessons()

    const q2 = (user.favorites || [])
      .map((id) => getDoc(lessonRef(id)));

    Promise.all(q2).then((docs) => {
      setFavLessons(
        docs.map((d) => d.exists() ? ({
          ...d.data(),
          id: d.id,
        }) : undefined).filter((d) => d)
      );
    });
  }, []);

  const handleGetMyLessons = async () => {
    const docs = await getLessonsByPageQuery(myLessons.length === 0 ? undefined : myLessons.at(-1).createdAt, where("uid", "==", user.id));
    setMyLessonsCount(docs.count);
    setMyLessons(prev => prev.concat(docs.docs));
  };

  const handleGetLessonsByFilter = async (input) => {
    setIsSearching(true);
    try {
      const q = await getLessonsByFilter(input);
      setLessons(q);
      setLessonsCount(q.length);
    } catch (e) {
      console.log(e);
    }
    setIsSearching(false);
  };

  const handleGetLessonsByFilterFetchMore = async () => {
    setIsSearching(true);
    try {
      const q = getLessonsByFilter(lastFilters);
      const { docs } = await getLessonsByPageQuery(lessons.length === 0 ? undefined : lessons.at(-1).createdAt, ...q);
      setLessons(prev => prev.concat(docs));
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
                <SelectValue value={undefined} placeholder="מסלול" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>
                  הכל
                </SelectItem>
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
                <SelectValue value={undefined} placeholder="חוג" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>
                  הכל
                </SelectItem>
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
                <SelectValue value={undefined} placeholder="כיתה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>
                  הכל
                </SelectItem>
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

        {lessons.length > 0 && (
          <LessonsSection title="תוצאות חיפוש" lessons={lessons.slice(0, lessonsPage * 8 + 8)} count={lessonsCount} onPressFetchMore={() => {
            setLessonsPage(prev => prev + 1);
          }} />
        )}

        {favlessons.length > 0 && (
          <LessonsSection title="המועדפים שלי" lessons={favlessons} count={user.favorites.length} onPressFetchMore={() => {
            const q2 = (user.favorites || [])
              .map((id) => getDoc(lessonRef(id)));

            Promise.all(q2).then((docs) => {
              setFavLessons(
                docs.map((d) => d.exists() ? ({
                  ...d.data(),
                  id: d.id,
                }) : undefined).filter((d) => d)
              );
            });
          }} />
        )}

        {myLessons.length > 0 ?
          <LessonsSection title="המערכים שלי" lessons={myLessons} count={myLessonsCount} onPressFetchMore={() => {
            handleGetMyLessons();
          }} />
          :
          <div className="text-xl my-5">
            <Link className="text-blue-500 hover:text-blue-700 font-bold" to="/lesson">לחץ כאן</Link> כדי ליצור את המערך הראשון שלך
          </div>

        }


      </div>
    </div>
  );
};

export default HomePage;
