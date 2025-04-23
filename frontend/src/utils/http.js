import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export const fetchTracks = async ({
  signal,
  page = 1,
  limit = 10,
  search,
  sort,
  order,
  artist,
  genre
}) => {
  const baseUrl = `http://localhost:8000/api/tracks`;
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  if (search) {
    params.append("search", search);
  }
  if (sort) {
    params.append("sort", sort);
  }
  if (order) {
    params.append("order", order);
  }
  if (artist) {
    params.append("artist", artist);
  }
  if (genre) {
    params.append("genre", genre);
  }

  const url = `${baseUrl}?${params.toString()}`;
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
    body: JSON.stringify(trackData.track),
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

export const fetchTrack = async ({ signal, slug }) => {
  const response = await fetch(`http://localhost:8000/api/tracks/${slug}`, {
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

export const deleteTrack = async ( id ) => {
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
    body: JSON.stringify(track),
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
