import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TracksList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function openCreateTrackModal() {
    navigate("/tracks/create", {
      state: { backgroundLocation: location },
    });
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
      </main>
    </div>
  );
};

export default TracksList;
