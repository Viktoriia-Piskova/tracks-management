import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

export const fetchTracks = async ({
  signal,
  page = 1,
  limit = 10,
  searchTerm,
  sort,
  order,
  artist,
  genre
}) => {
  const baseUrl = `http://localhost:8000/api/tracks`;
  const params = new URLSearchParams();
  console.log(params);

  params.append("page", page);
  params.append("limit", limit);

  if (searchTerm) {
    params.append("search", searchTerm);
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
  //'http://localhost:8000/api/tracks?sort=artist&order=asc&search=mal&genre=rock&artist=Post%20Malone'
  console.log(url);
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
  console.log(track);
  const response = await fetch(`http://localhost:8000/api/tracks/${id}`, {
    method: "PUT",
    body: JSON.stringify({ track }),
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
