import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTracks, deleteTrack } from "../utils/http";
import Loader from "../components/Loader";
import Error from "../components/Error";
import TrackItem from "../components/TrackItem";
import DeleteTrack from "../components/DeleteTrack";
import Header from "../layouts/Header";
import AsideFilters from "../layouts/AsideFilters";

const TracksList = () => {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    search: "",
    sort: "",
    order: "",
    artist: "",
    genre: "",
  });


  // const [searchParams] = useSearchParams();
  // const filters = Object.fromEntries([...searchParams]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("fakeid");

  const {
    mutate,
    isPending: isPendingDeleting,
    isError: isErrorDeleting,
    error: errorDeleting,
  } = useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tracks", page],
        refetchType: "none",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  function handleStartDelete(trackId) {
    setIsDeleting(true);
    setCurrentEventId(trackId);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleDelete(currentEventId) {
    mutate(currentEventId);
  }

  const limit = 10;
  const navigate = useNavigate();
  const location = useLocation();

  function openCreateTrackModal() {
    navigate("/tracks/create", {
      state: { backgroundLocation: location },
    });
  }

  function openEditTrackModal(slug) {
    navigate(`/tracks/edit/${slug}`, {
      state: { backgroundLocation: location },
    });
  }

  function applyFilters(param) {
    console.log(param)

    setFilters((prev) => ({ ...prev, ...param }));
    console.log(filters)
  }

  function resetFilters() {
    setFilters({
      searchTerm: "",
      sort: "",
      order: "",
      artist: "",
      genre: "",
    });
  
    // Clear URL params too, optional but tasty 😋
    setSearchParams(new URLSearchParams());
  }


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tracks", page, filters],
    queryFn: ({ signal }) => fetchTracks({ signal, page, limit, ...filters }),
    keepPreviousData: true,
  });

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
        <ul className="bg-slate-800">
          {data.data.map((track) => (
            <li key={track.id}>
              <TrackItem
                track={track}
                onEdit={() => openEditTrackModal(track.slug)}
                onDelete={() => handleStartDelete(track.id)}
              />
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
    <div className="w-[100vw] flex">
      <main className="px-5 max-w-[1440px] m-auto">
        <Header />
        <div>
          <button onClick={openCreateTrackModal}>Create a Track</button>
        </div>
        <div>{content}</div>
        {isDeleting && (
          <DeleteTrack
            onStopDeleting={handleStopDelete}
            onStartDeleting={() => handleDelete(currentEventId)}
          />
        )}
      </main>
      <AsideFilters onFilter={applyFilters} onReset={resetFilters} />
    </div>
  );
};

export default TracksList;
