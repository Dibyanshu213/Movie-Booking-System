// src/pages/MyBookings.jsx
import { useBookingContext } from "../context/BookingContext";

export default function MyBookings() {
  const { bookingInfo } = useBookingContext();

  // ✅ Normalize bookingInfo into an array
  const bookings = bookingInfo
    ? (Array.isArray(bookingInfo) ? bookingInfo : [bookingInfo])
    : [];

  if (bookings.length === 0) {
    return <p className="p-8 text-gray-600">No bookings yet!</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.map((booking, idx) => (
        <div
          key={idx}
          className="bg-white shadow rounded p-4 mb-4 hover:shadow-lg transition"
        >
          <p className="mb-2 font-semibold">Movie: {booking.movie}</p>
          <p className="mb-2">
            Seats: {booking.seats?.length ? booking.seats.join(", ") : "None"}
          </p>
          <p className="mb-2">Date: {booking.date}</p>
        </div>
      ))}
    </div>
  );
}