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

  function handleClose() {
    navigate(-1);
  }

  const buttons = (
    <>
      <button type="button" className="bg-blue-950" onClick={handleClose}>
        Cancel
      </button>
      <button data-testid="submit-button" className="bg-green-950" type="submit">Create</button>
    </>
  );

  return (
    <>
      <TrackForm onSubmit={handleSubmit} buttons={buttons}></TrackForm>
      {isPending && "Submitting..."}
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
