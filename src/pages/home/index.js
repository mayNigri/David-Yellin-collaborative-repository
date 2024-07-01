import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  limit,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../services/firebase";
import { Lesson } from "../../models/Lesson";
import LessonCard from "../../components/lesson-card";
import FiltersModal from "../../components/filters-modal";
import { useSelector } from "react-redux";
import { selectUser, selectUserDoc } from "../../redux/auth-slice";
import { Button, buttonVariants } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { lessonsRef } from "../../constants/refs";
const HomePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const user = useSelector(selectUserDoc);

  const [lessons, setLessons] = useState([]);
  const [filters, setFilters] = useState({
    departments: [],
    years: [],
    paths: [],
  });

  useEffect(() => {
    const q = query(lessonsRef, limit(5));
    getDocs(q).then((querySnapshot) => {
      setLessons(querySnapshot.docs.map((d) => d.data()));
    });
  }, []);

  return (
    <div>
      <h1>דף הבית</h1>
      <p>שלום, {user.fullName}</p>
      <div>
        <div className="flex flex-row items-center space-x-reverse space-x-2 justify-between">
          <div className="flex flex-row items-center space-x-reverse space-x-2">
            <div className="flex items-center relative">
              <Input
                type="text"
                className="min-w-[300px]"
                placeholder="חיפוש"
              />
              <MagnifyingGlassIcon className="absolute left-2" />
            </div>
            <Button variant="ghost" onClick={() => setShowFilters(true)}>
              סינון
            </Button>
            <Button className="bg-black p-2 text-white rounded-md">
              חיפוש
            </Button>
          </div>

          <div>
            <a
              className={buttonVariants({ variant: "default" })}
              href="/lesson"
            >
              יצירת מערך שיעור
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {lessons.map((lesson) => (
            <a href="/lesson/1">
              <LessonCard lesson={lesson} />
            </a>
          ))}
        </div>

        {showFilters && (
          <FiltersModal
            onSubmit={null}
            filters={filters}
            onDismiss={() => setShowFilters(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
