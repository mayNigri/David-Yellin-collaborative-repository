import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import MyProfilePage from "./pages/my-profile";
import Header from "./components/header";
import RegisterPage from "./pages/register";
import LessonFormPage from "./pages/lesson-form";
import LessonPage from "./pages/lesson";
import { browserLocalPersistence } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";
import {
  selectUser,
  selectUserDoc,
  setUser,
  setUserDoc,
} from "./redux/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { getDoc } from "firebase/firestore";
import AdminPage from "./pages/admin";
import { userRef } from "./constants/refs";
import { CircleDashed as LoadingIndicator } from "lucide-react";
import ForgotMyPasswordPage from "./pages/login/forgot-my-password";

let init = false;
let listener = null;

function App() {
  const user = useSelector(selectUser);
  const userDoc = useSelector(selectUserDoc);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!init) {
      init = true;
      auth.setPersistence(browserLocalPersistence).then(() => {
        listener = auth.onAuthStateChanged(
          async (user) => {
            if (user) {
              const userDoc = await getDoc(userRef(user.uid));
              if (userDoc.exists()) {
                dispatch(setUserDoc({
                  ...userDoc.data(),
                  favorites: userDoc.data().favorites || [],
                  createdAt: userDoc.data().createdAt.toMillis()
                }));
              }
              dispatch(setUser(user.toJSON()));
            } else {
              dispatch(setUser(null));
            }
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            setUser(null);
          }
        );
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <LoadingIndicator className="animate-spin delay-100" />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Header /> : <Outlet />}>
            {user ? (
              <>
                <Route index element={<HomePage />} />
                <Route path="lesson" element={<LessonFormPage />} />
                <Route path="lesson/:id" element={<LessonPage />} />
                <Route path="updatelesson/:id" element={<LessonFormPage />} />
                <Route path="profile" element={<MyProfilePage />} />
                {userDoc.role === "admin" && (
                  <Route path="admin" element={<AdminPage />} />
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route index element={<LoginPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-my-password" element={<ForgotMyPasswordPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
