import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createNewTrack } from "../utils/http.js";
import { queryClient } from "../utils/http.js";
import TrackForm from "../components/TrackForm.jsx";
import Error from "../components/Error.jsx";

const CreateTrack = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewTrack,
    onSuccess: () => {
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["tracks", 1] });
    },
  });

  function handleSubmit(formData) {
    mutate({ track: formData });
  }

  return (
    <>
      <TrackForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <button type="submit">Create</button>
          </>
        )}
      </TrackForm>
      {isError && (
        <Error
          title="Failed to create track"
          message={
            error.info?.message || "Please check your inputs and try again"
          }
        />
      )}
    </>
  );
};
export default CreateTrack;
