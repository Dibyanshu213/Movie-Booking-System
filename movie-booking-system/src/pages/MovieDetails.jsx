import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Clock, MapPin, Tag, Play, Armchair, ChevronLeft, FileWarning } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States
  const [movie, setMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seat Configuration
  const rows = ['A', 'B', 'C', 'D'];
  const nums = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, "movies", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such movie found in Firebase!");
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Helper to extract YouTube ID for the Iframe
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : (url.length === 11 ? url : null);
  };

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (!selectedTime || selectedSeats.length === 0) {
      alert("Please select a showtime and at least one seat.");
      return;
    }
    try {
      await addDoc(collection(db, "bookings"), {
        movieTitle: movie.title,
        time: selectedTime,
        seats: selectedSeats,
        theatre: movie.theatre || "Grand Cinema",
        bookedAt: new Date().toISOString(),
        movieId: id,
        totalAmount: selectedSeats.length * 12 // Example: $12 per seat
      });
      alert("Booking Confirmed! Enjoy your movie.");
      navigate('/');
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-yellow-500 font-black italic animate-pulse tracking-widest text-2xl">
        LOADING CINEMA...
      </div>
    </div>
  );

  if (!movie) return (
    <div className="h-screen bg-[#0f0f0f] flex items-center justify-center text-white font-black uppercase">
      Movie Not Found
    </div>
  );

  const videoId = getYouTubeId(movie.trailerUrl || movie.trailerID);

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white pb-20 selection:bg-cyan-500 selection:text-black">
      
      {/* 1. HERO BACKDROP SECTION */}
      <div className="h-[45vh] w-full relative">
        <img 
          src={movie.backdrop || movie.image} 
          alt="" 
          className="w-full h-full object-cover opacity-30 blur-sm" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-[#0f0f0f]/80" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-8 left-8 z-50 bg-black/50 p-3 rounded-full hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="container mx-auto px-6 -mt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* 2. LEFT COLUMN: TRAILER & SEATS */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* YouTube Player Container */}
            <div className="aspect-video w-full bg-black border border-white/10 rounded shadow-2xl overflow-hidden">
              {videoId ? (
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title="Trailer" frameBorder="0" allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 uppercase font-black italic p-10 text-center border border-dashed border-white/10">
                  <Play size={48} className="mb-4 opacity-20" />
                  Trailer Preview Unavailable
                </div>
              )}
            </div>
            
            {/* Title & Description */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase text-cyan-400">
                 <span className="bg-white/5 px-4 py-2 border border-white/10 rounded-full flex items-center gap-2">
                    <Clock size={14}/> {movie.duration || "120"} MIN
                 </span>
                 <span className="bg-white/5 px-4 py-2 border border-white/10 rounded-full flex items-center gap-2">
                    <Tag size={14}/> {movie.genre || "Featured"}
                 </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed font-medium italic opacity-80 max-w-3xl">
                {movie.synopsis || movie.description || "In a world where cinema meets reality, experience the thrill of the big screen."}
              </p>
            </div>

            {/* Seat Selection Map */}
            <div className="bg-[#141414] p-10 border border-white/5 rounded shadow-inner">
              <h2 className="text-yellow-500 font-black uppercase italic mb-12 flex items-center justify-center gap-2 tracking-[0.3em]">
                <Armchair size={20} /> Select Your Seats
              </h2>
              <div className="flex flex-col gap-5 items-center">
                {rows.map(row => (
                  <div key={row} className="flex gap-4">
                    {nums.map(n => {
                      const sId = `${row}${n}`;
                      const isSelected = selectedSeats.includes(sId);
                      return (
                        <button 
                          key={sId} 
                          onClick={() => handleSeatClick(sId)}
                          className={`w-10 h-10 rounded-t-2xl text-[10px] font-black transition-all transform active:scale-90 ${
                            isSelected 
                            ? "bg-cyan-500 text-black scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)]" 
                            : "bg-[#222]text-gray-500 hover:bg-yellow-500 hover:text-black"
                          }`}
                        >
                          {sId}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="w-3/4 h-2 bg-cyan-900/30 mx-auto mt-16 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500 blur-md opacity-40"></div>
              </div>
              <p className="text-center text-[10px] text-cyan-800 font-black uppercase mt-4 tracking-[0.8em]">Screen This Way</p>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: BOOKING SIDEBAR */}
          <div className="space-y-6 self-start sticky top-10">
            <div className="bg-[#141414] p-8 border border-white/5 shadow-2xl space-y-8">
              
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase italic tracking-widest text-yellow-500 border-b border-white/10 pb-3 flex justify-between items-center">
                  Location <MapPin size={14} />
                </h3>
                <p className="text-white font-bold uppercase text-sm italic">{movie.theatre || "Grand Cineplex"}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase italic tracking-widest text-yellow-500 border-b border-white/10 pb-3 flex justify-between items-center">
                  Showtimes <Play size={14} fill="currentColor" />
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {(Array.isArray(movie.showtimes) ? movie.showtimes : []).map((time, index) => (
                    <button 
                      key={index} 
                      onClick={() => setSelectedTime(time)}
                      className={`border py-4 text-[11px] font-black uppercase italic transition-all ${
                        selectedTime === time 
                        ? "bg-yellow-500 text-black border-yellow-500 shadow-lg scale-105" 
                        : "border-white/10 text-gray-500 hover:border-white hover:text-white"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Price & Confirmation */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 italic">
                  <span>Seats: {selectedSeats.length}</span>
                  <span>Total: ${selectedSeats.length * 12}</span>
                </div>
                
                <button 
                  onClick={handleBooking}
                  disabled={!selectedTime || selectedSeats.length === 0}
                  className={`w-full font-black py-6 text-xs uppercase italic tracking-[0.4em] transition-all shadow-2xl ${
                    selectedTime && selectedSeats.length > 0 
                    ? "bg-cyan-600 text-white hover:bg-cyan-500 active:scale-95" 
                    : "bg-[#1a1a1a] text-gray-700 cursor-not-allowed border border-white/5"
                  }`}
                >
                  Buy Ticket
                </button>
              </div>
            </div>

            {/* Selected Seats Label */}
            {selectedSeats.length > 0 && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded text-center">
                <p className="text-[10px] font-black uppercase text-cyan-500 italic">
                  Confirming Seats: {selectedSeats.join(', ')}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 