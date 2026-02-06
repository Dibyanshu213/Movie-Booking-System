import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";   // import Firestore config
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // ✅ Fetch movies from Firestore collection "movies"
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(movieList);
      } catch (error) {
        console.error("Error fetching movies from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <p className="p-8 text-center">Loading movies...</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Popular Movies</h2>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No movies found.</p>
      )}
    </div>
  );
}