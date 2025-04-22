import React from "react";

const GenreTag = ({ children }) => {
  return (
    <button type="button" className="inline-flex bg-slate-400 m-2">
      <span>+</span>
      <p className="px-2">{children}</p>
      <span>x</span>
    </button>
  );
};

export default GenreTag;
