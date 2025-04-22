import { useState } from "react";

import GenreTag from "./GenreTag.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchTrackGenres } from "../utils/http.js";
import Error from "./Error.jsx";

const TrackForm = ({ inputData, onSubmit, trackOldData, children }) => {
  //const [selectedGenres, setSelectedGenres] = useState(inputData?.genres);

  const { data, isPending, isError, error } = useQuery({
    queryFn: fetchTrackGenres,
    queryKey: ["track-genres"],
  });

  // function handleSelectGenres(genre) {
  //   setSelectedGenres(genre);
  // }

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
    trackData.genres = trackOldData?.genres || [...data];

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

      {inputData?.genres && (
        <div className="selected-genres bg-slate-500">
          {inputData.genres.map((tag) => {
            return <GenreTag key={tag}>{tag}</GenreTag>;
          })}
        </div>
      )}
      <div className="max-w-[1000px]">
        {isPending && <p>Loading genres...</p>}
        {isError && (
          <Error title="Failed to load genres" message="Please try again" />
        )}
        {data &&
          data.map((tag) => {
            return <GenreTag key={tag}>{tag}</GenreTag>;
          })}
      </div>
      {children}
    </form>
  );
};

export default TrackForm;

//album:
// "SOS"
// artist
// :
// "Justin Bieber"
// audioFile
// :
// "test.mp3"
// coverImage
// :
// "https://picsum.photos/seed/Bohemian%20Rhapsody/300/300"
// createdAt
// :
// "2025-03-04T13:54:42.745Z"
// genres
// :
// (2) ['Rock', 'Country']
// id
// :
// "1741096482745"
// slug
// :
// "bohemian-rhapsody"
// title
// :
// "Bohemian Rhapsody"
// updatedAt
// :
// "2025-04-08T11:40:49.284Z"
