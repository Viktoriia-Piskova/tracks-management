import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTracks } from "../utils/http";
import Loader from "../components/Loader";
import Error from "../components/Error";
import TrackItem from "../components/TrackItem";

const TracksList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const location = useLocation();

  function openCreateTrackModal() {
    navigate("/tracks/create", {
      state: { backgroundLocation: location },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tracks", page],
    queryFn: ({ signal }) => fetchTracks({ signal, page, limit }),
    keepPreviousData: true,
  });

  console.log(data);

  let content = "";

  if (isLoading) {
    content = <Loader />;
  }

  if (isError) {
    <Error
      title="An error occured"
      message={error.info?.message || "Failed to fetch"}
    />;
  }

  if (data) {
    content = (
      <>
        <h2>List of tracks</h2>
        <ul>
          {data.data.map((track) => (
            <li key={track.id}>
              <TrackItem track={track} />
            </li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => setPage((page) => Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span>
            Page {data.meta.page} of {data.meta.totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, data.meta.totalPages))
            }
            disabled={page === data.meta.totalPages}
          >
            Next
          </button>
        </div>
      </>
    );
  }

  return (
    <div>
      <header>
        <h1>Welcome to The Tracks List</h1>
        <p>View, sort, search, filter, edit and create tracks</p>
      </header>
      <main>
        <div>
          <button onClick={openCreateTrackModal}>Create a Track</button>
        </div>
        <div>{content}</div>
      </main>
    </div>
  );
};

export default TracksList;
