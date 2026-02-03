import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/Firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Google login failed:", error.message);
      alert("Google login failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-500">
      <form
        onSubmit={handleLogin}
        className="bg-white p-12 rounded-2xl shadow-xl w-[500px] max-w-[95%] text-center border border-gray-300"
      >
        {/* Centered login heading/logo */}
        <h2 className="text-4xl font-bold mb-8">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 w-full mb-4 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full mb-6 rounded-lg"
        />

        {/* Buttons styled as requested */}
        <button
          type="submit"
          className="bg-white text-black px-4 py-3 rounded-full w-full mb-4 hover:bg-gray-100 transition font-semibold border"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-black text-white px-4 py-3 rounded-full w-full hover:bg-gray-800 transition font-semibold"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}