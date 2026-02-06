import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Navbar() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // ✅ redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">
      {/* Left side: App title + Navigation links */}
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold">Movie Booking</h1>
        <div className="flex gap-6">
          <Link to="/home" className="hover:text-gray-300">Home</Link>
          <Link to="/movies" className="hover:text-gray-300">Movies</Link>
          {user && (
            <Link to="/my-bookings" className="hover:text-gray-300">
              My Bookings
            </Link>
          )}
        </div>
      </div>

      {/* Right side: Avatar + Logout */}
      {user && (
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}