const Pagination = ({ page, totalPages, onNext, onPrev }) => {
  return (
    <div>
      <button
        onClick={() => setPage((page) => Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button onClick={onNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
