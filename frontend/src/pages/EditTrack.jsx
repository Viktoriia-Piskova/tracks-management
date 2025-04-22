import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTrack, queryClient, updateTrack } from "../utils/http.js";
import TrackForm from "../components/TrackForm.jsx";
import Loader from "../components/Loader.jsx";
import Error from "../components/Error.jsx";

const EditTrack = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryFn: ({ signal }) => fetchTrack({ signal, slug: params.id }),
    queryKey: ["tracks", params.id],
  });

  const { mutate } = useMutation({
    mutationFn: updateTrack,
    onMutate: async (data) => {
      const newTrackData = data;
      queryClient.cancelQueries({ queryKey: ["tracks", params.id] });
      const previousTracksData = queryClient.getQueryData([
        "tracks",
        params.id,
      ]);
      queryClient.setQueryData(["tracks", params.id], (oldData) => ({
        ...oldData,
        ...newTrackData,
      }));
      return { previousTracksData };
    },

    onError: (error, data, context) => {
      queryClient.setQueryData(
        ["tracks", params.id],
        context.previousTracksData
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(["tracks", params.id]);
    },
  });

  function handleSubmit(formData) {
    mutate({ id: formData.id, track: formData });
    navigate(-1);
  }

  function handleClose() {
    navigate(-1);
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <Error
          title="Failed to load event"
          message={error.info?.message || "Please try again"}
        />
        <div className="form-actons">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <TrackForm inputData={data} onSubmit={handleSubmit} trackOldData={data}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </TrackForm>
    );
  }

  return <>{content}</>;
};

export default EditTrack;
