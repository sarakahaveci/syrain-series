import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSeriesDetails,
  getSeriesCast,
  getSeriesEpisodes,
  getSeriesVideos,
  getSimilarSeries,
} from "../api/tmdb";
import RatingStars from "../components/RatingStars";
import { Series } from "../types/series";
import ReviewSection from "../components/ReviewSection";
import { useAuth } from "../context/AuthContext";
import { useFavourite } from "../context/FavouriteContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { SkeletonDetail } from "../components/Skeleton";
import { useToast } from "../context/ToastContext";
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

interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  air_date?: string;
}

interface Video {
  key: string;
  type: string;
  site: string;
}

interface SimilarSeriesItem {
  id: number;
  name: string;
  poster_path: string | null;
}

interface SeriesDetailsType extends Series {
  name?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  first_air_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  genres?: Genre[];
}

export default function SeriesDetails() {
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();
  const { toggleFavourite, isFavourite } = useFavourite();
  const { showToast } = useToast();

  const [series, setSeries] = useState<SeriesDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLocal, setIsLocal] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [similarSeries, setSimilarSeries] = useState<SimilarSeriesItem[]>([]);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadSeriesData() {
      try {
        const localSeries: Series[] = JSON.parse(
          localStorage.getItem("custom-series") || "[]"
        );

        const foundLocal = localSeries.find(
          (s) => s.id.toString() === id
        );

        if (foundLocal) {
          setSeries(foundLocal as SeriesDetailsType);
          setIsLocal(true);
          setLoading(false);
          return;
        }

        const targetId = id!;

        const [
          detailsData,
          castData,
          episodesData,
          videosData,
          similarData,
        ] = await Promise.all([
          getSeriesDetails(targetId),
          getSeriesCast(targetId),
          getSeriesEpisodes(targetId, 1),
          getSeriesVideos(targetId),
          getSimilarSeries(targetId),
        ]);

        setSeries(detailsData);

        setCast(
          (castData.cast?.slice(0, 12) ?? []) as CastMember[]
        );

        setEpisodes(
          (episodesData.episodes ?? []) as Episode[]
        );

        const trailer =
          (videosData.results?.find(
            (v: Video) =>
              v.type === "Trailer" && v.site === "YouTube"
          ) as Video | undefined) ??
          videosData.results?.[0];

        if (trailer) {
          setTrailerKey(trailer.key);
        }

        setSimilarSeries(
          (similarData.results?.slice(0, 6) ?? []) as SimilarSeriesItem[]
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSeriesData();
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;

    async function load() {
      if (!user) return;

      const ratingRef = doc(
        db,
        "ratings",
        `${user.uid}_${id}`
      );

      const snap = await getDoc(ratingRef);

      if (snap.exists()) {
        setUserRating(snap.data().rating as number);
      }

      const watchlistRef = doc(
        db,
        "watchlist",
        `${user.uid}_series_${id}`
      );

      const wSnap = await getDoc(watchlistRef);

      setInWatchlist(wSnap.exists());
    }

    load();
  }, [user, id]);

  async function handleRate(rating: number) {
    if (!user || !id) return;

    const ref = doc(
      db,
      "ratings",
      `${user.uid}_${id}`
    );

    await setDoc(ref, {
      uid: user.uid,
      seriesId: id,
      rating,
      createdAt: new Date().toISOString(),
    });

    setUserRating(rating);

    showToast(`Rated ${rating} stars ⭐`);
  }

  async function handleSeasonChange(season: number) {
    if (!id) return;

    setSelectedSeason(season);

    const data = await getSeriesEpisodes(id, season);

    setEpisodes(
      (data.episodes ?? []) as Episode[]
    );
  }

  function handleToggle() {
    if (!user || !id || !series) return;

    const favorited = isFavourite(Number(id));

    toggleFavourite({
      id: Number(id),
      title: series.title || series.name || "",
      image:
        series.image ||
        `https://image.tmdb.org/t/p/w500${series.poster_path}`,
      rating:
        series.rating ||
        (series.vote_average ?? 0) / 2,
    });

    showToast(
      favorited
        ? "Removed from favorites"
        : "Added to favorites ❤️"
    );
  }

  async function handleWatchlist() {
    if (!user || !id || !series) return;

    const ref = doc(
      db,
      "watchlist",
      `${user.uid}_series_${id}`
    );

    if (inWatchlist) {
      await deleteDoc(ref);

      setInWatchlist(false);

      showToast("Removed from watchlist");
    } else {
      await setDoc(ref, {
        uid: user.uid,
        contentId: id,
        type: "series",
        title: series.title || series.name,
        image:
          series.image ||
          `https://image.tmdb.org/t/p/w500${series.poster_path}`,
        addedAt: new Date().toISOString(),
      });

      setInWatchlist(true);

      showToast("Added to watchlist 🕐");
    }
  }

  if (loading) {
    return <SkeletonDetail />;
  }

  if (!series || !id) {
    return (
      <p className="text-center mt-10">
        Series not found
      </p>
    );
  }

  const favorited = isFavourite(Number(id));
  const totalSeasons = series.number_of_seasons ?? 1;

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <img
        src={
          series.image ||
          `https://image.tmdb.org/t/p/w500${series.poster_path}`
        }
        alt={series.title || series.name || "Series"}
        className="rounded-xl mb-6 w-full max-h-[500px] object-cover"
      />

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl first-letter:capitalize font-bold mb-2">
          {series.title || series.name}
        </h1>

        {user && (
          <div className="flex gap-3 items-center shrink-0">
            <button
              onClick={handleWatchlist}
              className={`text-sm px-3 py-1.5 rounded-lg border transition ${
                inWatchlist
                  ? "border-pink-500 text-pink-400"
                  : "border-zinc-600 text-zinc-400 hover:border-zinc-400"
              }`}
            >
              {inWatchlist
                ? "🕐 Watchlist ✓"
                : "🕐 Add to Watchlist"}
            </button>

            <ShareButton
              title={series.title || series.name || ""}
            />

            <button
              onClick={handleToggle}
              className={`text-2xl transition-transform hover:scale-110 ${
                favorited
                  ? "text-pink-500"
                  : "text-zinc-500"
              }`}
            >
              {favorited ? "♥" : "♡"}
            </button>
          </div>
        )}
      </div>

      {user ? (
        <div>
          <p className="text-sm text-zinc-400 mb-1">
            Your rating:
          </p>

          <RatingStars
            rating={userRating}
            onRate={handleRate}
          />
        </div>
      ) : (
        <div>
          <RatingStars
            rating={
              series.rating ||
              (series.vote_average ?? 0) / 2
            }
          />

          <p className="text-xs text-zinc-500 mt-1">
            Sign in to rate this series.
          </p>
        </div>
      )}

      <p className="mt-4 text-gray-400">
        {series.overview ||
          "No description available."}
      </p>

      {!isLocal && (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {series.first_air_date && (
              <div className="bg-zinc-900 rounded-lg p-3">
                <p className="text-xs text-zinc-500">First Aired</p>
                <p className="text-sm text-white mt-1">{series.first_air_date}</p>
              </div>
            )}
            <div className="bg-zinc-900 rounded-lg p-3">
              <p className="text-xs text-zinc-500">Seasons</p>
              <p className="text-sm text-white mt-1">{totalSeasons}</p>
            </div>
          </div>

          {/* Trailer Video Section */}
          {trailerKey && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Trailer</h2>
              <div className="aspect-video w-full max-h-[450px]">
                <iframe
                  className="w-full h-full rounded-xl"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Series Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Seasons & Episodes Selector Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Episodes</h2>
              {totalSeasons > 1 && (
                <select
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-1 text-sm outline-none cursor-pointer"
                >
                  {Array.from({ length: totalSeasons }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Season {i + 1}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {episodes.map((ep) => (
                <div key={ep.id} className="flex gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                  {ep.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                      alt={ep.name}
                      className="w-32 h-20 object-cover rounded-md shrink-0 bg-zinc-800"
                    />
                  ) : (
                    <div className="w-32 h-20 bg-zinc-800 rounded-md shrink-0 flex items-center justify-center text-xs text-zinc-500">
                      No Image
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      E{ep.episode_number} - {ep.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {ep.overview || "No description available for this episode."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cast Members Section */}
          {cast.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
                {cast.map((member) => (
                  <div key={member.id} className="shrink-0 w-24 text-center">
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Image"
                      }
                      alt={member.name}
                      className="w-24 h-32 object-cover rounded-lg mb-2 bg-zinc-800"
                    />
                    <p className="text-xs font-semibold truncate text-white">{member.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Series Recommendation Section */}
          {similarSeries.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">More Like This</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {similarSeries.map((item) => (
                  <a href={`/series/${item.id}`} key={item.id} className="block group">
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                          : "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={item.name}
                      className="rounded-lg object-cover w-full aspect-[2/3] transition group-hover:scale-105 bg-zinc-800"
                    />
                    <p className="text-xs mt-1 truncate text-zinc-300 group-hover:text-white">
                      {item.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ReviewSection contentId={id} />
    </div>
  );
}