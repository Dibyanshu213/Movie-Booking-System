import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(null);

  const value = {
    selectedMovie,
    setSelectedMovie,
    selectedSeats,
    setSelectedSeats,
    bookingInfo,
    setBookingInfo,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBookingContext = () => useContext(BookingContext);

export default BookingContext;
