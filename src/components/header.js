import { Link, Outlet } from "react-router-dom";
import { selectUser, selectUserDoc } from "../redux/auth-slice";
import { useSelector } from "react-redux";
import Footer from "./footer";
import NavBar from "./navbar";

const Header = () => {
  const user = useSelector(selectUser);
  const userDoc = useSelector(selectUserDoc);

  return (
    <div>
      <NavBar />
      <div className="min-h-[calc(100vh-164px)]">
      <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Header;
