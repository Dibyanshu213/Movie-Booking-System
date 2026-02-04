import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);

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
          rating: movie.adult ? "Adult" : "U", // demo rating
          status: "Advance", // demo booking status
        }));
        setMovies(formatted);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const nextMovie = () => {
    setIndex((prev) => (prev + 1) % movies.length);
  };

  const prevMovie = () => {
    setIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ✅ Promo Banner at Top */}
      <div className="bg-gradient-to-r from-purple-700 to-orange-500 text-white py-6 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">
          🎉 Get 10% Cashback up to Rs.200!
        </h2>
        <p className="mb-2">
          Use promo code <span className="font-bold"></span> on your first ticket purchase.
        </p>
        <p className="text-sm">Buy from esewa App and enjoy exclusive offers.</p>
      </div>

      {/* ✅ Featured Slider */}
      <div className="relative flex flex-col items-center py-12 px-6 bg-white">
        <h2 className="text-3xl font-semibold mb-6">Featured Movie</h2>

        {movies.length > 0 ? (
          <div className="relative w-full flex justify-center">
            {/* Left Arrow at Edge */}
            <button
              onClick={prevMovie}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300 text-2xl"
            >
              ◀
            </button>

            {/* Poster Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 w-96 mx-auto"> {/* wider card */}
              <img
                src={movies[index].poster}
                alt={movies[index].title}
                className="w-full h-[30rem] object-cover rounded" // bigger height
              />
              <h3 className="text-xl font-bold mt-4">{movies[index].title}</h3>
              <p className="text-gray-600 text-sm">
                Release Date: {movies[index].release}
              </p>
              {/* Labels */}
              <div className="flex gap-2 mt-2">
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                  {movies[index].status}
                </span>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                  {movies[index].rating}
                </span>
              </div>
              <Link
                to={`/movies/${movies[index].id}`}
                className="block mt-3 bg-yellow-400 text-black py-2 rounded font-semibold hover:bg-yellow-500 text-center"
              >
                Book Now
              </Link>
            </div>

            {/* Right Arrow at Edge */}
            <button
              onClick={nextMovie}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-gray-300 text-2xl"
            >
              ▶
            </button>
          </div>
        ) : (
          <p>Loading movies...</p>
        )}
      </div>

      {/* ✅ Movie List/Grid Below */}
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
                  className="w-full h-80 object-cover rounded" // bigger height
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