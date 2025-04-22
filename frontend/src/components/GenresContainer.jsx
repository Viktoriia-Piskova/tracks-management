import { useState, useEffect } from "react";
import GenreTag from "./GenreTag";

const GenresContainer = ({ genres, areSelected, onChangeSelectedGenres }) => {

  return (
    <>
      {genres.map((tag) => {
        return (
          <GenreTag key={tag} isSelected={areSelected} onSelectGenre={onChangeSelectedGenres} genre={tag}/>
          
        );
      })}
    </>
  );
};

export default GenresContainer;
