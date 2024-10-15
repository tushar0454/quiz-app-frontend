import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/useContext";

export default function Navbar() {
  const { user } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:text-blue-400 transition">
          Quiz Maker
        </Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-400 transition">
          Home
        </Link>
        {!user && (
          <>
            <Link to="/register" className="hover:text-blue-400 transition">
              Register
            </Link>
            <Link to="/login" className="hover:text-blue-400 transition">
              Login
            </Link>
          </>
        )}
        {user && (
          <button className="" onClick={handleLogout}>
            Logout
          </button>
        )}
        {user && <span className="font-semibold">Welcome, {user.name}</span>}
      </div>
    </nav>
  );
}
