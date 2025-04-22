import React from "react";
import Modal from "./Modal";

const DeleteTrack = ({ id, onStopDeleting, onStartDeleting }) => {
  return (
    <Modal onClose={onStopDeleting}>
      <h2>Are you sure?</h2>
      <div>
        <button type="button" onClick={onStartDeleting}>
          Delete
        </button>
        <button type="button" onClick={onStopDeleting}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteTrack;
