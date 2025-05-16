import { useState, useEffect } from "react";
import GenreTag from "./GenreTag";

const GenresContainer = ({ genres, areSelected, onChangeSelectedGenres }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((tag) => {
        return (
          <GenreTag
            key={tag}
            isSelected={areSelected}
            onSelectGenre={onChangeSelectedGenres}
            genre={tag}
          />
        );
      })}
    </div>
  );
};

export default GenresContainer;
