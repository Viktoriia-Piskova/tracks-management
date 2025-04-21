import React from "react";

const TrackItem = ({ track }) => {
  return (
    <article id={track.id} data-slug={track.slug}>
      <h3>{track.title}</h3>
      <p>{track.artist}</p>
      <p>{track.album}</p>
      <ul>
        {track.genres.map((genre) => {
          return <li key={`${track.id}_${genre}`}>{genre}</li>;
        })}
      </ul>
      <div>
        <img src={track.coverImage} alt={track.album} />
      </div>
      <audio controls src={track.audioFile}></audio>
      <p>
        <span>{track.createdAt}</span>
        <span>{track.updatedAt}</span>
      </p>
    </article>
  );
};

export default TrackItem;
