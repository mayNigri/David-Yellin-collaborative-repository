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
import CreateLessonPage from './pages/lesson-form';
import LessonFormPage from './pages/lesson-form';
import LessonPage from './pages/lesson';

function App() {
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
