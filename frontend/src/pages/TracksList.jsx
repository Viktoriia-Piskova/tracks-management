import React, { useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTracks, deleteTrack } from "../utils/http";
import Loader from "../components/Loader";
import Error from "../components/Error";
import TrackItem from "../components/TrackItem";
import DeleteTrack from "../components/DeleteTrack";
import Header from "../layouts/Header";
import AsideFilters from "../layouts/AsideFilters";
import Pagination from "../components/Pagination";
import { FilterContext } from "../store/filters-context";

const TracksList = () => {
  const { filters } = useContext(FilterContext);
  const [page, setPage] = useState(1);

  const [isDeleting, setIsDeleting] = useState(false);
  const [currentEventId, setCurrentEventId] = useState("");
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const {
    mutate,
    isPending: isPendingDeleting,
    isError: isErrorDeleting,
    error: errorDeleting,
  } = useMutation({
    mutationFn: deleteTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tracks", page, filtersKey],
        refetchType: "none",
      });
    },
    onSettled: () => {
      setIsDeleting(false);
      queryClient.invalidateQueries({
        queryKey: ["tracks", page, filtersKey],
        refetchType: "none",
      });
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

  function nextPage() {
    setPage((p) => Math.min(p + 1, data.meta.totalPages));
  }

  function prevPage() {
    setPage((page) => Math.max(page - 1, 1));
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tracks", page, JSON.stringify(filters)],
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
    if (data?.data?.length < 1) {
      content = (
        <div>
          <p>Sorry, no tracks found. Please, reset filters</p>
        </div>
      );
    } else {
      content = (
        <>
          <ul className="bg-slate-800">
            {data.data.map((track) => (
              <li key={track.id}>
                <TrackItem
                  track={track}
                  onEdit={() => openEditTrackModal(track.slug)}
                  onFileUpdate={() => openEditTrackModal(track.slug)}
                  onDelete={() => handleStartDelete(track.id)}
                />
              </li>
            ))}
          </ul>
          <Pagination
            page={page}
            totalPages={data.meta.totalPages}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </>
      );
    }
  }

  return (
    <div className="w-[100vw] flex">
      <main className="px-5 max-w-[1440px] m-auto">
        <Header />
        <div>
          <button data-testid="create-track-button" onClick={openCreateTrackModal}>Create a Track</button>
        </div>
        <div>{content}</div>
        {isDeleting && (
          <DeleteTrack
            onStopDeleting={handleStopDelete}
            onStartDeleting={() => handleDelete(currentEventId)}
          />
        )}
      </main>
      <AsideFilters />
    </div>
  );
};

export default TracksList;
