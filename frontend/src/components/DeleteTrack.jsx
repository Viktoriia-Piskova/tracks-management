import React from "react";
import Modal from "./Modal";

const DeleteTrack = ({ onStopDeleting, onStartDeleting }) => {
  return (
    <Modal onClose={onStopDeleting}>
      <div data-testid="confirm-dialog">
        <h2>Are you sure?</h2>
        <div>
          <button type="button" onClick={onStartDeleting} data-testid="confirm-delete">
            Delete
          </button>
          <button type="button" onClick={onStopDeleting} data-testid="cancel-delete">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTrack;
