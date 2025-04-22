import { useState, useEffect } from "react";
import GenresContainer from "./GenresContainer";
import { useQuery } from "@tanstack/react-query";
import { fetchTrackGenres } from "../utils/http.js";
import Error from "./Error.jsx";

const TrackForm = ({ inputData, onSubmit, trackOldData, children }) => {
  const [selectedGenres, setSelectedGenres] = useState(inputData?.genres || []);
  const [allGenres, setAllGenres] = useState([]);

  const { data, isPending, isError, error } = useQuery({
    queryFn: fetchTrackGenres,
    queryKey: ["track-genres"],
  });

  useEffect(() => {
    if (data && selectedGenres) {
      const filteredGenres = data.filter(
        (genreName) => !selectedGenres.includes(genreName)
      );
      setAllGenres(filteredGenres);
    }
  }, [data, selectedGenres]);

  function handleSelectGenre(genre) {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres((prevState) => [...prevState, genre]);
    } else {
      setSelectedGenres((prevState) => prevState.filter((g) => g !== genre));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const trackData = Object.fromEntries(formData);

    trackData.id = trackOldData?.id || Date.now().toString();
    trackData.slug =
      trackOldData?.slug ||
      trackData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    trackData.createdAt = trackOldData?.createdAt || new Date().toISOString();
    trackData.updatedAt = new Date().toISOString();
    trackData.genres = JSON.parse(trackData.genres);

    onSubmit({ ...trackData });
  }

  return (
    <form id="track-form" onSubmit={handleSubmit}>
      <p className="flex justify-between my-3">
        <label htmlFor="title">title</label>
        <input
          className="bg-slate-200 w-[50%]"
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
        />
      </p>
      <p className="flex justify-between my-3">
        <label htmlFor="album" className="text-slate-200">
          album
        </label>
        <input
          className="bg-slate-200 w-[50%]"
          type="text"
          id="album"
          name="album"
          defaultValue={inputData?.album ?? ""}
        />
      </p>
      <p className="flex justify-between my-3">
        <label htmlFor="artist">artist</label>
        <input
          className="bg-slate-200 w-[50%]"
          type="text"
          id="artist"
          name="artist"
          defaultValue={inputData?.artist ?? ""}
        />
      </p>
      <p className="flex justify-between my-3">
        <label htmlFor="coverImage">coverImage</label>
        <input
          className="bg-slate-200 w-[50%]"
          type="text"
          id="coverImage"
          name="coverImage"
          defaultValue={inputData?.coverImage ?? ""}
        />
      </p>

      {selectedGenres && (
        <div className="selected-genres bg-slate-500">
          <GenresContainer
            genres={selectedGenres}
            areSelected={true}
            onChangeSelectedGenres={handleSelectGenre}
          />
        </div>
      )}
      <div className="max-w-[1000px]">
        {isPending && <p>Loading genres...</p>}
        {isError && (
          <Error title="Failed to load genres" message="Please try again" />
        )}
        {allGenres && (
          <GenresContainer
            genres={allGenres}
            onChangeSelectedGenres={handleSelectGenre}
          />
        )}
        <input
          type="hidden"
          name="genres"
          value={JSON.stringify(selectedGenres)}
        />
      </div>
      {children}
    </form>
  );
};

export default TrackForm;
