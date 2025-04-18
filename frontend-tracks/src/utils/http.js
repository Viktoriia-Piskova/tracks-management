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
