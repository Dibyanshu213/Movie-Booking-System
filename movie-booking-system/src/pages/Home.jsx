import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import MovieCard from '../components/MovieCard';
import { ChevronLeft, ChevronRight, MapPin, Play, Volume2 } from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playTrailer, setPlayTrailer] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(movieData);
      } catch (err) {
        console.error("Firebase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const nextSlide = () => {
    setPlayTrailer(false);
    setCurrentIndex((prev) => (prev === Math.min(movies.length - 1, 4) ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setPlayTrailer(false);
    setCurrentIndex((prev) => (prev === 0 ? Math.min(movies.length - 1, 4) : prev - 1));
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center text-pink-500 font-black italic tracking-widest">
      LOADING MOVIE PLEX...
    </div>
  );

  const activeMovie = movies[currentIndex];
  const activeVideoId = getYouTubeId(activeMovie?.trailerUrl);

  return (
    <div className="bg-black min-h-screen pb-20 text-white selection:bg-pink-500 selection:text-black">
      
      {/* SECTION: WELCOME HEADER */}
      <header className="py-12 px-4 text-center bg-gradient-to-b from-pink-600/20 to-transparent">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-2">
          WELCOME TO <span className="text-pink-500">MOVIE PLEX</span>
        </h1>
        <p className="text-gray-400 tracking-[0.6em] uppercase text-[10px] font-bold">
          Your Premium Movie Destination
        </p>
      </header>

      {/* SECTION: HERO CAROUSEL */}
      {movies.length > 0 && (
        <section className="h-[75vh] w-full relative overflow-hidden group">
          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 p-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-500 hover:text-black">
            <ChevronLeft size={40} />
          </button>

          {movies.slice(0, 5).map((movie, index) => {
            const isCurrent = index === currentIndex;
            return (
              <div key={movie.id} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                {/* Background */}
                <div className="absolute inset-0 z-0">
                  {isCurrent && playTrailer && activeVideoId ? (
                    <iframe 
                      className="w-full h-full scale-150"
                      src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&controls=0&mute=0&loop=1&playlist=${activeVideoId}&modestbranding=1`}
                      allow="autoplay; encrypted-media"
                    ></iframe>
                  ) : (
                    <img 
                      src={movie.backdrop || movie.image} 
                      className="w-full h-full object-cover transition-transform duration-[10000ms] scale-100 group-hover:scale-110"
                      alt=""
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Overlay */}
                <div className="relative z-20 h-full container mx-auto px-10 flex flex-col justify-end pb-24">
                  <span className="text-pink-500 font-black italic uppercase tracking-[0.4em] text-xs mb-4 block animate-bounce">
                    Now Trending
                  </span>
                  <h2 className="text-5xl md:text-8xl font-black italic uppercase text-white mb-6 max-w-4xl tracking-tighter leading-none">
                    {movie.title}
                  </h2>
                  
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setPlayTrailer(!playTrailer)}
                      className="flex items-center gap-3 bg-white text-black px-8 py-4 text-[12px] font-black rounded-sm uppercase italic tracking-widest hover:bg-pink-500 transition-all shadow-xl"
                    >
                      {playTrailer ? <Volume2 size={18} /> : <Play size={18} fill="black" />}
                      {playTrailer ? "Mute/Stop Trailer" : "Watch Trailer"}
                    </button>
                    
                    <button className="flex items-center gap-2 border-2 border-white/20 text-white px-8 py-4 text-[12px] font-black rounded-sm uppercase italic tracking-widest hover:bg-white hover:text-black transition-all">
                      <MapPin size={18} /> {movie.theatre || "Book Now"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 p-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-pink-500 hover:text-black">
            <ChevronRight size={40} />
          </button>
        </section>
      )}

      {/* SECTION: GRID LIST */}
      <main className="container mx-auto px-6 mt-20">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-pink-500"></div>
            <h2 className="text-4xl font-black uppercase italic tracking-tight">On The Big Screen</h2>
          </div>
          <p className="hidden md:block text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Showing {movies.length} Movies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;