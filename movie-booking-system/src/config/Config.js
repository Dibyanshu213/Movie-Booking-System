// Centralized configuration file for Movie Booking project

const Config = {
  // External TMDb API removed — using Firebase as data source
  TMDB_API_KEY: "",
  TMDB_BASE_URL: "",

  // Firebase project info (already in Firebase.js, but you can reference here if needed)
  FIREBASE_PROJECT_ID: "movie-booking-system-7260b",

  // App settings
  APP_NAME: "Movie Booking System",
  DEFAULT_THEME: "light",

  // Admin settings
  ADMIN_EMAILS: ["admin@example.com"],

  // Other constants
  ITEMS_PER_PAGE: 12,
};

export default Config;