import { useState } from "react";

import GenreTag from "./GenreTag.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchTrackGenres } from "../utils/http.js";
import Error from "./Error.jsx";

const TrackForm = ({ inputData, onSubmit, children }) => {
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
    const data = Object.fromEntries(formData);

    onSubmit({ ...data });
  }

  return (
    <form id="track-form" onSubmit={handleSubmit}>
      <p>
        <label htmlFor="album">album</label>
        <input
          type="text"
          id="album"
          name="album"
          defaultValue={inputData?.album ?? ""}
        />
      </p>
      <p>
        <label htmlFor="artist">artist</label>
        <input
          type="text"
          id="artist"
          name="artist"
          defaultValue={inputData?.artist ?? ""}
        />
      </p>
      <p>
        <label htmlFor="coverImage">coverImage</label>
        <input
          type="text"
          id="coverImage"
          name="coverImage"
          defaultValue={inputData?.coverImage ?? ""}
        />
      </p>
      <p>
        <label htmlFor="title">title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
        />
      </p>

      <div className="genres">
        {isPending && <p>Loading genres...</p>}
        {isError && (
          <Error
            title="Failed to load genres"
            message="Please try again"
          />
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
