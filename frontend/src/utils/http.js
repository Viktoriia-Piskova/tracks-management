import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export const fetchTracks = async ({ signal, page = 1, limit = 10, searchTerm }) => {
  let url = `http://localhost:8000/api/tracks?page=${page}&limit=${limit}`;

  if (searchTerm) {
    url = `http://localhost:8000/api/tracks?search=${searchTerm}`;
  }
  const response = await fetch(url, { signal: signal, method: "GET" });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the tracks");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();

  return data;
};

export const fetchTrackGenres = async ({ signal }) => {
  let url = `http://localhost:8000/api/genres`;
  const response = await fetch(url, { signal: signal, method: "GET" });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the genres");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
};

export const createNewTrack = async (trackData) => {
  const response = await fetch("http://localhost:8000/api/tracks", {
    method: "POST",
    body: JSON.stringify(trackData),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the track");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { track } = await response.json();
  return track;
};

export const fetchTrack = async ({ signal, id }) => {
  const response = await fetch(`http://localhost:8000/api/tracks/${id}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the track");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const track = await response.json();
  return track;
};

export const deleteTrack = async ({ id }) => {
  const response = await fetch(`http://localhost:8000/api/tracks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the track");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
};

export const updateTrack = async ({ id, track }) => {
  const response = await fetch(`http://localhost:8000/api/tracks/${id}`, {
    method: "PUT",
    body: JSON.stringify({track}),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error();
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
};