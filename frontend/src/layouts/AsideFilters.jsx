import { useCallback, useContext, useEffect } from "react";
import { fetchTrackGenres } from "../utils/http";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "../utils/helpers";
import { FilterContext } from "../store/filters-context";

const AsideFilters = () => {
  const { updateFilter, resetFilters, filters } = useContext(FilterContext);

  const { data, isPending, isError, error } = useQuery({
    queryFn: fetchTrackGenres,
    queryKey: ["track-genres"],
  });

  const handleChange = (key, value) => {
    updateFilter(key, value);
  };

  const debouncedSearch = useCallback(
    debounce((val) => handleChange("search", val), 500),
    []
  );

  return (
    <aside className="p-4 bg-gray-100 rounded-xl space-y-4 w-full lg:max-w-[500px] bg-gray-300">
      <input
        data-testid="search-input"
        type="text"
        placeholder="Search..."
        defaultValue={filters.search || ""}
        onChange={(e) => debouncedSearch(e.target.value)}
        className="p-2 border rounded w-full"
      />

      {data && (
        <select
          data-testid="filter-genre"
          defaultValue={filters.genre || ""}
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
        data-testid="sort-select"
        defaultValue={filters.sort || "artist"}
        onChange={(e) => handleChange("sort", e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="artist">Sort by Artist</option>
        <option value="title">Sort by Title</option>
        <option value="genre">Sort by Genre</option>
      </select>

      <select
        defaultValue={filters.order || "asc"}
        onChange={(e) => handleChange("order", e.target.value)}
        className="p-2 border rounded w-full"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button type="button" className="bg-gray-800" onClick={resetFilters}>
        Reset
      </button>
    </aside>
  );
};

export default AsideFilters;
