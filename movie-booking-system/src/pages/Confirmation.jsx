import { useBookingContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

export default function Confirmation() {
  const { bookingInfo } = useBookingContext(); // ✅ use bookingInfo instead of selectedMovie/selectedSeats
  const navigate = useNavigate();

  if (!bookingInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">No booking found!</p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[28rem] text-center">
        <h2 className="text-3xl font-bold mb-6 text-green-600">
          🎉 Booking Confirmed!
        </h2>

        {/* ✅ Movie Poster (optional if you saved poster in bookingInfo) */}
        {bookingInfo.poster && (
          <img
            src={bookingInfo.poster}
            alt={bookingInfo.movie}
            className="w-full h-80 object-cover rounded mb-4"
          />
        )}

        {/* ✅ Movie Details */}
        <h3 className="text-xl font-semibold">{bookingInfo.movie}</h3>
        {bookingInfo.release && (
          <p className="text-gray-600 mb-2">
            Release Date: {bookingInfo.release}
          </p>
        )}

        {/* ✅ Seats */}
        <p className="mb-2">
          Seats:{" "}
          {bookingInfo.seats && bookingInfo.seats.length > 0
            ? bookingInfo.seats.join(", ")
            : "None"}
        </p>

        {/* ✅ Date */}
        <p className="mb-2">Date: {bookingInfo.date}</p>

        <p className="text-green-600 font-semibold mt-4">
          Enjoy your movie 🎬
        </p>

        {/* ✅ Back to Home */}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 w-full bg-yellow-400 text-black py-2 rounded font-bold hover:bg-yellow-500"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}