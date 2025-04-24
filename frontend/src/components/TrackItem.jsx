import React from "react";
import { formatIsoTime } from "../utils/helpers";

const TrackItem = ({ track, onEdit, onDelete, onFileUpdate }) => {
  return (
    <article
      data-testid={`track-item-${track.id}`}
      id={track.id}
      data-slug={track.slug}
      className="flex gap-4 justify-between hover:bg-slate-700 px-3 py-5"
    >
      <div className="h-10 max-w-[50px]">
        <img
          src={track.coverImage || "/music-track-placeholder.webp"}
          alt={track.album}
        />
      </div>
      <div className="w-[30%]">
        <h3 className="font-bold" data-testid={`track-item-${track.id}-title`}>
          {track.title}
        </h3>
        <p data-testid={`track-item-${track.id}-artist`}>{track.artist}</p>
        <p className="text-gray-400">{track.album}</p>
        <ul className="flex flex-wrap">
          {track.genres.map((genre) => {
            return (
              <li
                className="bg-slate-500 text-slate-950 rounded-md m-2 px-1"
                key={`${track.id}_${genre}`}
              >
                <small className="font-bold">{genre}</small>
              </li>
            );
          })}
        </ul>
        {track.audioFile && (
          <audio
            controls
            src={`http://localhost:8000/api/files/${track.audioFile}`}
          ></audio>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <p>
          <span className="font-bold">Created: </span>
          <span>{formatIsoTime(track.createdAt)}</span>
        </p>
        <p>
          <span className="font-bold">Updated: </span>
          <span>{formatIsoTime(track.updatedAt)}</span>
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="bg-green-900"
          data-testid={`edit-track-${track.id}`}
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-900"
          data-testid={`delete-track-${track.id}`}
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className="bg-blue-900"
          data-testid={`upload-track-${track.id}`}
          onClick={onFileUpdate}
        >
          File
        </button>
      </div>
    </article>
  );
};

export default TrackItem;
