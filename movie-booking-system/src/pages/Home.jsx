import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);

  // ✅ Fetch movies from TMDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f"
        );
        const data = await response.json();
        const formatted = data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/300x400?text=No+Image",
          release: movie.release_date,
          rating: movie.adult ? "Adult" : "U", // simple demo rating
          status: "Advance", // demo booking status
        }));
        setMovies(formatted);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ✅ Promo Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-orange-500 text-white py-6 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">
          🎉 Get 10% Cashback up to Rs.200!
        </h2>
        <p className="mb-2">Use promo code <span className="font-bold">QFXDEALS</span> on your first ticket purchase.</p>
        <p className="text-sm">Buy from Khalti App and enjoy exclusive offers.</p>
      </div>

      {/* ✅ Now Showing Section */}
      <div className="px-6 py-10">
        <h2 className="text-3xl font-semibold mb-6">Now Showing | Coming Soon</h2>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movies.slice(0, 8).map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-3"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-72 object-cover rounded"
                />
                <div className="mt-3">
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="text-sm text-gray-600">
                    Release: {movie.release}
                  </p>
                  {/* Labels */}
                  <div className="flex gap-2 mt-2">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      {movie.status}
                    </span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      {movie.rating}
                    </span>
                  </div>
                  <Link
                    to={`/movies/${movie.id}`}
                    className="block mt-3 bg-yellow-400 text-black py-2 rounded font-semibold hover:bg-yellow-500 text-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading movies...</p>
        )}
      </div>

      {/* ✅ Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        © 2026 Movie Booking
      </footer>
    </div>
  );
}