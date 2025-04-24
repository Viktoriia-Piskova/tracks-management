const Pagination = ({ page, totalPages, onNext, onPrev }) => {
  return (
    <div data-testid="pagination" className="p-4 flex items-center gap-4">
      <button className="bg-blue-900 disabled:bg-gray-600 disabled:cursor-not-allowed"
        data-testid="pagination-prev"
        onClick={onPrev}
        disabled={page === 1}
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button className="bg-blue-900 disabled:bg-gray-600 disabled:cursor-not-allowed"
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
