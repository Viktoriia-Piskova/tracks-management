import React from "react";
import { formatIsoTime } from "../utils/helpers";

const TrackItem = ({ track, onEdit, onDelete, onTrackUpdate }) => {
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
      {track.audioFile && (
        <audio
          controls
          src={`http://localhost:8000/api/files/${track.audioFile}`}
        ></audio>
      )}
      <p>
        <span>{formatIsoTime(track.createdAt)}</span>
        <span>{formatIsoTime(track.updatedAt)}</span>
      </p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onTrackUpdate}>Track file</button>
    </article>
  );
};

export default TrackItem;
