import {
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import LessonCard from "../../components/lesson-card";
import FiltersModal from "../../components/filters-modal";
import { useSelector } from "react-redux";
import { selectUserDoc } from "../../redux/auth-slice";
import { Button, buttonVariants } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { lessonsRef } from "../../constants/refs";
import { Link } from "react-router-dom";
import { getMyLessons } from "../../constants/lesson-actions";
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
      setLessons(querySnapshot.docs.map((d) =>
      ({
        ...d.data(),
        id: d.id
      })));
    });
  }, []);

  const handleGetMyLessons = async () => {
    const docs = await getMyLessons(user.id);
    setLessons(docs)
  }

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

        <div className="grid grid-cols-3 gap-3">
          {lessons.map((lesson) => (
            <Link to={`/lesson/${lesson.id}`}>
              <LessonCard lesson={lesson} />
            </Link>
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
