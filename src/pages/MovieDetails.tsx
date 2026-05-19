import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails, getMovieCast, getMovieVideos, getSimilarMovies } from "../api/tmdb";
import RatingStars from "../components/RatingStars";
import { useAuth } from "../context/AuthContext";
import { useFavourite } from "../context/FavouriteContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getMovies } from "../services/movieStore";
import { Movie } from "../types/series";
import ReviewSection from "../components/ReviewSection";
import { SkeletonDetail } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import ShareButton from "../components/ShareButton";

interface Genre {
  id: number;
  name: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Video {
  key: string;
  type: string;
  site: string;
}

interface SimilarMovieItem {
  id: number;
  title: string;
  poster_path: string | null;
}

interface MovieDetailType extends Movie {
  vote_average?: number;
  poster_path?: string;
  release_date?: string;
  runtime?: number;
  status?: string;
  genres?: Genre[];
  budget?: number;
  overview?: string;
}

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toggleFavourite, isFavourite } = useFavourite();
  const { showToast } = useToast();
  
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [isLocal, setIsLocal] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovieItem[]>([]);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadMovieData() {
      try {
        const localMovies: Movie[] = getMovies();
        const foundLocal = localMovies.find((m) => m.id.toString() === id);

        if (foundLocal) {
          setMovie(foundLocal as MovieDetailType);
          setIsLocal(true);
          setLoading(false);
          return;
        }

        const targetId = id!;
        
        const [detailsData, castData, videosData, similarData] = await Promise.all([
          getMovieDetails(targetId),
          getMovieCast(targetId),
          getMovieVideos(targetId),
          getSimilarMovies(targetId)
        ]);

        setMovie(detailsData);
        setCast(castData.cast?.slice(0, 12) ?? []);

        const trailer = videosData.results?.find(
          (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
        ) ?? videosData.results?.[0];
        
        if (trailer) {
          setTrailerKey(trailer.key);
        }

        setSimilarMovies(similarData.results?.slice(0, 6) ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMovieData();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    async function load() {
      if (!user) return;
      const ratingRef = doc(db, "ratings", `${user.uid}_movie_${id}`);
      const snap = await getDoc(ratingRef);
      if (snap.exists()) setUserRating(snap.data().rating);

      const watchlistRef = doc(db, 'watchlist', `${user.uid}_movie_${id}`);
      const wSnap = await getDoc(watchlistRef);
      setInWatchlist(wSnap.exists());
    }
    load();
  }, [user, id]);

  async function handleRate(rating: number) {
    if (!user || !id) return;
    const ref = doc(db, "ratings", `${user.uid}_movie_${id}`);
    await setDoc(ref, {
      uid: user.uid,
      seriesId: `movie_${id}`,
      rating,
      createdAt: new Date().toISOString(),
    });
    setUserRating(rating);
    showToast(`Rated ${rating} stars ⭐`);
  }

  function handleToggle() {
    if (!user || !id || !movie) return;
    const favorited = isFavourite(Number(id));
    toggleFavourite({
      id: Number(id),
      title: movie.title || "",
      image: movie.image || `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      rating: movie.rating ?? (movie.vote_average ?? 0) / 2,
    });
    showToast(favorited ? 'Removed from favorites' : 'Added to favorites ❤️');
  }

  async function handleWatchlist() {
    if (!user || !id || !movie) return;
    const ref = doc(db, 'watchlist', `${user.uid}_movie_${id}`);
    if (inWatchlist) {
      await deleteDoc(ref);
      setInWatchlist(false);
      showToast('Removed from watchlist');
    } else {
      await setDoc(ref, {
        uid: user.uid,
        contentId: id,
        type: 'movie',
        title: movie.title,
        image: movie.image || `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        addedAt: new Date().toISOString(),
      });
      setInWatchlist(true);
      showToast('Added to watchlist 🕐');
    }
  }

  if (loading) return <SkeletonDetail />;
  if (!movie || !id) return <p className="text-center mt-10 text-white">Movie not found</p>;

  const favorited = isFavourite(Number(id));

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <img
        src={movie.image || `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title || "Movie Backdrop"}
        className="rounded-xl mb-6 w-full max-h-[500px] object-cover"
      />

      {/* Title + Favorite + Watchlist */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        {user && (
          <div className="flex gap-3 items-center shrink-0">
            <button
              onClick={handleWatchlist}
              className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                inWatchlist
                  ? 'border-pink-500 text-pink-400'
                  : 'border-zinc-600 text-zinc-400 hover:border-zinc-400'
              }`}
            >
              {inWatchlist ? '🕐 Watchlist ✓' : '🕐 Add to Watchlist'}
            </button>

            <ShareButton title={movie.title} />
            <button
              onClick={handleToggle}
              className={`text-2xl transition-transform hover:scale-110 ${
                favorited ? "text-pink-500" : "text-zinc-500"
              }`}
            >
              {favorited ? "♥" : "♡"}
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      {user ? (
        <div>
          <p className="text-sm text-zinc-400 mb-1">Your rating:</p>
          <RatingStars rating={userRating} onRate={handleRate} />
        </div>
      ) : (
        <div>
          <RatingStars rating={movie.rating || (movie.vote_average ?? 0) / 2} />
          <p className="text-xs text-zinc-500 mt-1">Sign in to rate this movie.</p>
        </div>
      )}

      <p className="mt-4 text-gray-400">
        {movie.overview || "No description available."}
      </p>

      {/* Movie Info */}
      {!isLocal && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {movie.release_date && (
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Release Date</p>
              <p className="text-sm text-white mt-1">{movie.release_date}</p>
            </div>
          )}
          {movie.runtime && (
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Runtime</p>
              <p className="text-sm text-white mt-1">{movie.runtime} min</p>
            </div>
          )}
          {movie.status && (
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Status</p>
              <p className="text-sm text-white mt-1">{movie.status}</p>
            </div>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <div className="bg-zinc-900 rounded-lg p-3 col-span-2">
              <p className="text-xs text-zinc-500">Genres</p>
              <p className="text-sm text-white mt-1">
                {movie.genres.map((g: Genre) => g.name).join(", ")}
              </p>
            </div>
          )}
          {movie.budget !== undefined && movie.budget > 0 && (
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Budget</p>
              <p className="text-sm text-white mt-1">${movie.budget.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {/* Trailer */}
      {!isLocal && trailerKey && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Trailer</h2>
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="mb-8 mt-10">
          <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cast.slice(0, 10).map((member: CastMember) => (
              <Link
                key={member.id}
                to={`/actor/${member.id}`}
                className="bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                      : '/placeholder.jpg'
                  }
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-white text-sm font-semibold truncate">{member.name}</p>
                  <p className="text-zinc-500 text-xs truncate mt-1">as {member.character}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {!isLocal && similarMovies.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {similarMovies.map((m: SimilarMovieItem) => (
              <Link to={`/movies/${m.id}`} key={m.id}>
                <div className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition">
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                        : '/placeholder.jpg'
                    }
                    alt={m.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{m.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ReviewSection contentId={`movie_${id}`} />
    </div>
  );
}