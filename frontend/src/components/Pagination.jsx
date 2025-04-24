const Pagination = ({ page, totalPages, onNext, onPrev }) => {
  return (
    <div data-testid="pagination">
      <button
        data-testid="pagination-prev"
        onClick={() => setPage((page) => Math.max(page - 1, 1))}
        disabled={page === 1}
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        data-testid="pagination-next"
        onClick={onNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
