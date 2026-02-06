import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-pink-600">
      <img
        src={
          movie.poster_path || movie.poster ||
          `https://via.placeholder.com/500x750?text=${encodeURIComponent(movie.title || 'No Image')}`
        }
        alt={movie.title}
        className="w-full h-[400px] object-cover"
      />
      <div className="p-4 text-white">
        <h3 className="text-xl font-bold">{movie.title}</h3>
        <p className="text-sm text-gray-400">
          Release: {movie.release_date}
        </p>
        <Link
          to={`/movies/${movie.id}`}
          className="mt-3 inline-block bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}