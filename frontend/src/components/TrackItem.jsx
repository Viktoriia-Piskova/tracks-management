import React from "react";
import { formatIsoTime } from "../utils/helpers";

const TrackItem = ({ track, onEdit, onDelete, onTrackUpdate }) => {
  return (
    <article data-testid={`track-item-${track.id}`}
      id={track.id}
      data-slug={track.slug}
      className="flex gap-4 justify-between"
    >
      <div className="h-10 max-w-[50px]">
        <img src={track.coverImage || "/music-track-placeholder.webp" } alt={track.album} />
      </div>
      <div>
        <h3 data-testid={`track-item-${track.id}-title`}>{track.title}</h3>
        <p data-testid={`track-item-${track.id}-artist`}>{track.artist}</p>
        <p>{track.album}</p>
        <ul className="flex">
          {track.genres.map((genre) => {
            return <li key={`${track.id}_${genre}`}>{genre}</li>;
          })}
        </ul>
        {track.audioFile && (
          <audio
            controls
            src={`http://localhost:8000/api/files/${track.audioFile}`}
          ></audio>
        )}
      </div>

      <p className="flex">
        <span>{formatIsoTime(track.createdAt)}</span>
        <span>{formatIsoTime(track.updatedAt)}</span>
      </p>
      <div className="flex align-bottom">
        <button data-testid={`edit-track-${track.id}`} onClick={onEdit}>Edit</button>
        <button data-testid={`delete-track-${track.id}`} onClick={onDelete}>Delete</button>
        <button data-testid={`upload-track-${track.id}`} onClick={onTrackUpdate}>Track file</button>
      </div>
    </article>
  );
};

export default TrackItem;
