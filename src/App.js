import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from './pages/login';
import HomePage from './pages/home';
import MyProfilePage from './pages/my-profile';
import Header from './components/header'
import RegisterPage from './pages/register';
import LessonFormPage from './pages/lesson-form';
import LessonPage from './pages/lesson';
import { browserLocalPersistence } from 'firebase/auth'
import { useEffect } from 'react';
import { auth } from './services/firebase';

let init = false;
let listener = null;

function App() {

  useEffect(() => {
    if (!init) {
      init = true;
      auth.setPersistence(browserLocalPersistence)
        .then(() => {
          listener = auth.onAuthStateChanged((user) => {
            console.log(user)
          }, (error) => {
            console.log(error)
          })
        })

      return () => {
        listener()
      };
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="lesson" element={<LessonFormPage />} />
          <Route path="lesson/:id" element={<LessonPage />} />
          <Route path="profile" element={<MyProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
