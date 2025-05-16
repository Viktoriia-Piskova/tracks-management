import React from "react";

const GenreTag = ({ genre, isSelected, onSelectGenre }) => {
  return (
    <button onClick={() => onSelectGenre(genre)}
      type="button"
      className={`button-small inline-flex p-1 rounded-md m-2 hover:bg-blue-400 ${
        isSelected ? "bg-slate-400" : "bg-slate-800"
      }`}
    >
      <p className="px-2">{genre}</p>
      {isSelected ? <span>x</span> : <span>+</span>}
    </button>
  );
};

export default GenreTag;
