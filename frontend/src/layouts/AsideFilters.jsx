import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTrackGenres } from "../utils/http";
import { useQuery } from "@tanstack/react-query";

const AsideFilters = ({ onFilter, onReset }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isPending, isError, error } = useQuery({
    queryFn: fetchTrackGenres,
    queryKey: ["track-genres"],
  });

  const handleChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);

    console.log(newParams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filterObject = Object.fromEntries(searchParams.entries());
    onFilter(filterObject);
  };

  useEffect(() => {
    const filterObject = Object.fromEntries(searchParams.entries());
    onFilter(filterObject);
  }, [searchParams]);

  return (
    <aside className="p-4 bg-gray-100 rounded-xl space-y-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="🔍 Search..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          className="p-2 border rounded w-full"
        />

        {data && (
          <select
            defaultValue={searchParams.get("genre") || ""}
            onChange={(e) => handleChange("genre", e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">All Genres</option>

            {data.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        )}

        <select
          defaultValue={searchParams.get("sort") || "artist"}
          onChange={(e) => handleChange("sort", e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="artist">Sort by Artist</option>
          <option value="title">Sort by Title</option>
        </select>

        <select
          defaultValue={searchParams.get("order") || "asc"}
          onChange={(e) => handleChange("order", e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="asc">⬆️ Ascending</option>
          <option value="desc">⬇️ Descending</option>
        </select>

        <button type="submit" className="bg-gray-800">
          Filter
        </button>
        <button type="button" className="bg-gray-800" onClick={onReset}>
          Reset
        </button>
      </form>
    </aside>
  );
};

export default AsideFilters;
